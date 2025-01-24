"use client";

import React, { useEffect, useState } from "react";
import { Stack } from "@mantine/core";
import SkeletonWrapper from "@/app/SkeletonWrapper";
import AdvisorPanelButtons from "@/components/AdvisorPanelButtons";
import ChatDisplay from "@/components/ChatDisplay";
import ChatInput from "@/components/ChatInput";
import { MessageType } from "@/components/ChatInput/types";
import PageHeader from "@/components/PageHeader";
import { getFromIndexedDb } from "@/helpers/indexedDb";
import { ChatCategoryEnum } from "../diary/type";
import classes from "./chat.module.css";

export const runtime = "edge";
export default function Chat() {
  const [isThinking, setIsThinking] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversation, setConversation] = useState<MessageType[]>([]);

  useEffect(() => {
    getFromIndexedDb(`conversationId-advisor`).then((id) => {
      if (id) {
        setConversationId(id);
      }
    });
  }, []);

  return (
    <Stack className={`${classes.container} smallPage`}>
      <PageHeader
        title={"Advisor"}
        children={<AdvisorPanelButtons showNew />}
        showReturn
        hidePartDropdown
        hideTypeDropdown
      />
      <SkeletonWrapper>
        <ChatDisplay
          isThinking={isThinking}
          conversationId={conversationId}
          conversation={conversation}
          setConversation={setConversation}
          setConversationId={setConversationId}
          customContainerStyles={{ flex: 1 }}
          isOpen
        />
        <ChatInput
          isClub={false}
          defaultVisibility={"open"}
          conversation={conversation}
          chatCategory={ChatCategoryEnum.GENERAL}
          conversationId={conversationId}
          starterQuestions={[]}
          setConversation={setConversation}
          setConversationId={setConversationId}
          setIsThinking={setIsThinking}
          showEnergy
          autoFocus
          hideDivider
        />
      </SkeletonWrapper>
    </Stack>
  );
}
