"use client";

import React from "react";
import { Group, Stack, Title } from "@mantine/core";
import { useRouter } from "@/helpers/custom-router";
import StartButton from "./StartButton";
import classes from "./select-part.module.css";

export const runtime = "edge";

export default function SelectPartPage() {
  const router = useRouter();

  return (
    <Stack className={classes.container}>
      <Stack className={classes.wrapper}>
        <Group align="center">
          <Title order={1}>Select part</Title>
        </Group>
        <Group className={classes.content}>
          <StartButton part={"face"} onClick={() => router.push(`/select-concerns?part=face`)} />
          <StartButton part={"hair"} onClick={() => router.push(`/select-concerns?part=hair`)} />
        </Group>
      </Stack>
    </Stack>
  );
}
