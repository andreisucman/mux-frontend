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
  isThinking: boolean;
  chatContentId?: string;
  conversationId: string | null;
  isInList?: boolean;
  customContainerStyles?: { [key: string]: any };
  customScrollAreaStyles?: { [key: string]: any };
  setConversation: React.Dispatch<React.SetStateAction<MessageType[]>>;
  setConversationId: React.Dispatch<React.SetStateAction<string | null>>;
};

export default function ChatDisplay({
  isThinking,
  isInList,
  customContainerStyles,
  customScrollAreaStyles,
  conversation,
  conversationId,
  chatContentId,
  setConversation,
  setConversationId,
}: Props) {
  const scrollTid = useRef<any>();
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const { scrollIntoView, targetRef, scrollableRef } = useScrollIntoView<
    HTMLDivElement,
    HTMLDivElement
  >({ duration: 500, cancelable: false, isList: isInList });
  const { height, ref } = useElementSize();

  const getMessages = useCallback(async (conversationId: string | null) => {
    try {
      const response = await callTheServer({
        endpoint: `getMessages/${conversationId}`,
        method: "GET",
        server: "chat",
      });

      if (response.status === 200) {
        setConversation(response.message);

        scrollTid.current = setTimeout(() => {
          scrollIntoView({ alignment: "center" });
          clearTimeout(scrollTid.current);
        }, 1000);
      }
    } catch (err) {}
  }, []);

  const startNewChat = useCallback(() => {
    deleteFromIndexedDb(`conversationId-${chatContentId}`);
    setConversationId(null);
    setConversation([]);
  }, [chatContentId]);

  const conversationList = useMemo(
    () =>
      conversation
        .map((item, index) => {
          if (!item.content) return null;
          const messages = item.content.map((obj, objIndex) => (
            <React.Fragment key={objIndex}>
              <Message
                divRef={index === conversation.length - 1 ? lastMessageRef : undefined}
                message={obj}
                role={item.role}
              />
            </React.Fragment>
          ));
          return messages;
        })
        .filter(Boolean),
    [conversation, conversationId, lastMessageRef.current]
  );

  useEffect(() => {
    if (!conversationId || conversation.length > 0) return;

    getMessages(conversationId);
  }, [conversationId, conversation.length > 0]);

  useEffect(() => {
    scrollIntoView();
  }, [conversation]);

  return (
    <Stack
      className={classes.container}
      ref={ref}
      style={customContainerStyles ? customContainerStyles : {}}
    >
      {conversationList.length > 0 && (
        <ActionIcon variant="default" className={classes.refresh} onClick={startNewChat}>
          <IconRotate2 className="icon icon__small" />
        </ActionIcon>
      )}
      <Stack
        className={`${classes.scrollArea} scrollbar`}
        style={customScrollAreaStyles ? customScrollAreaStyles : {}}
        ref={scrollableRef}
      >
        {conversationList}
        <span className={classes.bgText}>Ask advisor</span>
        {isThinking && <Loader ml="auto" mr={rem(16)} type="dots" />}
        <div className={classes.empty} ref={targetRef} />
      </Stack>
    </Stack>
  );
}
