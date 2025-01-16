import React, { useState } from "react";
import { Collapse, rem, Stack, Text } from "@mantine/core";
import { useFocusWithin } from "@mantine/hooks";
import ChatDisplay from "@/components/ChatDisplay";
import ChatInput from "@/components/ChatInput";
import { MessageType } from "@/components/ChatInput/types";
import useGetConversationId from "@/functions/useGetConversationId";
import classes from "./ChatWithOverlay.module.css";

type Props = {
  disabled?: boolean;
  userName?: string | string[];
  disclaimer?: string;
  openChatKey?: string;
  dividerLabel?: string;
  chatCategory?: string;
  chatContentId?: string;
  collapseStyles?: { [key: string]: any };
  defaultVisibility?: "open" | "closed";
};

export default function ChatWithOverlay({
  disabled,
  userName,
  openChatKey,
  disclaimer,
  dividerLabel,
  collapseStyles,
  chatCategory,
  chatContentId,
  defaultVisibility,
}: Props) {
  const { ref: focusRef, focused } = useFocusWithin();
  const [isTyping, setIsTyping] = useState(false);
  const [conversation, setConversation] = useState<MessageType[]>([]);

  const openChat = disabled ? false : focused && conversation.length > 0;

  const { conversationId, setConversationId } = useGetConversationId({
    chatCategory,
    chatContentId,
  });

  return (
    <Stack className={classes.container} ref={focusRef}>
      <Collapse
        in={openChat}
        className={classes.collapse}
        style={collapseStyles || {}}
        transitionDuration={250}
        transitionTimingFunction="linear"
      >
        <Stack className={classes.chatDisplayWrapper}>
          {disclaimer && (
            <Text className={classes.disclaimer} c="dimmed">
              {disclaimer}
            </Text>
          )}
          <ChatDisplay
            isTyping={isTyping}
            isOpen={openChat}
            conversationId={conversationId}
            chatContentId={chatContentId}
            conversation={conversation}
            setConversationId={setConversationId}
            setConversation={setConversation}
            customContainerStyles={{ flex: 1 }}
            customScrollAreaStyles={{ padding: rem(8) }}
          />
        </Stack>
      </Collapse>
      <ChatInput
        defaultVisibility={defaultVisibility}
        disabled={disabled}
        conversationId={conversationId}
        conversation={conversation}
        openChatKey={openChatKey}
        userName={userName}
        dividerLabel={dividerLabel}
        chatCategory={chatCategory}
        chatContentId={chatContentId}
        setConversation={setConversation}
        setConversationId={setConversationId}
        setIsTyping={setIsTyping}
        isClub
      />
    </Stack>
  );
}
