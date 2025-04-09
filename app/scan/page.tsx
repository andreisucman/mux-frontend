"use client";

import React, { useCallback, useContext } from "react";
import { Group, Stack, Title } from "@mantine/core";
import { UserContext } from "@/context/UserContext";
import { useRouter } from "@/helpers/custom-router";
import openAuthModal from "@/helpers/openAuthModal";
import SexSelector from "../../components/SexSelector";
import { ReferrerEnum } from "../auth/AuthForm/types";
import StartButton from "./StartButton";
import classes from "./scan.module.css";

export const runtime = "edge";

export default function ScanIndexPage() {
  const router = useRouter();
  const { status, userDetails } = useContext(UserContext);
  const { _id: userId, email } = userDetails || {};

  const handleRedirect = useCallback(
    (redirectPath: string, redirectQuery?: string) => {
      let redirectUrl = redirectPath;
      if (redirectQuery) redirectUrl += `?${redirectQuery}`;

      if (status === "authenticated") {
        router.push(redirectUrl);
      } else {
        if (email) {
          // the user has finished the onboarding
          openAuthModal({
            title: "Sign in to continue",
            stateObject: {
              redirectPath,
              redirectQuery,
              localUserId: userId,
              referrer: ReferrerEnum.SCAN_INDEX,
            },
          });
        } else {
          const encodedPath = `/accept?redirectUrl=${encodeURIComponent(redirectUrl)}`; // the user is coming for the first time
          router.push(encodedPath);
        }
      }
    },
    [status, userDetails]
  );

  return (
    <Stack className={classes.container}>
      <Stack className={classes.wrapper}>
        <Group align="center">
          <Title order={1}>Scan yourself</Title>
          <SexSelector />
        </Group>
        <Group className={classes.content}>
          <StartButton
            part={"face"}
            onClick={() => handleRedirect("/scan/progress", "part=face")}
          />
          <StartButton
            part={"hair"}
            onClick={() => handleRedirect("/scan/progress", "part=hair")}
          />
        </Group>
      </Stack>
    </Stack>
  );
}
