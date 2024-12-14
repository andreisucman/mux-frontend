import React, { useContext, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Collapse, rem, Stack, Text } from "@mantine/core";
import { useFocusWithin } from "@mantine/hooks";
import ChatDisplay from "@/app/advisor/chat/ChatDisplay";
import ChatInput from "@/app/advisor/chat/ChatInput";
import { MessageType } from "@/app/advisor/types";
import { ClubContext } from "@/context/ClubDataContext";
import classes from "./ClubChatContainer.module.css";

type Props = { disabled?: boolean };

export default function ClubChatContainer({ disabled }: Props) {
  const searchParams = useSearchParams();
  const { ref: focusRef, focused } = useFocusWithin();
  const { youTrackData } = useContext(ClubContext);
  const [isTyping, setIsTyping] = useState(false);
  const [conversation, setConversation] = useState<MessageType[]>([]);

  const followingUserId = searchParams.get("id");
  const name = followingUserId ? `the ${youTrackData?.name}'s` : "your";
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
            Answers are based on {name} info
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
        defaultOpen={!!followingUserId}
        disabled={disabled}
        conversation={conversation}
        followingUserId={followingUserId}
        setConversation={setConversation}
        setIsTyping={setIsTyping}
      />
    </Stack>
  );
}
