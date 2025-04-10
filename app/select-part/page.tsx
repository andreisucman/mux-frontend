"use client";

import React, { useCallback, useContext } from "react";
import { Group, Stack, Title } from "@mantine/core";
import { UserContext } from "@/context/UserContext";
import { useRouter } from "@/helpers/custom-router";
import openAuthModal from "@/helpers/openAuthModal";
import { ReferrerEnum } from "../auth/AuthForm/types";
import StartButton from "./StartButton";
import classes from "./select-part.module.css";

export const runtime = "edge";

export default function SelectPartPage() {
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
          openAuthModal({
            title: "Sign in to continue",
            stateObject: {
              redirectPath,
              redirectQuery,
              localUserId: userId,
              referrer: ReferrerEnum.CHOOSE_PART,
            },
          });
        } else {
          const encodedPath = `/accept?redirectUrl=${encodeURIComponent(redirectUrl)}`;
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
          <Title order={1}>Select part</Title>
        </Group>
        <Group className={classes.content}>
          <StartButton
            part={"face"}
            onClick={() => handleRedirect("/select-concerns", "part=face")}
          />
          <StartButton
            part={"hair"}
            onClick={() => handleRedirect("/select-concerns", "part=hair")}
          />
        </Group>
      </Stack>
    </Stack>
  );
}
