"use client";

import React, { createContext, useCallback, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { nprogress } from "@mantine/nprogress";
import { defaultUser } from "@/data/defaultUser";
import authenticate from "@/functions/authenticate";
import fetchUserData from "@/functions/fetchUserData";
import { getCookieValue } from "@/helpers/cookies";
import { useRouter } from "@/helpers/custom-router/patch-router/router";
import { getFromLocalStorage, saveToLocalStorage } from "@/helpers/localStorage";
import { UserDataType } from "@/types/global";
import { protectedPaths } from "./protectedPaths";
import { AuthStateEnum, UserContextProviderProps, UserContextType } from "./types";

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
    });
  }
}

const defaultSetUser = () => {};

const defaultSetStatus: React.Dispatch<React.SetStateAction<AuthStateEnum>> = () => {};

export const UserContext = createContext<UserContextType>({
  status: AuthStateEnum.UNAUTHENTICATED,
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
  const onProtectedPage = protectedPaths.some((path) => path.includes(pathname));
  const isLoggedInCookie = getCookieValue("MUX_isLoggedIn");

  const [status, setStatus] = useState(AuthStateEnum.UNKNOWN);
  const [userDetailsState, setUserDetailsState] = useState<Partial<UserDataType> | null>(null);
  const { emailVerified } = userDetailsState || {};

  const setUserDetails = useCallback(
    (value: React.SetStateAction<Partial<UserDataType | null>>) => {
      setUserDetailsState((prevState: Partial<UserDataType> | null) => {
        const newState = typeof value === "function" ? value(prevState as UserDataType) : value;
        saveToLocalStorage("userDetails", newState);
        return newState;
      });
    },
    []
  );

  const updateAuthenticationStatus = useCallback((isLoggedInCookie: boolean) => {
    setStatus(isLoggedInCookie ? AuthStateEnum.AUTHENTICATED : AuthStateEnum.UNAUTHENTICATED);
  }, []);

  const savedState: UserDataType | null = getFromLocalStorage("userDetails");

  useEffect(() => {
    if (userDetailsState) return;

    setUserDetailsState(savedState);
  }, [savedState, userDetailsState]);

  useEffect(() => {
    if (!error) return;

    if (error) {
      window.history.go(-3); // when the user declines auth in google return to the page before the auth
      nprogress.complete();
    }
  }, [error]);

  useEffect(() => {
    if (!code) return;

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
  }, [isLoggedInCookie, code]);

  useEffect(() => {
    if (!status || !pathname) return;
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
    const isException = exceptions.some((path) => pathname.includes(path));

    if (onProtectedPage && pathname !== "/" && !isException) {
      if (status !== AuthStateEnum.AUTHENTICATED && status !== AuthStateEnum.UNKNOWN) {
        router.replace("/auth");
      }
    }
  }, [status, pathname]);

  useEffect(() => {
    if (!userDetailsState) return;
    if (code) return;

    if (onProtectedPage && status === AuthStateEnum.AUTHENTICATED) {
      if (!userDetailsState.emailVerified) {
        if (pathname !== "/settings" && pathname !== "/verify-email") {
          router.push("/verify-email");
          return;
        }
      }
    }
  }, [emailVerified, pathname, code]);

  useSWR(`${status}-${code}-${error}`, () => {
    if (code) return;
    if (error) return;
    fetchUserData({ setUserDetails });
  });

  useEffect(() => {
    registerServiceWorker();
  }, []);

  return (
    <UserContext.Provider
      value={{
        userDetails: userDetailsState,
        setUserDetails,
        status: status as AuthStateEnum,
        setStatus,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
