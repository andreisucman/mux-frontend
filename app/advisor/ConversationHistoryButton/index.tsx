import React, { useCallback, useState } from "react";
import { IconCircleOff, IconMessage } from "@tabler/icons-react";
import { ActionIcon, Drawer, Loader, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import OverlayWithText from "@/components/OverlayWithText";
import callTheServer from "@/functions/callTheServer";
import ConversationsDrawerContent from "./ConversationsDrawerContent";
import { ConversationType } from "./types";
import classes from "./ConversationHistoryButton.module.css";

export default function ChatMessagesButton() {
  const [isDrawerOpen, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);
  const [conversations, setConversations] = useState<ConversationType[]>();

  const handleOpenDrawer = useCallback(async () => {
    try {
      openDrawer();

      const response = await callTheServer({
        endpoint: "getConversations",
        method: "GET",
        server: "chat",
      });

      if (response.status === 200) {
        setConversations(response.message);
      }
    } catch (err) {
      console.log("Error in handleOpenDrawer: ", handleOpenDrawer);
    }
  }, []);

  return (
    <>
      <ActionIcon variant="default" className={classes.container} onClick={handleOpenDrawer}>
        <IconMessage className="icon" />
      </ActionIcon>
      <Drawer
        opened={isDrawerOpen}
        title={
          <Title order={5} component="p">
            Latest chats
          </Title>
        }
        size="xs"
        position="left"
        classNames={{
          content: classes.drawerContent,
          body: classes.drawerBody,
        }}
        onClose={closeDrawer}
      >
        {conversations ? (
          <>
            {conversations.length > 0 ? (
              <ConversationsDrawerContent
                conversations={conversations}
                setConversations={setConversations}
              />
            ) : (
              <OverlayWithText icon={<IconCircleOff className="icon" />} text="No latest chats" />
            )}
          </>
        ) : (
          <Loader style={{ margin: "0 auto", paddingTop: "15%" }} />
        )}
      </Drawer>
    </>
  );
}
