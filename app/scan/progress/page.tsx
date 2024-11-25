"use client";

import React, { useCallback, useContext, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconHourglassHigh } from "@tabler/icons-react";
import { Loader, Stack } from "@mantine/core";
import { useShallowEffect } from "@mantine/hooks";
import OverlayWithText from "@/components/OverlayWithText";
import UploadCarousel from "@/components/UploadCarousel";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import uploadToSpaces from "@/functions/uploadToSpaces";
import { useRouter } from "@/helpers/custom-router/patch-router/router";
import { formatDate } from "@/helpers/formatDate";
import openErrorModal from "@/helpers/openErrorModal";
import useCheckScanAvailability from "@/helpers/useCheckScanAvailability";
import { TypeEnum, UserDataType } from "@/types/global";
import UploadPageHeading from "../ScanPageHeading";
import { HandleUploadProgressProps } from "../types";
import classes from "./progress.module.css";

export const runtime = "edge";

export default function ScanProgress() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userDetails, setUserDetails } = useContext(UserContext);

  const [progress, setProgress] = useState(0);
  const [localUrl, setLocalUrl] = useState("");
  const [originalUrl, setOriginalUrl] = useState("");
  const [eyesBlurredUrl, setEyesBlurredUrl] = useState("");
  const [faceBlurredUrl, setFaceBlurredUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { _id: userId, requiredProgress, nextScan } = userDetails || {};

  const type = searchParams.get("type") || "head";
  const finalType = type === "health" ? "head" : type;

  const { needsScan, availableRequirements, nextScanDate } = useCheckScanAvailability({
    nextScan,
    requiredProgress,
    scanType: finalType as "head" | "body",
  });

  const handleUpload = useCallback(
    async ({ url, type, part, position, blurType, blurredImage }: HandleUploadProgressProps) => {
      if (!userDetails) return;
      let intervalId: NodeJS.Timeout;

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
                userId,
              },
            });

            if (response.status === 200) {
              if (response.message) {
                setProgress(100);
                setUserDetails((prev: UserDataType) => ({
                  ...prev,
                  ...response.message,
                }));
                setLocalUrl("");
                setOriginalUrl("");
                setFaceBlurredUrl("");
                setEyesBlurredUrl("");
              }
              if (response.error) {
                openErrorModal({
                  description: response.error,
                });
                const tId = setTimeout(() => {
                  clearTimeout(tId);
                }, 8000);

                setProgress(0);
              }
            }
          } catch (err: any) {
            openErrorModal();
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

  useShallowEffect(() => {
    if (!userId) return;
    if (availableRequirements && availableRequirements.length === 0) {
      router.push(`/wait?type=${finalType}`);
    }
  }, [availableRequirements?.length, userId]);

  return (
    <>
      {userId ? (
        <Stack className={classes.container}>
          <UploadPageHeading type={finalType as TypeEnum} title={`Scan your progress`} />
          {needsScan ? (
            <UploadCarousel
              requirements={availableRequirements || []}
              type={type as TypeEnum}
              progress={progress}
              localUrl={localUrl}
              originalUrl={originalUrl}
              eyesBlurredUrl={eyesBlurredUrl}
              faceBlurredUrl={faceBlurredUrl}
              isLoading={isLoading}
              setLocalUrl={setLocalUrl}
              setOriginalUrl={setOriginalUrl}
              setEyesBlurredUrl={setEyesBlurredUrl}
              setFaceBlurredUrl={setFaceBlurredUrl}
              handleUpload={handleUpload}
            />
          ) : (
            <OverlayWithText
              icon={<IconHourglassHigh className="icon" />}
              text={`Check back after ${formatDate({ date: nextScanDate, hideYear: true })}.`}
            />
          )}
        </Stack>
      ) : (
        <Stack className={classes.loaderWrapper}>
          <Loader type="oval" />
        </Stack>
      )}
    </>
  );
}
