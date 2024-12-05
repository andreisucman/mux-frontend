"use client";

import React, { useCallback, useContext } from "react";
import { Group, Stack, Title } from "@mantine/core";
import { UserContext } from "@/context/UserContext";
import { useRouter } from "@/helpers/custom-router";
import openAuthModal from "@/helpers/openAuthModal";
import useCheckScanAvailability from "@/helpers/useCheckScanAvailability";
import StartButton from "./StartButton";
import classes from "./scan.module.css";

export const runtime = "edge";

export default function ScanIndexPage() {
  const router = useRouter();
  const { status, userDetails } = useContext(UserContext);
  const { _id: userId, email, nextScan, requiredProgress } = userDetails || {};

  const { needsScan: needsHeadScan, nextScanDate: nextHeadScanDate } = useCheckScanAvailability({
    nextScan,
    requiredProgress,
    scanType: "head",
  });

  const { needsScan: needsBodyScan, nextScanDate: nextBodyScanDate } = useCheckScanAvailability({
    nextScan,
    requiredProgress,
    scanType: "body",
  });

  const handleRedirect = useCallback(
    (next: string) => {
      if (status === "authenticated") {
        router.push(next);
      } else {
        if (email) { // the user has finished the onboarding
          openAuthModal({
            formType: "login",
            showTos: false,
            title: "Login to continue",
            stateObject: { redirectTo: next },
          });
        } else {
          if (userId) {
            router.push(next); // the user accepted the tos but did not finish the onboarding
          } else {
            const encodedPath = `/accept?next=${encodeURIComponent(next)}`; // the user is coming for the first time
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
            type={"head"}
            position={"front"}
            needsScan={needsHeadScan}
            nextScanDate={nextHeadScanDate}
            onClick={() => handleRedirect("/scan/progress?type=head")}
          />
          <StartButton
            type={"body"}
            position={"front"}
            needsScan={needsBodyScan}
            nextScanDate={nextBodyScanDate}
            onClick={() => handleRedirect("/scan/progress?type=body")}
          />
          <StartButton
            needsScan={true}
            type={"style"}
            position={"body"}
            onClick={() => handleRedirect("/scan/style?type=head")}
          />
          <StartButton
            needsScan={true}
            type={"food"}
            position={"front"}
            onClick={() => handleRedirect("/scan/style?type=head")}
          />
        </Group>
      </Stack>
    </Stack>
  );
}
