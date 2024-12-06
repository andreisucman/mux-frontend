"use client";

import React, { useCallback, useContext, useMemo } from "react";
import { IconCircleOff } from "@tabler/icons-react";
import { Carousel } from "@mantine/carousel";
import { rem, Stack } from "@mantine/core";
import { UploadProgressProps } from "@/app/scan/types";
import OverlayWithText from "@/components/OverlayWithText";
import UploadCard from "@/components/UploadCard";
import SelectPartsCheckboxes from "@/components/UploadCarousel/SelectPartsCheckboxes";
import { BlurChoicesContext } from "@/context/BlurChoicesContext";
import { BlurTypeEnum } from "@/context/BlurChoicesContext/types";
import { UploadPartsChoicesContext } from "@/context/UploadPartsChoicesContext";
import { PartEnum } from "@/context/UploadPartsChoicesContext/types";
import { UserContext } from "@/context/UserContext";
import { onBlurImageClick } from "@/functions/blur";
import { ScanTypeEnum, SexEnum, TypeEnum } from "@/types/global";
import StartPartialScanOverlay from "./StartPartialScanOverlay";
import { RequirementType } from "./types";

type Props = {
  type: TypeEnum;
  scanType: ScanTypeEnum;
  latestStyleImage?: string;
  requirements: RequirementType[] | [];
  faceBlurredUrl: string;
  eyesBlurredUrl: string;
  originalUrl: string;
  localUrl: string;
  isLoading: boolean;
  progress: number;
  setLocalUrl: React.Dispatch<React.SetStateAction<string>>;
  setOriginalUrl: React.Dispatch<React.SetStateAction<string>>;
  setEyesBlurredUrl: React.Dispatch<React.SetStateAction<string>>;
  setFaceBlurredUrl: React.Dispatch<React.SetStateAction<string>>;
  handleUpload: (args: UploadProgressProps) => void;
};

export default function UploadCarousel({
  type,
  scanType,
  requirements,
  isLoading,
  progress,
  localUrl,
  faceBlurredUrl,
  eyesBlurredUrl,
  originalUrl,
  handleUpload,
  setLocalUrl,
  setOriginalUrl,
  setEyesBlurredUrl,
  setFaceBlurredUrl,
}: Props) {
  const { userDetails } = useContext(UserContext);
  const { blurType } = useContext(BlurChoicesContext);
  const { showFace, showMouth, showScalp, setShowPart } = useContext(UploadPartsChoicesContext);

  const { _id: userId, toAnalyze } = userDetails || {};
  const nothingToScan =
    toAnalyze && toAnalyze[type].length === 0 && !showFace && !showMouth && !showScalp;

  const uploadedParts = toAnalyze && toAnalyze[type];

  const distinctUploadedParts = [
    ...new Set(uploadedParts?.map((obj) => obj.part).filter(Boolean)),
  ] as string[];

  const faceExists = useMemo(
    () => requirements.some((obj) => obj.part === "face"),
    [requirements.length]
  );
  const mouthExists = useMemo(
    () => requirements.some((obj) => obj.part === "mouth"),
    [requirements.length]
  );
  const scalpExists = useMemo(
    () => requirements.some((obj) => obj.part === "scalp"),
    [requirements.length]
  );

  const handleDeleteImage = useCallback(() => {
    setLocalUrl("");
    setOriginalUrl("");
    setEyesBlurredUrl("");
    setFaceBlurredUrl("");
  }, []);

  const slides = requirements
    .map((item, index) => {
      if (!userDetails) return;
      if (!showFace && ["front", "right", "left"].includes(item.position)) return;
      if (!showMouth && item.position === "mouth") return;
      if (!showScalp && item.position === "scalp") return;

      const { demographics } = userDetails || {};
      const { sex } = demographics || {};

      const blurredImage =
        blurType === "face" ? faceBlurredUrl : blurType === "eyes" ? eyesBlurredUrl : originalUrl;

      return (
        <Carousel.Slide key={index}>
          <UploadCard
            sex={sex || SexEnum.FEMALE}
            scanType={scanType}
            eyesBlurredUrl={eyesBlurredUrl}
            faceBlurredUrl={faceBlurredUrl}
            isLoading={isLoading}
            progress={progress}
            type={item.type}
            originalUrl={originalUrl}
            instruction={item.instruction}
            localUrl={localUrl}
            position={item.position}
            handleUpload={() =>
              handleUpload({
                url: originalUrl,
                type: item.type as TypeEnum,
                part: item.part as PartEnum,
                position: item.position,
                blurType: blurType as BlurTypeEnum,
                blurredImage,
              })
            }
            setOriginalUrl={setOriginalUrl}
            setLocalUrl={setLocalUrl}
            onBlurClick={({ originalUrl, blurType }) =>
              onBlurImageClick({
                originalUrl,
                eyesBlurredUrl,
                faceBlurredUrl,
                blurType,
                setEyesBlurredUrl,
                setFaceBlurredUrl,
                setLocalUrl,
              })
            }
            handleDelete={handleDeleteImage}
          />
        </Carousel.Slide>
      );
    })
    .filter(Boolean);

  const somethingToScan = slides.length === 0 && toAnalyze && toAnalyze?.[type]?.length > 0;
  const allPartsEnabled = showFace && showMouth && showScalp;

  return (
    <Stack flex={1}>
      {type === "head" && scanType !== "style" && somethingToScan && (
        <SelectPartsCheckboxes
          distinctUploadedParts={distinctUploadedParts}
          showMouth={mouthExists && showMouth}
          showScalp={scalpExists && showScalp}
          showFace={faceExists && showFace}
          setShowPart={setShowPart}
        />
      )}
      {!nothingToScan && !somethingToScan && (
        <Carousel
          align="start"
          slideGap={16}
          slidesToScroll={1}
          withControls={false}
          withIndicators={true}
        >
          {slides}
        </Carousel>
      )}
      {nothingToScan && (
        <OverlayWithText icon={<IconCircleOff className="icon" />} text="Nothing to scan" />
      )}
      {somethingToScan && scanType !== "style" && !allPartsEnabled && (
        <StartPartialScanOverlay
          type={type as TypeEnum}
          userId={userId}
          distinctUploadedParts={distinctUploadedParts}
        />
      )}
    </Stack>
  );
}
