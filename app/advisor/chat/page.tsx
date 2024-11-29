"use client";

import React from "react";
import { Stack, Title } from "@mantine/core";
import ChatBody from "../../components/ChatWidget/ChatBody";
import PageHeader from "../../components/PageHeader";
import classes from "./chat.module.css";

export const runtime = "edge";

export default function Chat() {
  return (
    <>
      <Stack className={classes.container}>
        <PageHeader title={"Ask advisor"} showReturn />
        <ChatBody />
      </Stack>
    </>
  );
}
