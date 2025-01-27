"use client";

import React, { useCallback, useContext, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconHourglassHigh } from "@tabler/icons-react";
import { Button, Skeleton, Stack } from "@mantine/core";
import { useShallowEffect } from "@mantine/hooks";
import { ReferrerEnum } from "@/app/auth/AuthForm/types";
import OverlayWithText from "@/components/OverlayWithText";
import SexSelector from "@/components/SexSelector";
import UploadContainer from "@/components/UploadContainer";
import { UserContext } from "@/context/UserContext";
import { AuthStateEnum } from "@/context/UserContext/types";
import callTheServer from "@/functions/callTheServer";
import uploadToSpaces from "@/functions/uploadToSpaces";
import { useRouter } from "@/helpers/custom-router/patch-router/router";
import { formatDate } from "@/helpers/formatDate";
import openAuthModal from "@/helpers/openAuthModal";
import openErrorModal from "@/helpers/openErrorModal";
import useCheckScanAvailability from "@/helpers/useCheckScanAvailability";
import { ScanTypeEnum, TypeEnum, UserDataType } from "@/types/global";
import ScanHeader from "../ScanHeader";
import { UploadProgressProps } from "../types";
import classes from "./progress.module.css";

export const runtime = "edge";

export default function ScanProgress() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status, userDetails, setUserDetails } = useContext(UserContext);

  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const { _id: userId, requiredProgress, demographics, nextScan } = userDetails || {};

  const type = searchParams.get("type") || "head";
  const finalType = type === "health" ? "head" : type;
  const showSexSelector = status !== AuthStateEnum.AUTHENTICATED && demographics;

  const { needsScan, availableRequirements, nextScanDate } = useCheckScanAvailability({
    nextScan,
    requiredProgress,
    scanType: finalType as "head" | "body",
  });

  const checkBackDate = formatDate({ date: nextScanDate, hideYear: true });

  const handleUpload = useCallback(
    async ({ url, type, part, position, blurType, blurredImage }: UploadProgressProps) => {
      if (!userDetails || !url) return;

      let intervalId: NodeJS.Timeout;

      setIsLoading(true);

      const totalDuration = Math.random() * 25000 + 15000;
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

      const [originalImageUrl, blurredImageUrl] = await uploadToSpaces({
        itemsArray: [url, blurredImage],
        mime: "image/jpeg",
      });

      if (originalImageUrl) {
        try {
          const response = await callTheServer({
            endpoint: "uploadProgress",
            method: "POST",
            body: {
              userId,
              type,
              part,
              position,
              blurType,
              image: originalImageUrl,
              blurredImage: blurredImageUrl,
            },
          });

          if (response.status === 200) {
            if (response.error) {
              if (response.error === "must login") {
                openAuthModal({
                  title: "Sign in to continue",
                  stateObject: {
                    referrer: ReferrerEnum.SCAN_PROGRESS,
                    redirectPath: "/scan/progress",
                    localUserId: userId,
                  },
                });
                return;
              }

              openErrorModal({
                description: response.error,
              });
              return;
            }

            if (response.message) {
              setProgress(100);
              setUserDetails((prev: UserDataType) => ({
                ...prev,
                ...response.message,
              }));
            }
          } else {
            openErrorModal();
          }
        } catch (err: any) {
          openErrorModal();
        } finally {
          setIsLoading(false);
          setProgress(0);
          clearInterval(intervalId);
        }
      }
    },
    [userDetails, setUserDetails]
  );

  useShallowEffect(() => {
    if (!userId) return;
    if (!needsScan) return;
    if (availableRequirements && availableRequirements.length === 0) {
      router.push(`/wait?type=${finalType}&operationKey=${finalType}`);
    }
  }, [availableRequirements?.length, userId, needsScan]);

  const url = `/analysis${type ? (type === "head" ? "?type=head" : "?type=body") : ""}`;

  return (
    <>
      {availableRequirements ? (
        <Stack className={`${classes.container} smallPage`}>
          <ScanHeader
            type={finalType as TypeEnum}
            children={showSexSelector && <SexSelector updateOnServer />}
          />
          {needsScan ? (
            <UploadContainer
              requirements={availableRequirements || []}
              type={type as TypeEnum}
              progress={progress}
              isLoading={isLoading}
              scanType={ScanTypeEnum.PROGRESS}
              handleUpload={handleUpload}
            />
          ) : (
            <OverlayWithText
              text={`The next ${type ? type : ""} scan is after ${checkBackDate}.`}
              button={
                <Button mt={8} variant="default" onClick={() => router.replace(url)}>
                  See the latest {type} analysis
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
