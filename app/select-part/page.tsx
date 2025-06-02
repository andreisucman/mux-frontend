"use client";

import React, { useContext } from "react";
import { useSearchParams } from "next/navigation";
import { Alert, Group, Stack } from "@mantine/core";
import PageHeader from "@/components/PageHeader";
import { UserContext } from "@/context/UserContext";
import checkActionAvailability from "@/helpers/checkActionAvailability";
import { useRouter } from "@/helpers/custom-router";
import StartButton from "./StartButton";
import classes from "./select-part.module.css";

export const runtime = "edge";

export default function SelectPartPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userDetails } = useContext(UserContext);
  const { nextScan } = userDetails || {};

  const handleRedirect = (part: string) => {
    const { isActionAvailable } = checkActionAvailability({
      part,
      nextAction: nextScan,
    });

    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("part", part);
    const query = newSearchParams.toString();

    let url = `/select-concerns${query ? `?${query}` : ""}`;

    if (!isActionAvailable) {
      url = `/analysis${query ? `?${query}` : ""}`;
    }

    router.push(url);
  };

  return (
    <Stack className={classes.container}>
      <Stack className={classes.wrapper}>
        <Group className={classes.titleWrapper}>
          <PageHeader title="Select part" />
          <Alert p="0.5rem 1rem">Select the part that you are aiming to improve</Alert>
        </Group>
        <Group className={classes.content}>
          <StartButton isFirst part={"face"} onClick={() => handleRedirect("face")} />
          <StartButton part={"hair"} onClick={() => handleRedirect("hair")} />
          <StartButton part={"body"} onClick={() => handleRedirect("body")} />
        </Group>
      </Stack>
    </Stack>
  );
}
