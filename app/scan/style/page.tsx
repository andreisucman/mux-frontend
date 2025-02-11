"use client";

import React, { useCallback, useContext, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Stack } from "@mantine/core";
import { ReferrerEnum } from "@/app/auth/AuthForm/types";
import SexSelector from "@/components/SexSelector";
import UploadContainer from "@/components/UploadContainer";
import { PartEnum } from "@/context/ScanPartsChoicesContext/types";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import uploadToSpaces from "@/functions/uploadToSpaces";
import { saveToLocalStorage } from "@/helpers/localStorage";
import openAuthModal from "@/helpers/openAuthModal";
import openErrorModal from "@/helpers/openErrorModal";
import { PositionEnum, ScanTypeEnum, TypeEnum, UserDataType } from "@/types/global";
import ScanHeader from "../ScanHeader";
import classes from "./style.module.css";

export const runtime = "edge";

const defaultStyleRequirements = [
  {
    title: "Style scan",
    instruction: "Take a photo of yourself in your outfit.",
    type: TypeEnum.BODY,
    part: PartEnum.STYLE,
    position: PositionEnum.FRONT,
  },
];

type HandleUploadStyleProps = {
  url: string;
};

export default function UploadStyle() {
  const router = useRouter();
  const { userDetails, setUserDetails } = useContext(UserContext);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const { _id: userId, latestStyleAnalysis, demographics } = userDetails || {};
  const { mainUrl } = latestStyleAnalysis || {};

  const handleUpload = useCallback(
    async ({ url }: HandleUploadStyleProps) => {
      if (!url) return;

      let intervalId: any = null;

      try {
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

        setIsLoading(true);

        const fileUrls = await uploadToSpaces({
          itemsArray: [url],
        });

        if (fileUrls[0]) {
          const response = await callTheServer({
            endpoint: "startStyleAnalysis",
            method: "POST",
            body: {
              image: fileUrls[0],
              localUserId: userId,
            },
          });

          if (response.status === 200) {
            if (response.error) {
              if (response.error === "must login") {
                openAuthModal({
                  title: "Sign in to continue",
                  stateObject: {
                    referrer: ReferrerEnum.SCAN_STYLE,
                    redirectPath: "/scan/style",
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

            saveToLocalStorage("runningAnalyses", { style: true }, "add");
            setUserDetails((prev: UserDataType) => ({
              ...prev,
              _id: response.message,
            }));

            if (intervalId) clearInterval(intervalId);

            const redirectUrl = encodeURIComponent("/analysis/style");
            const onErrorRedirectUrl = encodeURIComponent("/scan/style");
            router.push(
              `/wait?operationKey=style&redirectUrl=${redirectUrl}&onErrorRedirectUrl=${onErrorRedirectUrl}}`
            );
          } else {
            openErrorModal();
          }
        }
      } catch (err) {
        openErrorModal();
      } finally {
        setProgress(100);
        setIsLoading(false);
        if (intervalId) clearInterval(intervalId);
      }
    },
    [userDetails, progress]
  );

  return (
    <Stack className={`${classes.container} smallPage`}>
      <ScanHeader children={demographics && <SexSelector updateOnServer />} />
      <UploadContainer
        latestStyleImage={mainUrl?.url}
        requirements={defaultStyleRequirements}
        progress={progress}
        isLoading={isLoading}
        scanType={ScanTypeEnum.STYLE}
        handleUpload={handleUpload}
      />
    </Stack>
  );
}
