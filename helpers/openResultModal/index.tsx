import React from "react";
import { rem, Title, UnstyledButton } from "@mantine/core";
import { modals } from "@mantine/modals";
import ProgressModalContent from "@/app/results/ProgressModalContent";
import ProofModalContent from "@/app/results/proof/ProofModalContent";
import { SimpleProofType } from "@/app/results/proof/types";
import { SimpleProgressType } from "@/app/results/types";
import { SimpleBeforeAfterType } from "@/app/types";
import AvatarComponent from "@/components/AvatarComponent";
import Link from "../custom-router/patch-router/link";
import classes from "./openResultModal.module.css";

type OpenViewModalProps = {
  record: SimpleBeforeAfterType | SimpleProofType | SimpleProgressType;
  title: React.ReactNode;
  type: "progress" | "proof";
  isPublicPage?: boolean;
  setRecords?: React.Dispatch<React.SetStateAction<any[] | undefined>>;
};

export default function openResultModal({ record, title, type, isPublicPage }: OpenViewModalProps) {

  const content =
    type === "progress" ? (
      <ProgressModalContent record={record as SimpleBeforeAfterType} isPublicPage={isPublicPage} />
    ) : (
      <ProofModalContent record={record as SimpleProofType} isPublicPage={isPublicPage} />
    );

  modals.openContextModal({
    centered: true,
    modal: "general",
    title,
    size: rem(960),
    innerProps: content,
    removeScrollProps: { allowPinchZoom: true },
    styles: {
      content: { display: "flex", flexDirection: "column" },
      body: { display: "flex", flexDirection: "column", flex: 1 },
    },
    classNames: { content: "scrollbar" },
  });
}

type GetRedirectModalTitleProps = {
  redirectUrl: string;
  avatar: { [key: string]: any } | null;
  title: string;
};

export function getRedirectModalTitle({ redirectUrl, avatar, title }: GetRedirectModalTitleProps) {
  return (
    <UnstyledButton
      className={classes.container}
      component={Link}
      href={redirectUrl}
      onClick={() => modals.closeAll()}
    >
      <AvatarComponent avatar={avatar} size="xs" />
      <Title order={5} ml="0" lineClamp={2}>
        {title}
      </Title>
    </UnstyledButton>
  );
}
