"use client";

import React, { useCallback, useContext, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button, Stack } from "@mantine/core";
import { ReferrerEnum } from "@/app/auth/AuthForm/types";
import SkeletonWrapper from "@/app/SkeletonWrapper";
import FilterDropdown from "@/components/FilterDropdown";
import OverlayWithText from "@/components/OverlayWithText";
import PageHeader from "@/components/PageHeader";
import { partItems } from "@/components/PageHeader/data";
import UploadCard from "@/components/UploadCard";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import uploadToSpaces from "@/functions/uploadToSpaces";
import { useRouter } from "@/helpers/custom-router";
import { partIcons } from "@/helpers/icons";
import openAuthModal from "@/helpers/openAuthModal";
import openErrorModal from "@/helpers/openErrorModal";
import useCheckScanAvailability from "@/helpers/useCheckScanAvailability";
import { UserDataType } from "@/types/global";
import { UploadProgressProps } from "../types";
import classes from "./progress.module.css";

export const runtime = "edge";

export default function ScanProgress() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userDetails, setUserDetails } = useContext(UserContext);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const part = searchParams.get("part") || "face";

  const { _id: userId, toAnalyze, nextScan } = userDetails || {};

  const { isScanAvailable, checkBackDate } = useCheckScanAvailability({
    part,
    nextScan,
  });

  const nextScanText = useMemo(() => {
    return `Your next ${part} scan is after ${checkBackDate}.`;
  }, [part]);

  const handleUpload = useCallback(
    async ({ url, part, blurDots, offsets }: UploadProgressProps) => {
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

      const [originalImageUrl] = await uploadToSpaces({
        itemsArray: [url],
        mime: "image/jpeg",
      });

      if (originalImageUrl) {
        try {
          const updatedBlurDots = blurDots.map((dot) => {
            return {
              ...dot,
              originalHeight: dot.originalHeight / offsets.scaleHeight,
              originalWidth: dot.originalWidth / offsets.scaleWidth,
              x: dot.x / offsets.scaleWidth,
              y: dot.y / offsets.scaleHeight,
            };
          });

          const response = await callTheServer({
            endpoint: "uploadProgress",
            method: "POST",
            body: {
              userId,
              part,
              blurDots: updatedBlurDots,
              image: originalImageUrl,
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
                toAnalyze: response.message,
              }));

              const lastImage = response.message[response.message.length - 1];

              return lastImage;
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

  return (
    <Stack className={`${classes.container} smallPage`}>
      <PageHeader
        title="Scan"
        children={
          <FilterDropdown
            selectedValue={part}
            data={partItems}
            icons={partIcons}
            filterType="part"
            placeholder="Select part"
            addToQuery
          />
        }
      />
      <SkeletonWrapper show={!toAnalyze}>
        {isScanAvailable ? (
          <UploadCard
            handleUpload={handleUpload}
            part={part}
            progress={progress}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        ) : (
          <OverlayWithText
            text={nextScanText}
            button={
              <Button mt={8} variant="default" onClick={() => router.replace("/analysis")}>
                See the latest analysis
              </Button>
            }
          />
        )}
      </SkeletonWrapper>
    </Stack>
  );
}
