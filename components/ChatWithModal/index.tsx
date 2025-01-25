import React from "react";
import { Modal, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ChatCategoryEnum } from "@/app/diary/type";
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
  additionalData?: { [key: string]: any };
  dividerLabel?: string;
  starterQuestions?: string[];
  chatCategory?: ChatCategoryEnum;
  chatContentId?: string;
  defaultVisibility?: "open" | "closed";
};

export default function ChatWithModal({
  isClub,
  disabled,
  additionalData,
  starterQuestions,
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
      <Modal
        opened={opened}
        closeOnClickOutside={false}
        onClose={close}
        size="xl"
        title={modalTitle}
        centered
      >
        <InnerChatContainer
          disabled={disabled}
          userName={userName}
          disclaimer={disclaimer}
          dividerLabel={dividerLabel}
          chatCategory={chatCategory}
          chatContentId={chatContentId}
          starterQuestions={starterQuestions}
          additionalData={additionalData}
          isClub={isClub}
        />
      </Modal>
      <ChatInput
        defaultVisibility={defaultVisibility}
        openChatKey={openChatKey}
        dividerLabel={dividerLabel}
        disabled={disabled}
        onClick={open}
        starterQuestions={[]}
        disableFocus
      />
    </Stack>
  );
}
