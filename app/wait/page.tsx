"use client";

import React, { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Stack } from "@mantine/core";
import WaitComponent from "@/components/WaitComponent";
import { deleteFromLocalStorage } from "@/helpers/localStorage";
import { decodeAndCheckUriComponent } from "@/helpers/utils";

export const runtime = "edge";

export default function WaitPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const type = searchParams.get("type") || "head";
  const redirect = searchParams.get("next") || `/analysis${type ? `?type=${type}` : ""}`;
  const finalRedirect = decodeURIComponent(redirect);

  const hideDisclaimer = useMemo(() => {
    const path = finalRedirect.split("?").shift();
    return path !== "/analysis";
  }, [finalRedirect]);

  const onComplete = useCallback(() => {
    try {
      const uriComponent = decodeAndCheckUriComponent(finalRedirect);

      if (uriComponent) {
        router.replace(finalRedirect);
      }
    } catch (e) {
      console.error("Invalid redirect URL", e);
    }
  }, [type, typeof router]);

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
