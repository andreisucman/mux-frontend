import React, { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IconMessage, IconTrash } from "@tabler/icons-react";
import { ActionIcon, Skeleton, Stack, Text } from "@mantine/core";
import callTheServer from "@/functions/callTheServer";
import { formatDate } from "@/helpers/formatDate";
import modifyQuery from "@/helpers/modifyQuery";
import { ConversationType } from "../types";
import classes from "./ConversationsDrawerContent.module.css";

type Props = {
  conversations: ConversationType[];
  setConversations: React.Dispatch<React.SetStateAction<ConversationType[] | undefined>>;
};

export default function ConversationsDrawerContent({ conversations, setConversations }: Props) {
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
          const localId = searchParams.get("conversationId");
          setConversations((prev) => prev?.filter((c) => c._id !== conversationId));

          if (localId === conversationId) {
            const query = modifyQuery({
              params: [{ name: "conversationId", value: null, action: "delete" }],
            });

            router.replace(`/advisor?${query}`);
          }
        }
      } catch (err) {
        console.log("Error in handleDeleteConversation: ", err);
      }
    },
    [searchParams.toString()]
  );

  const handleRedirectToChat = useCallback((conversationId: string) => {
    const query = modifyQuery({
      params: [{ name: "conversationId", value: conversationId, action: "replace" }],
    });
    router.push(`/advisor/chat?${query}`);
  }, []);

  return (
    <Stack className={classes.content}>
      {conversations.map((conversation) => (
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
            <IconTrash className="icon" />
          </ActionIcon>
          <Text c="dimmed" className={classes.date}>
            {formatDate({ date: conversation.initialDate })}
          </Text>
          <Text variant="default" className={classes.text} lineClamp={2}>
            <IconMessage className="icon" /> {conversation.title}
          </Text>
        </Stack>
      ))}
    </Stack>
  );
}
