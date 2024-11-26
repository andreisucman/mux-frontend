import React from "react";
import { modals } from "@mantine/modals";
import ProgressModalContent from "@/app/progress/ProgressModalContent";
import { SimpleProgressType } from "@/app/progress/types";
import ProofModalContent from "@/app/proof/ProofModalContent";
import { SimpleProofType } from "@/app/proof/types";
import StyleModalContent from "@/components/StyleModalContent";
import { SimpleStyleType } from "@/components/StyleModalContent/types";
import { UserDataType, UserSubscriptionsType } from "@/types/global";

type OpenViewModalProps = {
  record: SimpleProgressType | SimpleProofType | SimpleStyleType;
  title: React.ReactNode;
  type: "style" | "progress" | "proof";
  isFullScreen?: boolean;
  handleTrack?: (
    trackedUserId: string,
    setUserDetails: React.Dispatch<React.SetStateAction<UserDataType>>,
    subscriptions?: UserSubscriptionsType | null
  ) => void;
};

export default function openResultModal({
  record,
  title,
  type,
  isFullScreen,
  handleTrack,
}: OpenViewModalProps) {
  const content =
    type === "style" ? (
      <StyleModalContent record={record as SimpleStyleType} handleTrack={handleTrack} />
    ) : type === "progress" ? (
      <ProgressModalContent record={record as SimpleProgressType} handleTrack={handleTrack} />
    ) : (
      <ProofModalContent record={record as SimpleProofType} handleTrack={handleTrack} />
    );
  modals.openContextModal({
    centered: true,
    modal: "general",
    title,
    size: "xl",
    innerProps: content,
    fullScreen: isFullScreen,
    removeScrollProps: { allowPinchZoom: true },
    styles: {
      content: { display: "flex", flexDirection: "column" },
      body: { display: "flex", flexDirection: "column", flex: 1 },
    },
  });
}
