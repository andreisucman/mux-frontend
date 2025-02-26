"use client";

import React, { useContext, useState } from "react";
import { IconCircleOff } from "@tabler/icons-react";
import { Stack } from "@mantine/core";
import { useShallowEffect } from "@mantine/hooks";
import { UploadProgressProps } from "@/app/scan/types";
import UploadCard from "@/components/UploadCard";
import { ScanPartsChoicesContext } from "@/context/ScanPartsChoicesContext";
import { UserContext } from "@/context/UserContext";
import { onBlurImageClick } from "@/functions/blur";
import { ScanTypeEnum, SexEnum } from "@/types/global";
import OverlayWithText from "../OverlayWithText";
import StartPartialScanOverlay from "./StartPartialScanOverlay";
import { RequirementType } from "./types";

type Props = {
  scanType: ScanTypeEnum;
  latestStyleImage?: string;
  requirements: RequirementType[];
  isLoading: boolean;
  progress: number;
  handleUpload: (args: UploadProgressProps) => Promise<void>;
};

export default function UploadContainer({
  scanType,
  requirements,
  isLoading,
  progress,
  handleUpload,
}: Props) {
  const [displayComponent, setDisplayComponent] = useState<
    "loading" | "partialScanOverlay" | "upload" | "empty"
  >("loading");
  const { userDetails } = useContext(UserContext);
  const { parts } = useContext(ScanPartsChoicesContext);

  const { _id: userId, toAnalyze } = userDetails || {};

  const distinctUploadedParts = [
    ...new Set(toAnalyze?.map((obj) => obj.part).filter(Boolean)),
  ] as string[];

  const slides = requirements
    .map((item) => {
      if (!userDetails) return;
      if (scanType === ScanTypeEnum.PROGRESS && !parts?.includes(item.part)) return;

      const { demographics } = userDetails || {};
      const { sex } = demographics || {};

      return (
        <UploadCard
          sex={sex || SexEnum.FEMALE}
          scanType={scanType}
          isLoading={isLoading}
          progress={progress}
          part={item.part}
          instruction={item.instruction}
          position={item.position}
          handleUpload={handleUpload}
          onBlurClick={onBlurImageClick}
        />
      );
    })
    .filter(Boolean);

  const somethingUploaded = slides && slides.length === 0 && toAnalyze && toAnalyze.length > 0;

  useShallowEffect(() => {
    if (somethingUploaded) {
      setDisplayComponent("partialScanOverlay");
    } else if (parts?.length === 0) {
      setDisplayComponent("empty");
    } else if (requirements.length > 0) {
      setDisplayComponent("upload");
    } else {
      setDisplayComponent("loading");
    }
  }, [somethingUploaded, requirements, scanType, parts, somethingUploaded]);

  return (
    <Stack flex={1}>
      {displayComponent === "upload" && slides[0]}
      {displayComponent === "empty" && (
        <OverlayWithText text="All parts deselected" icon={<IconCircleOff className="icon" />} />
      )}
      {displayComponent === "partialScanOverlay" && (
        <StartPartialScanOverlay
          userId={userId || null}
          distinctUploadedParts={distinctUploadedParts}
        />
      )}
    </Stack>
  );
}
