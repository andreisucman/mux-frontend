"use client";

import React, { useContext } from "react";
import { useRouter } from "next/navigation";
import { Loader, Stack, Title } from "@mantine/core";
import { useShallowEffect } from "@mantine/hooks";
import PageHeader from "@/components/PageHeader";
import ProgressUploadCarousel from "../../../components/ProgressUploadCarousel";
import { UserContext } from "@/context/UserContext";
import modifyQuery from "@/helpers/modifyQuery";

export const runtime = "edge";

export default function StartScan() {
  const { userDetails } = useContext(UserContext);
  const router = useRouter();

  const requirementsFace = userDetails?.requiredProgress?.head;

  useShallowEffect(() => {
    if (!userDetails) return;
    if (requirementsFace && requirementsFace.length === 0) {
      const query = modifyQuery({
        params: [{ name: "job", value: "analysis", action: "replace" }],
      });
      router.push(`/u/wait?${query}`);
    }
  }, [requirementsFace?.length, userDetails]);

  return (
    <>
      {userDetails && requirementsFace?.length !== 0 ? (
        <Stack flex={1}>
          <PageHeader
            title={
              <Title order={2} fz="22" fw={600} lineClamp={3}>
                📸 Scan your head
              </Title>
            }
            showReturn
          />
          <ProgressUploadCarousel requirements={requirementsFace || []} />
        </Stack>
      ) : (
        <Stack flex={1} justify="center" align="center">
          <Loader type="oval" size={32} />
        </Stack>
      )}
    </>
  );
}
