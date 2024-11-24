"use client";

import React, { useCallback, useContext } from "react";
import { Group, Stack, Title } from "@mantine/core";
import { UserContext } from "@/context/UserContext";
import signIn from "@/functions/signIn";
import { useRouter } from "@/helpers/custom-router";
import useCheckScanAvailability from "@/helpers/useCheckScanAvailability";
import StartButton from "./StartButton";
import classes from "./scan.module.css";

export const runtime = "edge";

export default function ScanIndexPage() {
  const router = useRouter();
  const { status, userDetails } = useContext(UserContext);
  const { _id: userId, email, nextScan, requiredProgress } = userDetails || {};

  const { overlayChildren: headOverlayChildren } = useCheckScanAvailability({
    nextScan,
    requiredProgress,
    scanType: "head",
  });

  const { overlayChildren: bodyOverlayChildren } = useCheckScanAvailability({
    nextScan,
    requiredProgress,
    scanType: "body",
  });

  const handleRedirect = useCallback(
    (next: string) => {
      if (status === "authenticated") {
        router.push(next);
      } else {
        if (email) {
          signIn({ router, state: { redirectTo: next } }); // add each of the scan path as reirect uri in google
        } else {
          if (userId) {
            router.push(next); // the user accepted the tos but did not finish the onboarding
          } else {
            const encodedPath = `/accept?${encodeURIComponent(next)}`; // the user is coming for the first time
            router.push(encodedPath);
          }
        }
      }
    },
    [status, email, userId]
  );

  return (
    <Stack className={classes.container}>
      <Stack className={classes.wrapper}>
        <Title order={1}>Scan yourself</Title>
        <Group className={classes.content}>
          <StartButton
            title={"Scan head"}
            overlayChildren={headOverlayChildren}
            onClick={() => handleRedirect("/scan?type=head")}
          />
          <StartButton
            title={"Scan body"}
            overlayChildren={bodyOverlayChildren}
            onClick={() => handleRedirect("/scan?type=body")}
          />
          <StartButton
            title={"Scan style"}
            onClick={() => handleRedirect("/scan/style?type=head")}
          />
        </Group>
      </Stack>
    </Stack>
  );
}
