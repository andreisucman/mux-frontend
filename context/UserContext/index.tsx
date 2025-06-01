"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { nprogress } from "@mantine/nprogress";
import { defaultUser } from "@/data/defaultUser";
import authenticate from "@/functions/authenticate";
import fetchUserData from "@/functions/fetchUserData";
import { getCookieValue } from "@/helpers/cookies";
import { getFromLocalStorage, saveToLocalStorage } from "@/helpers/localStorage";
import { UserDataType } from "@/types/global";
import { protectedPaths } from "./protectedPaths";
import { AuthStateEnum, UserContextProviderProps, UserContextType } from "./types";
import { matchBySegments } from "@/helpers/utils";

function registerServiceWorker() {
  if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
    });
  }
}

const defaultSetUser: React.Dispatch<React.SetStateAction<Partial<UserDataType> | null>> = () => {};

const defaultSetStatus: React.Dispatch<React.SetStateAction<AuthStateEnum>> = () => {};

export const UserContext = createContext<UserContextType>({
  status: AuthStateEnum.UNAUTHENTICATED,
  setStatus: defaultSetStatus,
  userDetails: defaultUser,
  setUserDetails: defaultSetUser,
});

export const useUserContext = () => useContext(UserContext);

const UserContextProvider: React.FC<UserContextProviderProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const code = searchParams.get("code");
  const error = searchParams.get("error");

  const onProtectedPage = protectedPaths.some((p) => matchBySegments(p, pathname));

  const isLoggedInCookie = getCookieValue("MUX_isLoggedIn");

  const [status, setStatus] = useState<AuthStateEnum>(AuthStateEnum.UNKNOWN);
  const [userDetailsState, setUserDetailsState] = useState<Partial<UserDataType> | null>(null);
  const [calledAuthenticate, setCalledAuthenticate] = useState(false);

  const { emailVerified } = userDetailsState || {};

  const setUserDetails = useCallback(
    (value: React.SetStateAction<Partial<UserDataType> | null>) => {
      setUserDetailsState((prevState) => {
        const newState =
          typeof value === "function" ? value(prevState ?? ({} as UserDataType)) : value;
        saveToLocalStorage("userDetails", newState);
        return newState;
      });
    },
    []
  );

  const updateAuthenticationStatus = useCallback((hasCookie: boolean) => {
    setStatus(hasCookie ? AuthStateEnum.AUTHENTICATED : AuthStateEnum.UNAUTHENTICATED);
  }, []);

  const savedState: UserDataType | null = getFromLocalStorage("userDetails");

  useEffect(() => {
    if (userDetailsState) return;
    setUserDetailsState(savedState);
  }, [savedState, userDetailsState]);

  useEffect(() => {
    if (!error) return;

    window.history.go(-3); // fallback for declined Google auth
    nprogress.complete();
  }, [error]);

  useEffect(() => {
    if (!code || calledAuthenticate) return;
    setCalledAuthenticate(true);

    const state = searchParams.get("state");

    authenticate({
      state,
      code,
      router,
      setStatus,
      setUserDetails,
    });
  }, [code]);

  useEffect(() => {
    if (code) return;
    updateAuthenticationStatus(!!isLoggedInCookie);
  }, [isLoggedInCookie, code, updateAuthenticationStatus]);

  useEffect(() => {
    if (!pathname) return;

    const exceptions = [
      "/club/routines",
      "/club/progress",
      "/club/proof",
      "/club/diary",
      "/select-part",
      "/select-concern",
      "/scan",
      "/wait",
      "/analysis",
    ];
    const isException = exceptions.some((p) => matchBySegments(p, pathname));

    if (onProtectedPage && !isException && pathname !== "/") {
      if (status !== AuthStateEnum.AUTHENTICATED && status !== AuthStateEnum.UNKNOWN) {
        router.replace("/auth");
      }
    }
  }, [status, pathname, onProtectedPage, router]);

  useEffect(() => {
    if (!userDetailsState || code) return;

    if (onProtectedPage && status === AuthStateEnum.AUTHENTICATED) {
      if (!emailVerified) {
        if (
          !matchBySegments("/settings", pathname) &&
          !matchBySegments("/verify-email", pathname)
        ) {
          router.push("/verify-email");
        }
      }
    }
  }, [emailVerified, pathname, code, onProtectedPage, status, router, userDetailsState]);

  useSWR(status === AuthStateEnum.AUTHENTICATED && !code && !error ? "user" : null, () =>
    fetchUserData({ setUserDetails })
  );

  useEffect(() => {
    registerServiceWorker();
  }, []);

  return (
    <UserContext.Provider
      value={{
        userDetails: userDetailsState,
        setUserDetails,
        status,
        setStatus,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
