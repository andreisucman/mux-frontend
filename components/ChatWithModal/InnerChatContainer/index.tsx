import React, { useEffect, useMemo, useState } from "react";
import { Stack, Text } from "@mantine/core";
import { ChatCategoryEnum } from "@/app/diary/type";
import ChatDisplay from "@/components/ChatDisplay";
import ChatInput from "@/components/ChatInput";
import { MessageType } from "@/components/ChatInput/types";
import getConversationStarters from "@/data/conversationStarters";
import { getFromIndexedDb } from "@/helpers/indexedDb";
import classes from "./InnerChatContainer.module.css";

type Props = {
  disabled?: boolean;
  isClub?: boolean;
  additionalData?: { [key: string]: any };
  userName?: string | string[];
  openChatKey?: string;
  disclaimer?: string;
  dividerLabel?: string;
  starterQuestions?: string[];
  chatCategory?: ChatCategoryEnum;
  chatContentId?: string;
};

export default function InnerChatContainer({
  disabled,
  userName,
  isClub,
  additionalData = {},
  openChatKey,
  disclaimer,
  dividerLabel,
  starterQuestions,
  chatCategory,
  chatContentId,
}: Props) {
  const [isThinking, setIsThinking] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversation, setConversation] = useState<MessageType[]>([]);

  useEffect(() => {
    const key = chatContentId || chatCategory;
    if (!key) return;

    getFromIndexedDb(`conversationId-${key}`).then((id) => {
      if (id) {
        setConversationId(id);
      }
    });
  }, [chatCategory, chatContentId]);

  const finalStarterQuestions = useMemo(
    () =>
      starterQuestions
        ? starterQuestions
        : chatCategory
          ? getConversationStarters(chatCategory, isClub)
          : [],
    [chatCategory, starterQuestions]
  );

  return (
    <Stack className={classes.container}>
      {disclaimer && (
        <Text className={classes.disclaimer} c="dimmed">
          {disclaimer}
        </Text>
      )}
      <ChatDisplay
        isThinking={isThinking}
        chatContentId={chatContentId}
        conversationId={conversationId}
        conversation={conversation}
        setConversation={setConversation}
        setConversationId={setConversationId}
        customContainerStyles={{ flex: 1 }}
      />
      <ChatInput
        defaultVisibility={"open"}
        conversation={conversation}
        disabled={disabled}
        userName={userName}
        dividerLabel={dividerLabel}
        chatCategory={chatCategory}
        chatContentId={chatContentId}
        isClub={isClub}
        additionalData={additionalData}
        openChatKey={openChatKey}
        conversationId={conversationId}
        setConversation={setConversation}
        setConversationId={setConversationId}
        setIsThinking={setIsThinking}
        starterQuestions={finalStarterQuestions}
        showEnergy
        autoFocus
        hideDivider
      />
    </Stack>
  );
}
