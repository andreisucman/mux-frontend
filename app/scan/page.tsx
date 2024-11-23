"use client";

import React, { useContext } from "react";
import { Loader, Stack, Title } from "@mantine/core";
import { useShallowEffect } from "@mantine/hooks";
import ProgressUploadCarousel from "@/components/ProgressUploadCarousel";
import { UserContext } from "@/context/UserContext";
import { useRouter } from "@/helpers/custom-router/patch-router/router";
import modifyQuery from "@/helpers/modifyQuery";

export const runtime = "edge";

export default function StartScan() {
  const router = useRouter();
  const { userDetails } = useContext(UserContext);

  const { requiredProgress } = userDetails || {};
  const { head: requirementsHead } = requiredProgress || {};

  useShallowEffect(() => {
    if (!userDetails) return;
    if (requirementsHead && requirementsHead.length === 0) {
      const query = modifyQuery({
        params: [{ name: "job", value: "analysis", action: "replace" }],
      });
      router.push(`/u/wait?${query}`);
    }
  }, [requirementsHead?.length, userDetails]);

  return (
    <>
      {userDetails && requirementsHead?.length !== 0 ? (
        <Stack flex={1}>
          <Title order={1}>Scan your head</Title>
          <ProgressUploadCarousel requirements={requirementsHead || []} />
        </Stack>
      ) : (
        <Stack flex={1} justify="center" align="center">
          <Loader type="oval" size={32} />
        </Stack>
      )}
    </>
  );
}
