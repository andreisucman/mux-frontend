"use client";

import React, { useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Stack } from "@mantine/core";
import { useRouter } from "@/helpers/custom-router";
import WaitComponent from "@/components/WaitComponent";
import { deleteFromLocalStorage } from "@/helpers/localStorage";

export const runtime = "edge";

export default function WaitPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const type = searchParams.get("type") || "head";
  const encodedRedirectUrl =
    searchParams.get("redirectUrl") || `/analysis${type ? `?type=${type}` : ""}`;
  const redirectUrl = decodeURIComponent(encodedRedirectUrl);

  const hideDisclaimer = useMemo(() => {
    const path = redirectUrl.split("?").shift();
    return path !== "/analysis";
  }, [redirectUrl]);

  const onComplete = useCallback(() => {
    try {
      if (redirectUrl) {
        router.replace(redirectUrl);
      }
    } catch (e) {
      console.error("Invalid redirect URL", e);
    }
  }, [type, redirectUrl, typeof router]);

  const onError = useCallback(() => {
    deleteFromLocalStorage("userDetails");
    deleteFromLocalStorage("runningAnalyses", type || "head");
  }, []);

  return (
    <Stack flex={1} className="smallPage">
      <WaitComponent
        description="Analyzing your data"
        operationKey={type}
        onComplete={onComplete}
        errorRedirectUrl="/scan"
        onError={onError}
        hideDisclaimer={hideDisclaimer}
      />
    </Stack>
  );
}
