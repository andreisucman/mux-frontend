"use client";

import React, { useCallback, useContext, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Skeleton, Stack } from "@mantine/core";
import { ReferrerEnum } from "@/app/auth/AuthForm/types";
import SexSelector from "@/components/SexSelector";
import UploadContainer from "@/components/UploadContainer";
import { PartEnum } from "@/context/UploadPartsChoicesContext/types";
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

const defaultStyleRequirements = {
  head: [
    {
      title: "Style scan: Head",
      instruction: "Upload a photo of your head how you usually style it.",
      type: TypeEnum.HEAD,
      part: PartEnum.STYLE,
      position: PositionEnum.FRONT,
    },
  ],
  body: [
    {
      title: "Style scan: Outfit",
      instruction: "Take a full body photo of your outfit.",
      type: TypeEnum.BODY,
      part: PartEnum.STYLE,
      position: PositionEnum.FRONT,
    },
  ],
};

type HandleUploadStyleProps = {
  url: string;
  type: TypeEnum;
};

export default function UploadStyle() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userDetails, setUserDetails } = useContext(UserContext);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const { _id: userId, latestStyleAnalysis, demographics } = userDetails || {};
  const type = searchParams.get("type") || "head";
  const finalType = type === "health" ? "head" : type;
  const typeStyleRequirements = defaultStyleRequirements?.[finalType as "head" | "body"];
  const typeStyleAnalysis = latestStyleAnalysis?.[finalType as "head" | "body"];
  const { mainUrl } = typeStyleAnalysis || {};

  const handleUpload = useCallback(
    async ({ url, type }: HandleUploadStyleProps) => {
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
              type,
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

            saveToLocalStorage("runningAnalyses", { [`style-${type}`]: true }, "add");
            setUserDetails((prev: UserDataType) => ({
              ...prev,
              _id: response.message,
            }));

            if (intervalId) clearInterval(intervalId);

            const redirectUrl = encodeURIComponent(`/analysis/style?${type ? `type=${type}` : ""}`);
            const onErrorRedirectUrl = encodeURIComponent(`/scan/style?${searchParams.toString()}`);
            router.push(
              `/wait?type=${finalType}&operationKey=${`style-${finalType}`}&redirectUrl=${redirectUrl}&onErrorRedirectUrl=${onErrorRedirectUrl}}`
            );
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
      {typeStyleRequirements ? (
        <>
          <ScanHeader
            type={type as TypeEnum}
            children={demographics ? <SexSelector updateOnServer /> : <></>}
          />
          <UploadContainer
            latestStyleImage={mainUrl?.url}
            requirements={typeStyleRequirements}
            type={type as TypeEnum}
            progress={progress}
            isLoading={isLoading}
            handleUpload={handleUpload}
            scanType={ScanTypeEnum.STYLE}
          />
        </>
      ) : (
        <Skeleton className="skeleton" flex={1}></Skeleton>
      )}
    </Stack>
  );
}
