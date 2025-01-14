"use client";

import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Loader, rem, Stack } from "@mantine/core";
import { useElementSize, useScrollIntoView } from "@mantine/hooks";
import callTheServer from "@/functions/callTheServer";
import { MessageType, RecentMessageType } from "../ChatInput/types";
import Message from "../Message";
import classes from "./ChatDisplay.module.css";

type Props = {
  conversation: MessageType[];
  isTyping: boolean;
  isOpen: boolean;
  isInList?: boolean;
  customContainerStyles?: { [key: string]: any };
  customScrollAreaStyles?: { [key: string]: any };
  setConversation: React.Dispatch<React.SetStateAction<MessageType[]>>;
};

export default function ChatDisplay({
  isTyping,
  isOpen,
  isInList,
  customContainerStyles,
  customScrollAreaStyles,
  conversation,
  setConversation,
}: Props) {
  const searchParams = useSearchParams();
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const { scrollIntoView, targetRef, scrollableRef } = useScrollIntoView<
    HTMLDivElement,
    HTMLDivElement
  >({ duration: 500, isList:isInList });
  const { ref, height } = useElementSize();

  const conversationId = searchParams.get("conversationId");

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
          const conversation: MessageType[] = [];
          response.message.map((m: RecentMessageType) => {
            conversation.push(
              {
                role: "assistant",
                content: m.assistant,
              },
              {
                role: "user",
                content: m.user,
              }
            );
          });

          setConversation(conversation.reverse());
        }
      } catch (err) {}
    },
    [conversationId]
  );

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
    [conversation.length, lastMessageRef.current]
  );

  useEffect(() => {
    getMessages(conversationId);
  }, [conversationId]);

  useEffect(() => {
    if (!isOpen) return;
    // if (disableScrollIntoView) return;
    // if (!lastMessageRef.current) return;
    console.log("ran24");
    scrollIntoView();
  }, [conversation.length, isOpen, height, scrollableRef.current, targetRef.current]);

  return (
    <Stack
      className={classes.container}
      style={customContainerStyles ? customContainerStyles : {}}
      ref={ref}
    >
      <Stack
        ref={scrollableRef}
        className={classes.scrollArea}
        style={customScrollAreaStyles ? customScrollAreaStyles : {}}
      >
        {conversationList}
        {isTyping && <Loader ml="auto" mr={rem(16)} type="dots" />}
      </Stack>
    </Stack>
  );
}
