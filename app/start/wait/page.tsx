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

  useEffect(() => {
    if (userId) return;
    if (!userId) router.replace("/");
  }, [type, userId]);

  const onComplete = useCallback(() => {
    router.replace(`/start/analysis?type=${type}`);
  }, [type]);

  return (
    <Stack flex={1}>
      <WaitComponent
        type={type as string}
        onComplete={onComplete}
        errorRedirectUrl="/start"
        customWrapperStyles={
          isMobile ? { transform: "translateY(-5%)" } : { transform: "translateY(-25%)" }
        }
      />
    </Stack>
  );
}
