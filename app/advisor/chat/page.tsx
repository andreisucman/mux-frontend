"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Stack } from "@mantine/core";
import SkeletonWrapper from "@/app/SkeletonWrapper";
import PageHeader from "@/components/PageHeader";
import ChatMessagesButton from "../ConversationHistoryButton";
import ChatBody from "./ChatBody";
import classes from "./chat.module.css";

export const runtime = "edge";

export default function Chat() {
  const { userName } = useParams();
  return (
    <Stack className={`${classes.container} smallPage`}>
      <PageHeader
        title={"Advisor"}
        children={<ChatMessagesButton />}
        showReturn
        hidePartDropdown
        hideTypeDropdown
      />
      <SkeletonWrapper>
        <ChatBody userName={userName} />
      </SkeletonWrapper>
    </Stack>
  );
}
