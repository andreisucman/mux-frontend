"use client";

import React, { useContext, useState } from "react";
import { Stack, Title } from "@mantine/core";
import { UserContext } from "@/context/UserContext";
import { useRouter } from "@/helpers/custom-router/patch-router/router";
import classes from "./start.module.css";

export const runtime = "edge";

export default function StartIndexPage() {
  return (
    <Stack className={classes.container}>
      <Title order={1}>Scan yourself</Title>
      <Stack className={classes.content}></Stack>
    </Stack>
  );
}
