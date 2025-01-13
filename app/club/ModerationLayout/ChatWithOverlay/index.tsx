import React, { useState } from "react";
import { Collapse, rem, Stack, Text } from "@mantine/core";
import { useFocusWithin } from "@mantine/hooks";
import ChatDisplay from "@/app/advisor/chat/ChatDisplay";
import ChatInput from "@/app/advisor/chat/ChatInput";
import { MessageType } from "@/app/advisor/types";
import classes from "./ChatWithOverlay.module.css";

type Props = {
  disabled?: boolean;
  userName?: string | string[];
  disclaimer?: string;
  dividerLabel?: string;
  chatCategory?: string;
  chatContentId?: string;
  collapseStyles?: { [key: string]: any };
  defaultVisibility?: "open" | "closed";
};

export default function ChatWithOverlay({
  disabled,
  userName,
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
            conversation={conversation}
            setConversation={setConversation}
            customContainerStyles={{ flex: 1 }}
            customScrollAreaStyles={{ padding: rem(8) }}
          />
        </Stack>
      </Collapse>
      <ChatInput
        defaultVisibility={defaultVisibility}
        disabled={disabled}
        conversation={conversation}
        userName={userName}
        dividerLabel={dividerLabel}
        chatCategory={chatCategory}
        chatContentId={chatContentId}
        setConversation={setConversation}
        setIsTyping={setIsTyping}
        isClub
      />
    </Stack>
  );
}
