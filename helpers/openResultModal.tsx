import React from "react";
import { modals } from "@mantine/modals";
import ProgressModalContent from "@/app/results/ProgressModalContent";
import ProofModalContent from "@/app/results/proof/ProofModalContent";
import { SimpleProofType } from "@/app/results/proof/types";
import StyleModalContent from "@/components/StyleModalContent";
import { SimpleBeforeAfterType } from "@/app/types";
import { SimpleStyleType } from "@/components/StyleModalContent/types";

type OpenViewModalProps = {
  record: SimpleBeforeAfterType | SimpleProofType | SimpleStyleType;
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
      <ProgressModalContent record={record as SimpleBeforeAfterType} showTrackButton={showTrackButton} />
    ) : (
      <ProofModalContent record={record as SimpleProofType} showTrackButton={showTrackButton} />
    );
  modals.openContextModal({
    centered: true,
    modal: "general",
    title,
    size: "auto",
    innerProps: content,
    fullScreen: isFullScreen,
    removeScrollProps: { allowPinchZoom: true },
    styles: {
      content: { display: "flex", flexDirection: "column" },
      body: { display: "flex", flexDirection: "column", flex: 1 },
    },
  });
}
