import React from "react";
import { AvatarConfig } from "react-nice-avatar";
import { rem, Title, UnstyledButton } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import ProgressModalContent from "@/app/results/ProgressModalContent";
import ProofModalContent from "@/app/results/proof/ProofModalContent";
import { SimpleProofType } from "@/app/results/proof/types";
import { SimpleProgressType } from "@/app/results/types";
import { SimpleBeforeAfterType } from "@/app/types";
import AvatarComponent from "@/components/AvatarComponent";
import StyleModalContent from "@/components/StyleModalContent";
import { SimpleStyleType } from "@/components/StyleModalContent/types";
import Link from "../custom-router/patch-router/link";
import classes from "./openResultModal.module.css";

type OpenViewModalProps = {
  record: SimpleBeforeAfterType | SimpleProofType | SimpleStyleType | SimpleProgressType;
  title: React.ReactNode;
  type: "style" | "progress" | "proof";
  isFullScreen?: boolean;
  showTrackButton?: boolean;
  setRecords?: React.Dispatch<React.SetStateAction<any[] | undefined>>;
};

export default function openResultModal({
  record,
  title,
  type,
  isFullScreen,
  showTrackButton,
  setRecords,
}: OpenViewModalProps) {
  const content =
    type === "style" ? (
      <StyleModalContent
        record={record as SimpleStyleType}
        showTrackButton={showTrackButton}
        setRecords={setRecords!}
      />
    ) : type === "progress" ? (
      <ProgressModalContent
        record={record as SimpleBeforeAfterType}
        showTrackButton={showTrackButton}
      />
    ) : (
      <ProofModalContent record={record as SimpleProofType} showTrackButton={showTrackButton} />
    );

  modals.openContextModal({
    centered: true,
    modal: "general",
    title,
    size: rem(1280),
    innerProps: content,
    fullScreen: isFullScreen,
    removeScrollProps: { allowPinchZoom: true },
    styles: {
      content: { display: "flex", flexDirection: "column" },
      body: { display: "flex", flexDirection: "column", flex: 1 },
    },
  });
}

type Props = {
  redirectUrl: string;
  avatar: { [key: string]: any } | null;
  title: string;
};

export function getRedirectModalTitle({ redirectUrl, avatar, title }: Props) {
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
