"use client";

import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { IconRotate2 } from "@tabler/icons-react";
import { ActionIcon, Loader, rem, Stack } from "@mantine/core";
import { useElementSize, useScrollIntoView } from "@mantine/hooks";
import callTheServer from "@/functions/callTheServer";
import { deleteFromIndexedDb } from "@/helpers/indexedDb";
import { MessageType } from "../ChatInput/types";
import Message from "../Message";
import classes from "./ChatDisplay.module.css";

type Props = {
  conversation: MessageType[];
  isTyping: boolean;
  isOpen: boolean;
  chatContentId?: string;
  conversationId: string | null;
  isInList?: boolean;
  customContainerStyles?: { [key: string]: any };
  customScrollAreaStyles?: { [key: string]: any };
  setConversation: React.Dispatch<React.SetStateAction<MessageType[]>>;
  setConversationId: React.Dispatch<React.SetStateAction<string | null>>;
};

export default function ChatDisplay({
  isTyping,
  isOpen,
  isInList,
  customContainerStyles,
  customScrollAreaStyles,
  conversation,
  conversationId,
  chatContentId,
  setConversation,
  setConversationId,
}: Props) {
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const { scrollIntoView, targetRef, scrollableRef } = useScrollIntoView<
    HTMLDivElement,
    HTMLDivElement
  >({ duration: 500, isList: isInList });
  const { ref, height } = useElementSize();

  const getMessages = useCallback(
    async (conversationId: string | null) => {
      try {
        if (!conversationId) {
          setConversation([]);
          return;
        }
        const response = await callTheServer({
          endpoint: `getMessages/${conversationId}`,
          method: "GET",
          server: "chat",
        });

        if (response.status === 200) {
          setConversation(response.message);
        }
      } catch (err) {}
    },
    [conversationId]
  );

  const startNewChat = useCallback(() => {
    deleteFromIndexedDb(`conversationId-${chatContentId}`);
    setConversationId(null);
    setConversation([]);
  }, [chatContentId]);

  const conversationList = useMemo(
    () =>
      conversation.map((item, index) => {
        const messages = item.content.map((obj, objIndex) => (
          <Message
            key={objIndex}
            message={obj}
            role={item.role}
            divRef={
              index === conversation.length - 1 && objIndex === item.content.length - 1
                ? targetRef
                : undefined
            }
          />
        ));
        return messages;
      }),
    [conversation.length, conversationId, lastMessageRef.current]
  );

  useEffect(() => {
    getMessages(conversationId);
  }, [conversationId]);

  useEffect(() => {
    if (!isOpen) return;
    scrollIntoView();
  }, [height]);

  return (
    <Stack
      className={classes.container}
      style={customContainerStyles ? customContainerStyles : {}}
      ref={ref}
    >
      {conversationList.length > 0 && (
        <ActionIcon variant="default" className={classes.refresh} onClick={startNewChat}>
          <IconRotate2 className="icon icon__small" />
        </ActionIcon>
      )}
      <Stack
        ref={scrollableRef}
        className={classes.scrollArea}
        style={customScrollAreaStyles ? customScrollAreaStyles : {}}
      >
        {conversationList}
        <span className={classes.bgText}>Ask advisor</span>
        {isTyping && <Loader ml="auto" mr={rem(16)} type="dots" />}
      </Stack>
    </Stack>
  );
}
