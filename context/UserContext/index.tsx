"use client";

import React, { createContext, useCallback, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { defaultUser } from "@/data/defaultUser";
import { requireAuthPaths } from "@/data/paths";
import callTheServer from "@/functions/callTheServer";
import { getCookieValue } from "@/helpers/cookies";
import { useRouter } from "@/helpers/custom-router/patch-router/router";
import { getFromLocalStorage, saveToLocalStorage } from "@/helpers/localStorage";
import openErrorModal from "@/helpers/openErrorModal";
import { UserDataType } from "@/types/global";
import { UserContextProviderProps, UserContextType } from "./types";

const defaultSetUser = () => {};

const defaultSetStatus: React.Dispatch<
  React.SetStateAction<"unauthenticated" | "loading" | "authenticated" | "unknown">
> = () => {};

export const UserContext = createContext<UserContextType>({
  status: "unauthenticated",
  setStatus: defaultSetStatus,
  userDetails: defaultUser,
  setUserDetails: defaultSetUser,
});

const UserContextProvider: React.FC<UserContextProviderProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const onProtectedPage = requireAuthPaths.includes(pathname);
  const isLoggedInCookie = getCookieValue("MYO_isLoggedIn");

  const [status, setStatus] = useState("unknown");
  const [userDetailsState, setUserDetailsState] = useState<UserDataType | null>(null);

  const setUserDetails = useCallback((value: React.SetStateAction<UserDataType | null>) => {
    setUserDetailsState((prevState: UserDataType | null) => {
      const newState = typeof value === "function" ? value(prevState as UserDataType) : value;
      saveToLocalStorage("userDetails", newState);
      return newState;
    });
  }, []);

  useEffect(() => {
    if (!status || status === "unknown") return;
    if (status !== "authenticated" && onProtectedPage) {
      router.replace("/auth");
    }
  }, [status]);

  const updateAuthenticationStatus = useCallback((isLoggedInCookie: boolean) => {
    setStatus(isLoggedInCookie ? "authenticated" : "unauthenticated");
  }, []);

  const handleAuthenticate = useCallback(async (code: string, state: string | null) => {
    try {
      const parsedState = state ? JSON.parse(decodeURIComponent(state)) : {};
      const { localUserId, redirectTo, trackedUserId } = parsedState;

      const response = await callTheServer({
        endpoint: "authenticate",
        method: "POST",
        body: {
          code: code as string,
          localUserId,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          state,
        },
      });

      if (response.status === 200) {
        if (response.error === "blocked") {
          openErrorModal({
            title: `🚨 Account blocked`,
            description: `We have temporarily blocked your account while we investigate a potential violation of our Terms of Service. Please check your email for more details.`,
          });
          setStatus("unauthenticated");
          return;
        }
        const updatedUserDetails = {
          ...userDetailsState,
          ...response.message,
        };
        console.log("updatedUserDetails", updatedUserDetails);
        setUserDetails(updatedUserDetails as UserDataType);
        setStatus("authenticated");

        if (redirectTo) {
          router.replace(`/a/club/about/routine?trackedUserId=${trackedUserId}`);
        } else {
          router.replace("/a/routine");
        }
      } else {
        const rejected = response.status === 401 || response.status === 403;
        if (rejected && onProtectedPage) {
          router.replace("/");
          setStatus("unauthenticated");
        }
      }
    } catch (err) {
      console.log(`Error in handleAuthenticate: `, err);
    }
  }, []);

  useEffect(() => {
    if (userDetailsState) return;

    const savedState: UserDataType | null = getFromLocalStorage("userDetails");
    console.log("savedState", savedState);
    setUserDetailsState(savedState);
  }, [status]);

  useEffect(() => {
    if (!error) return;

    if (error) {
      window.history.go(-3); // when the user declines auth return to the page before the auth
    }
  }, [error]);

  useEffect(() => {
    if (!code) return;

    const state = searchParams.get("state");
    handleAuthenticate(code, state);
  }, [code]);

  useEffect(() => updateAuthenticationStatus(!!isLoggedInCookie), [isLoggedInCookie]);

  return (
    <UserContext.Provider
      value={{
        userDetails: userDetailsState,
        setUserDetails,
        status: status as "loading",
        setStatus,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
