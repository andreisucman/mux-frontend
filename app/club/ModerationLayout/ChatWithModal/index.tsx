import React from "react";
import { Modal, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import ChatInput from "@/components/ChatInput";
import InnerChatContainer from "./InnerChatContainer";
import classes from "./ChatWithModal.module.css";

type Props = {
  isClub?: boolean;
  modalTitle?: React.ReactNode;
  disabled?: boolean;
  userName?: string | string[];
  openChatKey?: string;
  disclaimer?: string;
  dividerLabel?: string;
  chatCategory?: string;
  chatContentId?: string;
  defaultVisibility?: "open" | "closed";
};

export default function ChatWithModal({
  isClub,
  disabled,
  userName,
  disclaimer,
  dividerLabel,
  modalTitle,
  openChatKey,
  chatCategory,
  chatContentId,
  defaultVisibility,
}: Props) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <Stack className={classes.container}>
      <Modal opened={opened} onClose={close} size="lg" title={modalTitle} centered>
        <InnerChatContainer
          disabled={disabled}
          userName={userName}
          disclaimer={disclaimer}
          dividerLabel={dividerLabel}
          chatCategory={chatCategory}
          chatContentId={chatContentId}
          isClub={isClub}
        />
      </Modal>

      <ChatInput
        defaultVisibility={defaultVisibility}
        openChatKey={openChatKey}
        dividerLabel={dividerLabel}
        disabled={disabled}
        onClick={open}
      />
    </Stack>
  );
}
