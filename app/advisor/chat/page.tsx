"use client";

import React from "react";
import { Stack } from "@mantine/core";
import SkeletonWrapper from "@/app/SkeletonWrapper";
import PageHeader from "@/components/PageHeader";
import ChatMessagesButton from "../ConversationHistoryButton";
import ChatBody from "./ChatBody";
import classes from "./chat.module.css";

export const runtime = "edge";

export default function Chat() {
  return (
    <Stack className={`${classes.container} smallPage`}>
      <SkeletonWrapper>
        <PageHeader
          title={"Advisor"}
          children={<ChatMessagesButton />}
          showReturn
          hidePartDropdown
          hideTypeDropdown
        />
        <ChatBody />
      </SkeletonWrapper>
    </Stack>
  );
}
