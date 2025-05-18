"use client";

import React, {
  createContext,
  useCallback,
  useEffect,
  useState,
  useContext,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { nprogress } from "@mantine/nprogress";
import { defaultUser } from "@/data/defaultUser";
import authenticate from "@/functions/authenticate";
import fetchUserData from "@/functions/fetchUserData";
import { getCookieValue } from "@/helpers/cookies";
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from "@/helpers/localStorage";
import { UserDataType } from "@/types/global";
import { protectedPaths } from "./protectedPaths";
import {
  AuthStateEnum,
  UserContextProviderProps,
  UserContextType,
} from "./types";

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
    });
  }
}

const defaultSetUser: React.Dispatch<
  React.SetStateAction<Partial<UserDataType> | null>
> = () => {};

const defaultSetStatus: React.Dispatch<
  React.SetStateAction<AuthStateEnum>
> = () => {};

export const UserContext = createContext<UserContextType>({
  status: AuthStateEnum.UNAUTHENTICATED,
  setStatus: defaultSetStatus,
  userDetails: defaultUser,
  setUserDetails: defaultSetUser,
});

export const useUserContext = () => useContext(UserContext);

const UserContextProvider: React.FC<UserContextProviderProps> = ({
  children,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const code = searchParams.get("code");
  const error = searchParams.get("error");

  const onProtectedPage = protectedPaths.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  const isLoggedInCookie = getCookieValue("MUX_isLoggedIn");

  const [status, setStatus] = useState<AuthStateEnum>(AuthStateEnum.UNKNOWN);
  const [userDetailsState, setUserDetailsState] = useState<
    Partial<UserDataType> | null
  >(null);

  const { emailVerified } = userDetailsState || {};

  const setUserDetails = useCallback(
    (value: React.SetStateAction<Partial<UserDataType> | null>) => {
      setUserDetailsState((prevState) => {
        const newState =
          typeof value === "function"
            ? value(prevState ?? ({} as UserDataType))
            : value;
        saveToLocalStorage("userDetails", newState);
        return newState;
      });
    },
    []
  );

  const updateAuthenticationStatus = useCallback((hasCookie: boolean) => {
    setStatus(
      hasCookie ? AuthStateEnum.AUTHENTICATED : AuthStateEnum.UNAUTHENTICATED
    );
  }, []);

  const savedState: UserDataType | null = getFromLocalStorage("userDetails");

  // hydrate from localStorage once
  useEffect(() => {
    if (userDetailsState) return;
    setUserDetailsState(savedState);
  }, [savedState, userDetailsState]);

  // handle OAuth error
  useEffect(() => {
    if (!error) return;

    window.history.go(-3); // fallback for declined Google auth
    nprogress.complete();
  }, [error]);

  // handle OAuth code
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  // keep status in sync with cookie
  useEffect(() => {
    if (code) return;
    updateAuthenticationStatus(!!isLoggedInCookie);
  }, [isLoggedInCookie, code, updateAuthenticationStatus]);

  // protect private routes
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
    const isException = exceptions.some((p) => pathname.includes(p));

    if (onProtectedPage && !isException && pathname !== "/") {
      if (
        status !== AuthStateEnum.AUTHENTICATED &&
        status !== AuthStateEnum.UNKNOWN
      ) {
        router.replace("/auth");
      }
    }
  }, [status, pathname, onProtectedPage, router]);

  // enforce e‑mail verification
  useEffect(() => {
    if (!userDetailsState || code) return;

    if (onProtectedPage && status === AuthStateEnum.AUTHENTICATED) {
      if (!emailVerified) {
        if (pathname !== "/settings" && pathname !== "/verify-email") {
          router.push("/verify-email");
        }
      }
    }
  }, [
    emailVerified,
    pathname,
    code,
    onProtectedPage,
    status,
    router,
    userDetailsState,
  ]);

  // keep user data fresh while authenticated
  useSWR(
    status === AuthStateEnum.AUTHENTICATED && !code && !error ? "user" : null,
    () => fetchUserData({ setUserDetails })
  );

  // register service‑worker once
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