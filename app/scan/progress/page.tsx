"use client";

import React, { useCallback, useContext, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { IconHourglassHigh, IconMan, IconMoodSmile } from "@tabler/icons-react";
import { Button, rem, Skeleton, Stack } from "@mantine/core";
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
import { ScanTypeEnum, TypeEnum, UserDataType } from "@/types/global";
import ScanHeader from "../ScanHeader";
import { UploadProgressProps } from "../types";
import classes from "./progress.module.css";

export const runtime = "edge";

export default function ScanProgress() {
  const router = useRouter();
  const pathname = usePathname();
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

  const checkBackDate = formatDate({ date: nextScanDate, hideYear: true });

  const handleUpload = useCallback(
    async ({ url, type, part, position, blurType, blurredImage }: UploadProgressProps) => {
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

  const handleResetOnChangeType = useCallback(() => {
    setLocalUrl("");
    setOriginalUrl("");
    setEyesBlurredUrl("");
    setFaceBlurredUrl("");
  }, []);

  useShallowEffect(() => {
    if (!userId) return;
    if (!needsScan) return;
    if (availableRequirements && availableRequirements.length === 0) {
      router.push(`/wait?type=${finalType}&operationKey=${finalType}`);
    }
  }, [availableRequirements?.length, userId, needsScan]);

  const icon =
    type === "head" ? (
      <IconMoodSmile className="icon" style={{ marginRight: rem(6) }} />
    ) : (
      <IconMan className="icon" style={{ marginRight: rem(6) }} />
    );

  const url = `/analysis${type ? (type === "head" ? "?type=head" : "?type=body") : ""}`;

  return (
    <>
      {availableRequirements ? (
        <Stack className={`${classes.container} smallPage`}>
          <ScanHeader type={finalType as TypeEnum} onSelect={handleResetOnChangeType} />
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
              scanType={ScanTypeEnum.PROGRESS}
              setLocalUrl={setLocalUrl}
              setOriginalUrl={setOriginalUrl}
              setEyesBlurredUrl={setEyesBlurredUrl}
              setFaceBlurredUrl={setFaceBlurredUrl}
              handleUpload={handleUpload}
            />
          ) : (
            <OverlayWithText
              icon={<IconHourglassHigh className="icon" />}
              text={`The next ${type ? type : ""} scan is after ${checkBackDate}.`}
              button={
                <Button mt={8} variant="default" onClick={() => router.replace(url)}>
                  {icon} See the latest {type} analysis
                </Button>
              }
            />
          )}
        </Stack>
      ) : (
        <Skeleton className="skeleton" flex={1}></Skeleton>
      )}
    </>
  );
}
