"use client";

import React, { useCallback, useContext, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Carousel } from "@mantine/carousel";
import { Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import OverlayWithText from "@/components/OverlayWithText";
import { BlurChoicesContext } from "@/context/BlurChoicesContext";
import { BlurTypeEnum } from "@/context/BlurChoicesContext/types";
import { UploadPartsChoicesContext } from "@/context/UploadPartsChoicesContext";
import { PartEnum } from "@/context/UploadPartsChoicesContext/types";
import { UserContext } from "@/context/UserContext";
import { onBlurImageClick } from "@/functions/blur";
import callTheServer from "@/functions/callTheServer";
import uploadToSpaces from "@/functions/uploadToSpaces";
import openErrorModal from "@/helpers/openErrorModal";
import { delayExecution } from "@/helpers/utils";
import { SexEnum, TypeEnum, UserDataType } from "@/types/global";
import { exampleProgressImages } from "../../data/exampleImages";
import UploadCard from "@/components/UploadCard";
import SelectPartsCheckboxes from "@/components/ProgressUploadCarousel/SelectPartsCheckboxes";
import StartPartialScanOverlay from "./StartPartialScanOverlay";
import { ProgressRequirementType } from "./types";

type Props = {
  requirements: ProgressRequirementType[] | [];
};

type HandleUploadProps = {
  sex: SexEnum;
  url: string;
  type: TypeEnum;
  part: PartEnum;
  position: string;
  blurType: BlurTypeEnum;
  blurredImage: string;
};

export default function ProgressUploadCarousel({ requirements }: Props) {
  const router = useRouter();
  const { userDetails, setUserDetails } = useContext(UserContext);
  const { blurType } = useContext(BlurChoicesContext);
  const { showFace, showMouth, showScalp, setShowPart } = useContext(UploadPartsChoicesContext);

  const [progress, setProgress] = useState(0);
  const [localUrl, setLocalUrl] = useState<string>("");
  const [originalUrl, setOriginalUrl] = useState("");
  const [eyesBlurredUrl, setEyesBlurredUrl] = useState("");
  const [faceBlurredUrl, setFaceBlurredUrl] = useState("");
  const [uploadResponse, setUploadResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const type = requirements?.[0]?.type;

  const slides = requirements
    .map((item, index) => {
      if (!userDetails) return;
      if (!showFace && ["front", "right", "left"].includes(item.position)) return;
      if (!showMouth && item.position === "mouth") return;
      if (!showScalp && item.position === "scalp") return;

      const blurredImage =
        blurType === "face" ? faceBlurredUrl : blurType === "eyes" ? eyesBlurredUrl : originalUrl;

      const sex = userDetails.demographics?.sex || "male";
      const exampleImage =
        exampleProgressImages[sex as "male" | "female"]?.[item?.type]?.[
          item?.position as "front" | "left" | "right"
        ];

      return (
        <Carousel.Slide key={index}>
          <UploadCard
            sex={sex}
            eyesBlurredUrl={eyesBlurredUrl}
            faceBlurredUrl={faceBlurredUrl}
            exampleImage={exampleImage}
            isLoading={isLoading}
            progress={progress}
            type={item.type}
            originalUrl={originalUrl}
            instruction={item.instruction}
            uploadResponse={uploadResponse}
            localUrl={localUrl}
            handleUpload={() =>
              handleUpload({
                sex: sex as SexEnum,
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
            handleDelete={handleDelete}
          />
        </Carousel.Slide>
      );
    })
    .filter(Boolean);

  const nothingToScan =
    userDetails?.toAnalyze[type].length === 0 && !showFace && !showMouth && !showScalp;

  const somethingToScan =
    slides.length === 0 && userDetails && userDetails?.toAnalyze?.[type]?.length > 0;

  const uploadedParts = userDetails?.toAnalyze[type];
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

  const handleUpload = useCallback(
    async ({ sex, url, type, part, position, blurType, blurredImage }: HandleUploadProps) => {
      let intervalId: NodeJS.Timeout;
      if (!userDetails) return;
      if (!userDetails.demographics?.sex && !sex) {
        router.replace(`/u/start/select-gender?type=${type}`);
        return;
      }

      modals.closeAll();

      if (url) {
        setIsLoading(true);

        const totalDuration = Math.random() * 25000 + 3000;
        const updateInterval = 1000;
        const incrementValue = 100 / (totalDuration / 1000);

        intervalId = setInterval(() => {
          setProgress((prevProgress) => {
            const newProgress = prevProgress + incrementValue;
            if (newProgress >= 100) {
              clearInterval(intervalId);
              return 100;
            }
            return newProgress;
          });
        }, updateInterval);

        let finalUrl;

        if (url.startsWith("http") || url.startsWith("https")) {
          finalUrl = url;
        } else {
          const fileUrls = await uploadToSpaces({
            itemsArray: [url],
            mime: "image/jpeg",
          });
          finalUrl = fileUrls[0];
        }
        if (finalUrl) {
          try {
            const response = await callTheServer({
              endpoint: "uploadProgress",
              method: "POST",
              body: {
                type,
                part,
                position,
                blurType,
                blurredImage,
                image: finalUrl,
                userId: userDetails._id,
              },
            });

            if (response.status === 200) {
              if (response.message) {
                setProgress(100);
                await delayExecution(1000);
                setUserDetails((prev: UserDataType) => ({
                  ...prev,
                  ...response.message,
                }));
                setFaceBlurredUrl("");
                setEyesBlurredUrl("");
                setLocalUrl("");
                setOriginalUrl("");
              }
              if (response.error) {
                openErrorModal({
                  title: "🚨 This didn't work!",
                  description: response.error,
                });
                const tId = setTimeout(() => {
                  setUploadResponse("");
                  clearTimeout(tId);
                }, 8000);

                setProgress(0);
              }
            }
          } catch (err: any) {
            console.error(err);
          } finally {
            setIsLoading(false);
            setProgress(0);
            clearInterval(intervalId);
          }
        }
      }
    },
    [userDetails, setUserDetails]
  );

  function handleDelete() {
    setLocalUrl("");
    setOriginalUrl("");
    setEyesBlurredUrl("");
    setFaceBlurredUrl("");
  }

  return (
    <Stack flex={1}>
      {type === "head" && (
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
          styles={{
            root: { height: "100%" },
            viewport: { height: "100%" },
            container: { height: "100%" },
          }}
        >
          {slides}
        </Carousel>
      )}

      {nothingToScan && <OverlayWithText icon="🤷‍♂️" text="Nothing to scan" />}
      {somethingToScan && (
        <StartPartialScanOverlay
          type={type as TypeEnum}
          userId={userDetails?._id}
          distinctUploadedParts={distinctUploadedParts}
        />
      )}
    </Stack>
  );
}
