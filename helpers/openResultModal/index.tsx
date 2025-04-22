import React from "react";
import { rem, UnstyledButton } from "@mantine/core";
import { modals } from "@mantine/modals";
import ProgressModalContent from "@/app/results/ProgressModalContent";
import BeforeAfterModalContent from "@/app/results/ProgressModalContent/BeforeAfterModalContent";
import ProofModalContent from "@/app/results/proof/ProofModalContent";
import { SimpleProofType } from "@/app/results/proof/types";
import { SimpleProgressType } from "@/app/results/types";
import { BeforeAfterType } from "@/app/types";
import AvatarComponent from "@/components/AvatarComponent";
import { AvatarType } from "@/types/global";
import Link from "../custom-router/patch-router/link";
import classes from "./openResultModal.module.css";

type OpenViewModalProps = {
  record: BeforeAfterType | SimpleProofType | SimpleProgressType;
  title: React.ReactNode;
  isPublicPage?: boolean;
  type: "proof" | "progress" | "ba";
  setRecords?: React.Dispatch<React.SetStateAction<any[] | undefined>>;
};

export default function openResultModal({ record, type, title, isPublicPage }: OpenViewModalProps) {
  let content: any;

  switch (type) {
    case "progress":
      content = (
        <ProgressModalContent record={record as SimpleProgressType} isPublicPage={isPublicPage} />
      );
      break;
    case "ba":
      content = (
        <BeforeAfterModalContent record={record as BeforeAfterType} isPublicPage={isPublicPage} />
      );
      break;
    case "proof":
      content = (
        <ProofModalContent record={record as SimpleProofType} isPublicPage={isPublicPage} />
      );
      break;
  }

  modals.openContextModal({
    centered: true,
    modal: "general",
    title,
    classNames: { overlay: "overlay", content: "scrollbar" },
    size: rem(960),
    innerProps: content,
    removeScrollProps: { allowPinchZoom: true },
    styles: {
      content: { display: "flex", flexDirection: "column" },
      body: { display: "flex", flexDirection: "column", flex: 1 },
    },
  });
}

type GetRedirectModalTitleProps = {
  redirectUrl: string;
  avatar?: AvatarType | null;
  title: React.ReactNode | string;
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
      {title}
    </UnstyledButton>
  );
}
