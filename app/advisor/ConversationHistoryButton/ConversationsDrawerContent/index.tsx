import React, { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IconMessage, IconTrash } from "@tabler/icons-react";
import { ActionIcon, Stack, Text } from "@mantine/core";
import callTheServer from "@/functions/callTheServer";
import { formatDate } from "@/helpers/formatDate";
import modifyQuery from "@/helpers/modifyQuery";
import { ConversationType } from "../types";
import classes from "./ConversationsDrawerContent.module.css";

type Props = {
  conversations: ConversationType[];
  setConversations: React.Dispatch<React.SetStateAction<ConversationType[] | undefined>>;
  closeDrawer: () => void;
};

export default function ConversationsDrawerContent({
  conversations,
  setConversations,
  closeDrawer,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleDeleteConversation = useCallback(
    async (e: React.SyntheticEvent<HTMLButtonElement>, conversationId: string) => {
      e.stopPropagation();

      try {
        const response = await callTheServer({
          server: "chat",
          endpoint: "deleteConversation",
          method: "POST",
          body: { conversationId },
        });

        if (response.status === 200) {
          setConversations((prev: ConversationType[] | undefined) => {
            const newConverations = (prev || []).filter((c) => c._id !== conversationId);
            if (newConverations.length === 0) {
              router.replace("/advisor");
              closeDrawer();
            }
            return newConverations;
          });
        }
      } catch (err) {}
    },
    [searchParams.toString()]
  );

  const handleRedirectToChat = useCallback((conversationId: string) => {
    const query = modifyQuery({
      params: [{ name: "conversationId", value: conversationId, action: "replace" }],
    });
    router.push(`/advisor/chat?${query}`);
    closeDrawer();
  }, []);

  return (
    <Stack className={classes.content}>
      {conversations.map((conversation) => {
        const date = formatDate({ date: conversation.updatedAt });

        return (
          <Stack
            className={classes.stack}
            key={conversation._id}
            onClick={() => handleRedirectToChat(conversation._id)}
          >
            <ActionIcon
              className={classes.deleteIcon}
              size="sm"
              variant="default"
              onClick={(e) => handleDeleteConversation(e, conversation._id)}
            >
              <IconTrash className="icon icon__small" />
            </ActionIcon>
            <Text c="dimmed" className={classes.date}>
              {date}
            </Text>
            <Text variant="default" className={classes.text} lineClamp={2}>
              <IconMessage className={`icon ${classes.icon}`} /> {conversation.title}
            </Text>
          </Stack>
        );
      })}
    </Stack>
  );
}
