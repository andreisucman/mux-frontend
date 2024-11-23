"use client";

import React, { useCallback, useContext, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Stack } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import WaitComponent from "@/components/WaitComponent";
import { UserContext } from "@/context/UserContext";

export const runtime = "edge";

export default function StartWait() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userDetails } = useContext(UserContext);
  const { _id: userId } = userDetails || {};

  const isMobile = useMediaQuery("(max-width: 36em)");
  const type = searchParams.get("type") || "head";
  const finalType = type === "health" ? "head" : type;
  const job = searchParams.get("job") || "progress";

  const onComplete = useCallback(() => {
    const path = job === "progress" ? `/analysis` : `/analysis/style`;
    router.replace(`${path}?type=${finalType}`);
  }, [finalType]);

  useEffect(() => {
    if (userId) return;
    if (!userId) router.replace("/");
  }, [userId]);

  return (
    <Stack flex={1}>
      <WaitComponent
        type={type as string}
        onComplete={onComplete}
        errorRedirectUrl="/start"
        hideDisclaimer={job === "style"}
        customWrapperStyles={
          isMobile ? { transform: "translateY(-5%)" } : { transform: "translateY(-25%)" }
        }
      />
    </Stack>
  );
}
