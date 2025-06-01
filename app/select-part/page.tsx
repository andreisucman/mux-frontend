"use client";

import React from "react";
import { Alert, Group, Stack } from "@mantine/core";
import PageHeader from "@/components/PageHeader";
import { useRouter } from "@/helpers/custom-router";
import StartButton from "./StartButton";
import classes from "./select-part.module.css";

export const runtime = "edge";

export default function SelectPartPage() {
  const router = useRouter();

  return (
    <Stack className={classes.container}>
      <Stack className={classes.wrapper}>
        <Group className={classes.titleWrapper}>
          <PageHeader title="Select part" />
          <Alert p="0.5rem 1rem">Select a part that you are aiming to improve</Alert>
        </Group>
        <Group className={classes.content}>
          <StartButton
            isFirst
            part={"face"}
            onClick={() => router.push(`/select-concerns?part=face`)}
          />
          <StartButton part={"hair"} onClick={() => router.push(`/select-concerns?part=hair`)} />
          <StartButton part={"body"} onClick={() => router.push(`/select-concerns?part=body`)} />
        </Group>
      </Stack>
    </Stack>
  );
}
