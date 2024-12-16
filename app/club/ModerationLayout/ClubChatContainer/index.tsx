import React, { useContext, useState } from "react";
import { Collapse, rem, Stack, Text } from "@mantine/core";
import { useFocusWithin } from "@mantine/hooks";
import ChatDisplay from "@/app/advisor/chat/ChatDisplay";
import ChatInput from "@/app/advisor/chat/ChatInput";
import { MessageType } from "@/app/advisor/types";
import { UserContext } from "@/context/UserContext";
import classes from "./ClubChatContainer.module.css";

type Props = { disabled?: boolean; userName?: string | string[] };

export default function ClubChatContainer({ userName, disabled }: Props) {
  const { userDetails } = useContext(UserContext);
  const { ref: focusRef, focused } = useFocusWithin();
  const [isTyping, setIsTyping] = useState(false);
  const [conversation, setConversation] = useState<MessageType[]>([]);

  const { name } = userDetails || {};
  const isSelf = name === userName;

  const text = userName ? `the ${userName}'s` : "your";
  const openChat = disabled ? false : focused && conversation.length > 0;

  return (
    <Stack className={classes.container} ref={focusRef}>
      <Collapse
        in={openChat}
        className={classes.collapse}
        transitionDuration={250}
        transitionTimingFunction="linear"
      >
        <Stack className={classes.chatDisplayWrapper}>
          <Text className={classes.disclaimer} c="dimmed">
            Answers are based on {text} info
          </Text>
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
        isClub={true}
        defaultOpen={!isSelf}
        disabled={disabled}
        conversation={conversation}
        userName={userName}
        setConversation={setConversation}
        setIsTyping={setIsTyping}
      />
    </Stack>
  );
}
