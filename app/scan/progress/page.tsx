"use client";

import React, { useCallback, useContext, useMemo, useState } from "react";
import { Button, Loader, Stack } from "@mantine/core";
import { ReferrerEnum } from "@/app/auth/AuthForm/types";
import InputWithCheckboxes from "@/components/InputWithCheckboxes";
import OverlayWithText from "@/components/OverlayWithText";
import PageHeader from "@/components/PageHeader";
import SexSelector from "@/components/SexSelector";
import UploadContainer from "@/components/UploadContainer";
import { ScanPartsChoicesContext } from "@/context/ScanPartsChoicesContext";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import uploadToSpaces from "@/functions/uploadToSpaces";
import { useRouter } from "@/helpers/custom-router/patch-router/router";
import openAuthModal from "@/helpers/openAuthModal";
import openErrorModal from "@/helpers/openErrorModal";
import useCheckScanAvailability from "@/helpers/useCheckScanAvailability";
import { ScanTypeEnum, UserDataType } from "@/types/global";
import { UploadProgressProps } from "../types";
import { titles } from "../pageTitles";
import classes from "./progress.module.css";

export const runtime = "edge";


export default function ScanProgress() {
  const router = useRouter();
  const { userDetails, setUserDetails } = useContext(UserContext);
  const { parts, setParts } = useContext(ScanPartsChoicesContext);

  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const { _id: userId, requiredProgress, nextScan, toAnalyze } = userDetails || {};

  const { availableRequirements, checkBackDate } = useCheckScanAvailability({
    parts,
    nextScan,
    requiredProgress,
  });

  const handleUpload = useCallback(
    async ({ url, part, position, blurType, blurredImage }: UploadProgressProps) => {
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
          const response = await callTheServer({
            endpoint: "uploadProgress",
            method: "POST",
            body: {
              userId,
              part,
              position,
              blurType,
              image: originalImageUrl,
              blurredImage,
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

  const uploadedParts = useMemo(() => {
    return [...new Set(toAnalyze?.map((obj) => obj.part))].filter((rec) => Boolean(rec));
  }, [toAnalyze]) as string[];

  const showCarousel = useMemo(() => {
    const partRequirements = availableRequirements?.filter((r) => parts?.includes(r.part));
    const hide =
      partRequirements && partRequirements?.length === 0 && toAnalyze && toAnalyze?.length === 0;
    return !hide;
  }, [requiredProgress, toAnalyze, availableRequirements]);

  const nextScanText = useMemo(() => {
    if (!parts) return "";
    let chunks = [...parts];
    if (chunks.length > 1) {
      chunks.splice(-1, 0, "and,");
    }
    const partsString = chunks?.join(", ").split(",,").join(" ");
    return `Your next ${partsString} scan is after ${checkBackDate}.`;
  }, [parts]);

  return (
    <>
      {availableRequirements ? (
        <Stack className={`${classes.container} smallPage`}>
          <PageHeader
            titles={titles}
            children={
              <>
                <SexSelector updateOnServer />
                {parts && (
                  <InputWithCheckboxes
                    uploadedParts={uploadedParts}
                    data={parts}
                    setParts={setParts}
                  />
                )}
              </>
            }
          />
          {showCarousel ? (
            <UploadContainer
              requirements={availableRequirements || []}
              progress={progress}
              isLoading={isLoading}
              scanType={ScanTypeEnum.PROGRESS}
              handleUpload={handleUpload}
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
        </Stack>
      ) : (
        <Loader m="0 auto" pt="15%" />
      )}
    </>
  );
}
