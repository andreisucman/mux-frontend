import React from "react";
import { modals } from "@mantine/modals";
import ProgressModalContent from "@/app/results/ProgressModalContent";
import { HandleTrackProps } from "@/app/results/proof/ProofGallery/type";
import ProofModalContent from "@/app/results/proof/ProofModalContent";
import { SimpleProofType } from "@/app/results/proof/types";
import { SimpleProgressType } from "@/app/results/types";
import StyleModalContent from "@/components/StyleModalContent";
import { SimpleStyleType } from "@/components/StyleModalContent/types";
import { UserDataType, UserSubscriptionsType } from "@/types/global";

type OpenViewModalProps = {
  record: SimpleProgressType | SimpleProofType | SimpleStyleType;
  title: React.ReactNode;
  type: "style" | "progress" | "proof";
  isFullScreen?: boolean;
  handleTrack?: (props: HandleTrackProps) => void;
  setRecords?: React.Dispatch<React.SetStateAction<any[] | undefined>>;
};

export default function openResultModal({
  record,
  title,
  type,
  isFullScreen,
  handleTrack,
  setRecords,
}: OpenViewModalProps) {
  const content =
    type === "style" ? (
      <StyleModalContent
        record={record as SimpleStyleType}
        handleTrack={handleTrack}
        setRecords={setRecords!}
      />
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
