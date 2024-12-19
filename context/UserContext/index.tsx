"use client";

import React, { createContext, useCallback, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { defaultUser } from "@/data/defaultUser";
import authenticate from "@/functions/authenticate";
import fetchUserData from "@/functions/fetchUserData";
import { getCookieValue } from "@/helpers/cookies";
import { useRouter } from "@/helpers/custom-router/patch-router/router";
import { getFromLocalStorage, saveToLocalStorage } from "@/helpers/localStorage";
import { UserDataType } from "@/types/global";
import { protectedPaths } from "./protectedPaths";
import { AuthStateEnum, UserContextProviderProps, UserContextType } from "./types";

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
  const onProtectedPage = protectedPaths.includes(pathname);
  const isLoggedInCookie = getCookieValue("MUX_isLoggedIn");

  const [status, setStatus] = useState(AuthStateEnum.UNKNOWN);
  const [userDetailsState, setUserDetailsState] = useState<Partial<UserDataType> | null>(null);

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

  useEffect(() => {
    if (userDetailsState) return;

    const savedState: UserDataType | null = getFromLocalStorage("userDetails");
    setUserDetailsState(savedState);
  }, [status]);

  useEffect(() => {
    if (!error) return;

    if (error) {
      window.history.go(-3); // when the user declines auth in google return to the page before the auth
    }
  }, [error]);

  useEffect(() => {
    if (!code) return;

    const state = searchParams.get("state");
    authenticate({ code, state, router, setStatus, setUserDetails });
  }, [code]);

  useEffect(() => {
    if (code) return;
    updateAuthenticationStatus(!!isLoggedInCookie);
  }, [isLoggedInCookie, code]);

  useEffect(() => {
    if (!status || status === AuthStateEnum.UNKNOWN) return;

    if (onProtectedPage) {
      if (status !== AuthStateEnum.AUTHENTICATED) {
        router.replace("/auth");
      }
    }
  }, [status]);

  useEffect(() => {
    if (!userDetailsState) return;
    if (code) return;

    if (onProtectedPage) {
      if (!userDetailsState.emailVerified) {
        if (pathname !== "/settings") {
          router.push("/verify-email");
          return;
        }
      }
    }
  }, [userDetailsState?.emailVerified, pathname, code]);

  useSWR(`${status}-${code}-${error}`, () => {
    if (code) return;
    if (error) return;
    fetchUserData(setUserDetails);
  });

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
