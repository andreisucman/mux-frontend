"use client";

import React, { useCallback, useContext, useMemo, useState } from "react";
import { IconCircleOff } from "@tabler/icons-react";
import { Carousel } from "@mantine/carousel";
import { Loader, Stack } from "@mantine/core";
import { useShallowEffect } from "@mantine/hooks";
import { UploadProgressProps } from "@/app/scan/types";
import UploadCard from "@/components/UploadCard";
import SelectPartsCheckboxes from "@/components/UploadCarousel/SelectPartsCheckboxes";
import { BlurChoicesContext } from "@/context/BlurChoicesContext";
import { BlurTypeEnum } from "@/context/BlurChoicesContext/types";
import { UploadPartsChoicesContext } from "@/context/UploadPartsChoicesContext";
import { PartEnum } from "@/context/UploadPartsChoicesContext/types";
import { UserContext } from "@/context/UserContext";
import { onBlurImageClick } from "@/functions/blur";
import { ScanTypeEnum, SexEnum, TypeEnum } from "@/types/global";
import OverlayWithText from "../OverlayWithText";
import StartPartialScanOverlay from "./StartPartialScanOverlay";
import { RequirementType } from "./types";
import classes from "./UploadCarousel.module.css";

type Props = {
  type: TypeEnum;
  scanType: ScanTypeEnum;
  latestStyleImage?: string;
  requirements: RequirementType[];
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
  const [displayComponent, setDisplayComponent] = useState<
    "loading" | "partialScanOverlay" | "carousel" | "empty"
  >("loading");
  const { userDetails } = useContext(UserContext);
  const { blurType } = useContext(BlurChoicesContext);
  const { showFace, showMouth, showScalp, setShowPart } = useContext(UploadPartsChoicesContext);

  const { _id: userId, toAnalyze } = userDetails || {};

  const uploadedParts = toAnalyze && toAnalyze[type as TypeEnum.BODY | TypeEnum.HEAD];

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
      if (!showFace && item.part === "face") return;
      if (!showMouth && item.part === "mouth") return;
      if (!showScalp && item.part === "scalp") return;

      const { demographics } = userDetails || {};
      const { sex } = demographics || {};

      const blurredImage =
        blurType === "face" ? faceBlurredUrl : blurType === "eyes" ? eyesBlurredUrl : originalUrl;

      return (
        <Carousel.Slide key={index}>
          <UploadCard
            sex={sex || SexEnum.MALE}
            scanType={scanType}
            eyesBlurredUrl={eyesBlurredUrl}
            faceBlurredUrl={faceBlurredUrl}
            isLoading={isLoading}
            progress={progress}
            type={item.type}
            part={item.part}
            originalUrl={originalUrl}
            instruction={item.instruction}
            localUrl={localUrl}
            position={item.position}
            handleUpload={async () =>
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

  const somethingUploaded =
    slides &&
    slides.length === 0 &&
    toAnalyze &&
    toAnalyze?.[type as TypeEnum.BODY | TypeEnum.HEAD]?.length > 0;

  const allPartsDisalbed = !showFace && !showMouth && !showScalp;
  const showPartsSelector = type === "head" && scanType === "progress";

  useShallowEffect(() => {
    if (somethingUploaded && requirements.length > 0) {
      setDisplayComponent("partialScanOverlay");
    } else if (allPartsDisalbed) {
      setDisplayComponent("empty");
    } else if (requirements.length > 0) {
      setDisplayComponent("carousel");
    } else {
      setDisplayComponent("loading");
    }
  }, [somethingUploaded, requirements, scanType, allPartsDisalbed, somethingUploaded]);

  return (
    <Stack flex={1}>
      {displayComponent !== "loading" && showPartsSelector && (
        <SelectPartsCheckboxes
          distinctUploadedParts={distinctUploadedParts}
          showMouth={mouthExists && showMouth}
          showScalp={scalpExists && showScalp}
          showFace={faceExists && showFace}
          setShowPart={setShowPart}
        />
      )}
      {displayComponent === "carousel" && (
        <>
          <Carousel
            align="start"
            slideGap={16}
            slidesToScroll={1}
            withControls={false}
            withIndicators={true}
            classNames={{
              root: classes.root,
              viewport: classes.viewport,
              container: classes.container,
            }}
          >
            {slides}
          </Carousel>
        </>
      )}
      {displayComponent === "empty" && (
        <OverlayWithText text="All parts deselected" icon={<IconCircleOff className="icon" />} />
      )}
      {displayComponent === "partialScanOverlay" && (
        <StartPartialScanOverlay
          type={type as TypeEnum}
          userId={userId}
          distinctUploadedParts={distinctUploadedParts}
        />
      )}
      {displayComponent === "loading" && <Loader m="auto" />}
    </Stack>
  );
}
