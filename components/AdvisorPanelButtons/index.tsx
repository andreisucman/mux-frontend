import React from "react";
import { useRouter as useDefaultRouter } from "next/navigation";
import { Button, Group } from "@mantine/core";
import { startNewChat } from "@/helpers/startNewChat";
import ConversationHistoryButton from "../ConversationHistoryButton";

type Props = {
  showNew?: boolean;
};
export default function AdvisorPanelButtons({ showNew }: Props) {
  const router = useDefaultRouter();
  return (
    <Group wrap="nowrap">
      <ConversationHistoryButton />
      {showNew && (
        <Button h={32} variant="default" size="sm" onClick={() => startNewChat(router)}>
          New
        </Button>
      )}
    </Group>
  );
}
