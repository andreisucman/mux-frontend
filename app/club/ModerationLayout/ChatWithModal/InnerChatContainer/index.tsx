import React, { useEffect, useState } from "react";
import { rem, Stack, Text } from "@mantine/core";
import ChatDisplay from "@/components/ChatDisplay";
import ChatInput from "@/components/ChatInput";
import { MessageType } from "@/components/ChatInput/types";
import { getFromIndexedDb } from "@/helpers/indexedDb";
import classes from "./InnerChatContainer.module.css";

type Props = {
  disabled?: boolean;
  isClub?: boolean;
  userName?: string | string[];
  openChatKey?: string;
  disclaimer?: string;
  dividerLabel?: string;
  chatCategory?: string;
  chatContentId?: string;
};

export default function InnerChatContainer({
  disabled,
  userName,
  isClub,
  openChatKey,
  disclaimer,
  dividerLabel,
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
        isOpen
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
        openChatKey={openChatKey}
        conversationId={conversationId}
        setConversation={setConversation}
        setConversationId={setConversationId}
        setIsThinking={setIsThinking}
        showEnergy
        autoFocus
      />
    </Stack>
  );
}
