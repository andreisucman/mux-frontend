"use client";

import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Loader, rem, Stack } from "@mantine/core";
import callTheServer from "@/functions/callTheServer";
import { MessageType, RecentMessageType } from "../../types";
import Message from "../Message";
import classes from "./ChatDisplay.module.css";

type Props = {
  conversation: MessageType[];
  isTyping: boolean;
  customContainerStyles?: { [key: string]: any };
  customScrollAreaStyles?: { [key: string]: any };
  setConversation: React.Dispatch<React.SetStateAction<MessageType[]>>;
};

export default function ChatDisplay({
  isTyping,
  customContainerStyles,
  customScrollAreaStyles,
  conversation,
  setConversation,
}: Props) {
  const searchParams = useSearchParams();
  const lastMessageRef = useRef<HTMLDivElement>(null);

  const conversationId = searchParams.get("conversationId");

  const getMessages = useCallback(async () => {
    try {
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
    } catch (err) {
    }
  }, [conversationId]);

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
                ? lastMessageRef
                : undefined
            }
          />
        ));
        return messages;
      }),
    [conversation.length, lastMessageRef.current]
  );

  useEffect(() => {
    if (!conversationId) return;
    getMessages();
  }, [conversationId]);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation.length]);

  return (
    <Stack className={classes.container} style={customContainerStyles ? customContainerStyles : {}}>
      <Stack
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
