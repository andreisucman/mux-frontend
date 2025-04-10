"use client";

import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { Button, Checkbox, Progress, Stack, Text } from "@mantine/core";
import { UploadProgressProps } from "@/app/scan/types";
import SkeletonWrapper from "@/app/SkeletonWrapper";
import { PartEnum } from "@/context/ScanPartsChoicesContext/types";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import { useRouter } from "@/helpers/custom-router";
import openErrorModal from "@/helpers/openErrorModal";
import { ToAnalyzeType, UserDataType } from "@/types/global";
import DraggableImageContainer from "../DraggableImageContainer";
import PhotoCapturer from "../PhotoCapturer";
import { BlurDotType } from "./types";
import UploadedImages from "./UploadedImages";
import classes from "./UploadCard.module.css";

type Props = {
  part: PartEnum;
  progress: number;
  isLoading?: boolean;
  handleUpload: (args: UploadProgressProps) => Promise<ToAnalyzeType>;
};

export default function UploadCard({ part, progress, isLoading, handleUpload }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { userDetails, setUserDetails } = useContext(UserContext);
  const [displayComponent, setDisplayComponent] = useState<"loading" | "capture" | "preview">(
    "loading"
  );
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [showStartAnalysis, setShowStartAnalysis] = useState(false);
  const [localUrl, setLocalUrl] = useState("");
  const [overlayImage, setOverlayImage] = useState("");
  const [offsets, setOffsets] = useState({
    scaleHeight: 0,
    scaleWidth: 0,
  });
  const [showBlur, setShowBlur] = useState(false);
  const [blurDots, setBlurDots] = useState<BlurDotType[]>([]);

  const { _id: userId, toAnalyze, latestProgress } = userDetails || {};

  const distinctUploadedParts = [
    ...new Set(toAnalyze?.map((obj) => obj.part).filter(Boolean)),
  ] as string[];

  const somethingUploaded = distinctUploadedParts && distinctUploadedParts.length > 0;
  const showCancelCapture = somethingUploaded && displayComponent === "capture";
  const isAbsolute = localUrl.startsWith("https://");

  const handleToggleBlur = () => {
    setShowBlur((prev: boolean) => {
      if (prev) {
        setBlurDots([]);
      }
      return !prev;
    });
  };

  const handleOverlayPrevious = (imageUrl: string) => {
    setOverlayImage((prev: string) => (prev ? "" : imageUrl));
  };

  const handleCancel = useCallback(() => {
    if (!toAnalyze) return;
    const latestImage = toAnalyze[toAnalyze.length - 1];
    setLocalUrl(latestImage.mainUrl.url);
    setShowStartAnalysis(true);
    setDisplayComponent("preview");
  }, [toAnalyze]);

  const handleAddMore = () => {
    setLocalUrl("");
    setShowStartAnalysis(false);
    setDisplayComponent("capture");
  };

  const handleCapture = (base64string: string) => {
    setLocalUrl(base64string);
    setDisplayComponent("preview");
  };

  const handleSetPreviousImage = useCallback((imageUrl: string) => {
    setLocalUrl(imageUrl);
    setDisplayComponent("preview");
  }, []);

  const handleRemoveToAnalyze = useCallback(
    async (url: string) => {
      const res = await callTheServer({
        endpoint: "deleteToAnalyze",
        method: "POST",
        body: { url, userId: userDetails?._id },
      });
      if (res.status === 200) {
        setUserDetails((prev: UserDataType) => ({ ...prev, toAnalyze: res.message }));
        if (res.message.length > 0) {
          const lastObject = res.message[res.message.length - 1];
          setLocalUrl(lastObject.mainUrl.url);
          setDisplayComponent("preview");
        } else {
          setDisplayComponent("capture");
          setShowStartAnalysis(false);
        }
      }
    },
    [toAnalyze, userDetails]
  );

  const handleDeleteLocalImage = useCallback(() => {
    if (!toAnalyze) return;

    const latestImage = toAnalyze[toAnalyze.length - 1];

    if (latestImage) {
      setLocalUrl(latestImage.mainUrl.url);
    } else {
      setLocalUrl("");
    }

    setDisplayComponent("capture");
  }, [toAnalyze]);

  const handleClickUpload = useCallback(async () => {
    const lastToAnalyzeObject = await handleUpload({
      part,
      url: localUrl,
      beforeImageUrl: overlayImage,
      blurDots,
      offsets,
    });
    if (lastToAnalyzeObject) setLocalUrl(lastToAnalyzeObject.mainUrl.url);
    setDisplayComponent("preview");
    setShowStartAnalysis(true);
    setShowBlur(false);
  }, [part, localUrl, offsets, blurDots, somethingUploaded]);

  const handleStartAnalysis = useCallback(async () => {
    if (!userId || !somethingUploaded || isButtonLoading) return;
    setIsButtonLoading(true);

    try {
      const response = await callTheServer({
        endpoint: "startProgressAnalysis",
        method: "POST",
        body: { userId },
      });

      if (response.status === 200) {
        if (response.error) {
          setIsButtonLoading(false);
          openErrorModal({ description: response.error });
          return;
        }

        const analysisRedirectUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}/analysis?${searchParams.toString()}`;
        router.push(`/wait?redirectUrl=${encodeURIComponent(analysisRedirectUrl)}`);
      }
    } catch (err) {
      setIsButtonLoading(false);
    }
  }, [userId, isLoading, pathname, somethingUploaded]);

  useEffect(() => {
    if (!toAnalyze) return;
    const lastObject = toAnalyze[toAnalyze.length - 1];
    if (lastObject) {
      setLocalUrl(lastObject.mainUrl.url);
      setDisplayComponent("preview");
      setShowStartAnalysis(true);
    } else {
      setDisplayComponent("capture");
    }
  }, [toAnalyze && toAnalyze.length]);

  const uploadedImages = useMemo(() => {
    if (!toAnalyze) return [];
    return toAnalyze.map((obj) => obj.mainUrl.url);
  }, [toAnalyze]);

  const imagesMissingUpdates = useMemo(() => {
    if (!latestProgress) return [];

    const partProgress = latestProgress[part];

    if (!partProgress) return [];

    const { images } = partProgress;

    if (!toAnalyze || toAnalyze?.length === 0) return images;

    const uploadedUrls = toAnalyze.map((tao) => tao.updateUrl.url);

    return images.filter((imo) => uploadedUrls.includes(imo.mainUrl.url));
  }, [toAnalyze, latestProgress?.[part]]);

  return (
    <SkeletonWrapper show={displayComponent === "loading"}>
      <Stack className={classes.container}>
        {toAnalyze && toAnalyze.length > 0 && (
          <UploadedImages
            images={uploadedImages}
            onClick={handleSetPreviousImage}
            handleRemove={handleRemoveToAnalyze}
            handleAddMore={handleAddMore}
          />
        )}
        <Stack className={classes.imageCell}>
          {displayComponent === "preview" && (
            <>
              {!isAbsolute && (
                <Checkbox
                  className={classes.checkbox}
                  checked={showBlur}
                  onChange={handleToggleBlur}
                  label="Blur features"
                />
              )}
              <DraggableImageContainer
                showBlur={showBlur}
                blurDots={blurDots}
                image={localUrl}
                disableDelete={isLoading}
                handleDelete={isAbsolute ? undefined : handleDeleteLocalImage}
                setBlurDots={setBlurDots}
                setOffsets={setOffsets}
              />
            </>
          )}
          {displayComponent === "capture" && (
            <>
              {imagesMissingUpdates.length > 0 && (
                <>
                  {overlayImage && (
                    <Image
                      src={overlayImage}
                      width={100}
                      height={100}
                      alt=""
                      className={classes.overlayImage}
                    />
                  )}
                  <Checkbox
                    className={classes.checkbox}
                    checked={!!overlayImage}
                    onChange={() => handleOverlayPrevious(imagesMissingUpdates[0].mainUrl.url)}
                    label="Overlay previous"
                  />
                </>
              )}
              <PhotoCapturer
                handleCapture={(base64string: string) => handleCapture(base64string)}
                handleCancel={showCancelCapture ? () => handleCancel() : undefined}
                defaultFacingMode="environment"
                hideTimerButton
                hideFlipCamera
              />
            </>
          )}
          {isLoading && (
            <Stack className={classes.progressCell}>
              <Progress value={progress} w="100%" size={12} mt={4} />
              <Text size="sm" ta="center">
                Uploading...
              </Text>
            </Stack>
          )}
          {!isLoading && localUrl && (
            <div className={classes.buttons}>
              {!isAbsolute && (
                <Button
                  loading={isLoading}
                  disabled={isLoading || !localUrl}
                  onClick={handleClickUpload}
                >
                  Upload
                </Button>
              )}
              <>
                {showStartAnalysis && isAbsolute && (
                  <Stack className={classes.nextButtons}>
                    <Button
                      disabled={isButtonLoading || !localUrl || uploadedImages.length >= 4}
                      variant="default"
                      onClick={handleAddMore}
                    >
                      Add more
                    </Button>
                    {localUrl && (
                      <Button
                        disabled={isButtonLoading || !localUrl}
                        loading={isButtonLoading}
                        onClick={handleStartAnalysis}
                      >
                        Analyze
                      </Button>
                    )}
                  </Stack>
                )}
              </>
            </div>
          )}

          {!showStartAnalysis && isAbsolute && somethingUploaded && (
            <Button
              className={classes.openStartAnalysisButton}
              disabled={isLoading || !localUrl}
              onClick={() => setShowStartAnalysis(true)}
            >
              Analyze
            </Button>
          )}
        </Stack>
      </Stack>
    </SkeletonWrapper>
  );
}
