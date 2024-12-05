"use client";

import React, { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Stack } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import WaitComponent from "@/components/WaitComponent";
import { decodeAndCheckUriComponent } from "@/helpers/utils";

export const runtime = "edge";

export default function WaitPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const isMobile = useMediaQuery("(max-width: 36em)");
  const type = searchParams.get("type") || "head";
  const finalType = type === "health" ? "head" : type;
  const redirect = searchParams.get("redirect") || `/analysis?type=${finalType}`;
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
  }, [finalType, typeof router]);

  return (
    <Stack flex={1} className="smallPage">
      <WaitComponent
        description="Analyzing your data"
        operationKey={type}
        onComplete={onComplete}
        errorRedirectUrl="/scan"
        hideDisclaimer={hideDisclaimer}
        customWrapperStyles={
          isMobile ? { transform: "translateY(-5%)" } : { transform: "translateY(-25%)" }
        }
      />
    </Stack>
  );
}
