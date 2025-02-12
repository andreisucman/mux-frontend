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

  const operationKey = searchParams.get("operationKey") || "progress";
  const onErrorRedirect = searchParams.get("onErrorRedirectUrl") || "";
  const onErrorRedirectUrl = decodeURIComponent(onErrorRedirect);

  const encodedRedirectUrl = searchParams.get("redirectUrl") || "/analysis";
  const redirectUrl = decodeURIComponent(encodedRedirectUrl);

  const hideDisclaimer = useMemo(() => {
    const path = redirectUrl.split("?").shift();
    return path !== "/analysis";
  }, [redirectUrl]);

  const onComplete = useCallback(
    (userData: UserDataType) => {
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
    [redirectUrl, userDetails, typeof router]
  );

  const onError = useCallback(() => {
    deleteFromLocalStorage("runningAnalyses", operationKey || "progress");
  }, [operationKey]);

  return (
    <Stack flex={1} className="smallPage">
      <WaitComponent
        description="Analyzing your data"
        operationKey={operationKey}
        errorRedirectUrl={onErrorRedirectUrl || "/scan"}
        hideDisclaimer={hideDisclaimer}
        onComplete={onComplete}
        onError={onError}
      />
    </Stack>
  );
}
