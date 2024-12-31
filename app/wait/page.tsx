"use client";

import React, { useCallback, useContext, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Stack } from "@mantine/core";
import WaitComponent from "@/components/WaitComponent";
import { UserContext } from "@/context/UserContext";
import { deleteFromLocalStorage } from "@/helpers/localStorage";
import { UserDataType } from "@/types/global";

export const runtime = "edge";

export default function WaitPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userDetails, setUserDetails } = useContext(UserContext);

  const type = searchParams.get("type") || "head";
  const operationKey = searchParams.get("operationKey");
  const onErrorRedirect = searchParams.get("onErrorRedirectUrl") || "";
  const onErrorRedirectUrl = decodeURIComponent(onErrorRedirect);

  const encodedRedirectUrl =
    searchParams.get("redirectUrl") || `/analysis${type ? `?type=${type}` : ""}`;
  const redirectUrl = decodeURIComponent(encodedRedirectUrl);

  const hideDisclaimer = useMemo(() => {
    const path = redirectUrl.split("?").shift();
    return path !== "/analysis";
  }, [redirectUrl]);

  const onComplete = useCallback(
    (userData: UserDataType) => {
      console.log("onComplete userData", userData);
      try {
        setUserDetails((prev: UserDataType) => ({
          ...prev,
          ...userData,
        }));

        if (redirectUrl) {
          router.replace(redirectUrl);
        }
      } catch (e) {
        console.error("Invalid redirect URL", e);
      }
    },
    [type, redirectUrl, userDetails, typeof router]
  );

  const onError = useCallback(() => {
    setUserDetails(null);
    deleteFromLocalStorage("userDetails");
    deleteFromLocalStorage("runningAnalyses", type || "head");
  }, [type]);

  return (
    <Stack flex={1} className="smallPage">
      <WaitComponent
        description="Analyzing your data"
        operationKey={operationKey || type}
        errorRedirectUrl={onErrorRedirectUrl || "/scan"}
        hideDisclaimer={hideDisclaimer}
        onComplete={onComplete}
        onError={onError}
      />
    </Stack>
  );
}
