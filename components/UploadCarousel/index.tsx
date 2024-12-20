"use client";

import React, { useContext, useMemo, useState } from "react";
import { IconCircleOff } from "@tabler/icons-react";
import { Carousel } from "@mantine/carousel";
import { Loader, Stack } from "@mantine/core";
import { useShallowEffect } from "@mantine/hooks";
import { UploadProgressProps } from "@/app/scan/types";
import UploadCard from "@/components/UploadCard";
import SelectPartsCheckboxes from "@/components/UploadCarousel/SelectPartsCheckboxes";
import { UploadPartsChoicesContext } from "@/context/UploadPartsChoicesContext";
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
  isLoading: boolean;
  progress: number;
  handleUpload: (args: UploadProgressProps) => Promise<void>;
};

export default function UploadCarousel({
  type,
  scanType,
  requirements,
  isLoading,
  progress,
  handleUpload,
}: Props) {
  const [displayComponent, setDisplayComponent] = useState<
    "loading" | "partialScanOverlay" | "carousel" | "empty"
  >("loading");
  const { userDetails } = useContext(UserContext);
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

  const slides = requirements
    .map((item, index) => {
      if (!userDetails) return;
      if (!showFace && item.part === "face") return;
      if (!showMouth && item.part === "mouth") return;
      if (!showScalp && item.part === "scalp") return;

      const { demographics } = userDetails || {};
      const { sex } = demographics || {};

      return (
        <Carousel.Slide key={index}>
          <UploadCard
            sex={sex || SexEnum.MALE}
            scanType={scanType}
            isLoading={isLoading}
            progress={progress}
            type={item.type}
            part={item.part}
            instruction={item.instruction}
            position={item.position}
            handleUpload={handleUpload}
            onBlurClick={onBlurImageClick}
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
            withControls
            classNames={{
              root: classes.root,
              viewport: classes.viewport,
              container: classes.container,
              control: "carouselControl"
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
          userId={userId || null}
          distinctUploadedParts={distinctUploadedParts}
        />
      )}
      {displayComponent === "loading" && <Loader m="auto" />}
    </Stack>
  );
}
