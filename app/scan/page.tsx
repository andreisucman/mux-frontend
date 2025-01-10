"use client";

import React, { useCallback, useContext } from "react";
import { IconGenderFemale, IconGenderMale } from "@tabler/icons-react";
import { Group, SegmentedControl, Stack, Title } from "@mantine/core";
import { UserContext } from "@/context/UserContext";
import { useRouter } from "@/helpers/custom-router";
import openAuthModal from "@/helpers/openAuthModal";
import { ScanTypeEnum, UserDataType } from "@/types/global";
import { ReferrerEnum } from "../auth/AuthForm/types";
import StartButton from "./StartButton";
import classes from "./scan.module.css";

export const runtime = "edge";

const sexes = [
  {
    value: "female",
    label: <IconGenderFemale className="icon" style={{ display: "flex" }} />,
  },
  {
    value: "male",
    label: <IconGenderMale className="icon" style={{ display: "flex" }} />,
  },
];

export default function ScanIndexPage() {
  const router = useRouter();
  const { status, userDetails, setUserDetails } = useContext(UserContext);
  const { _id: userId, email, demographics } = userDetails || {};
  const { sex } = demographics || {};

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

  const handleChangeSex = (value: string) =>
    setUserDetails((prev: UserDataType) => ({
      ...(prev || {}),
      demographics: { ...(prev || {}).demographics, sex: value },
    }));

  return (
    <Stack className={classes.container}>
      <Stack className={classes.wrapper}>
        <Group align="center">
          <Title order={1}>Scan yourself</Title>
          <SegmentedControl
            value={sex || "female"}
            data={sexes}
            onChange={(value) => handleChangeSex(value)}
          />
        </Group>
        <Group className={classes.content}>
          <StartButton
            scanType={ScanTypeEnum.PROGRESS}
            type={"body"}
            onClick={() => handleRedirect("/scan/progress", "type=head")}
          />
          <StartButton
            scanType={ScanTypeEnum.STYLE}
            type={"body"}
            onClick={() => handleRedirect("/scan/style", "type=head")}
          />
          <StartButton
            scanType={ScanTypeEnum.FOOD}
            type={"food"}
            onClick={() => handleRedirect("/scan/food")}
          />
        </Group>
      </Stack>
    </Stack>
  );
}
