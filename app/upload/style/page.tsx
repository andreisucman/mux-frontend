"use client";

import React, { useCallback, useContext, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Stack } from "@mantine/core";
import UploadCarousel from "@/components/UploadCarousel";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import uploadToSpaces from "@/functions/uploadToSpaces";
import { useRouter } from "@/helpers/custom-router/patch-router/router";
import { saveToLocalStorage } from "@/helpers/localStorage";
import openErrorModal from "@/helpers/openErrorModal";
import { TypeEnum, UserDataType } from "@/types/global";
import UploadPageHeading from "../UploadPageHeading";
import { styleRequirements } from "./styleRequirements";
import { HandleUploadStyleProps } from "./types";

export const runtime = "edge";

export default function UploadStyle() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userDetails, setUserDetails } = useContext(UserContext);

  const [progress, setProgress] = useState(0);
  const [localUrl, setLocalUrl] = useState("");
  const [originalUrl, setOriginalUrl] = useState("");
  const [eyesBlurredUrl, setEyesBlurredUrl] = useState("");
  const [faceBlurredUrl, setFaceBlurredUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { _id: userId, latestStyleAnalysis } = userDetails || {};
  const type = searchParams.get("type") || "head";
  const finalType = type === "health" ? "head" : type;
  const typeStyleAnalysis = latestStyleAnalysis?.[finalType as "head" | "body"];
  const { mainUrl } = typeStyleAnalysis || {};

  const handleUpload = useCallback(
    async ({ url, type }: HandleUploadStyleProps) => {
      let intervalId: NodeJS.Timeout;

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

        if (url) {
          setIsLoading(true);

          const fileUrls = await uploadToSpaces({
            itemsArray: [url],
          });

          if (fileUrls) {
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
              saveToLocalStorage("runningAnalyses", { [`style-${type}`]: true }, "add");
              setUserDetails((prev: UserDataType) => ({
                ...prev,
                _id: response.message,
              }));

              router.push(`/wait?type=${finalType}&redirect`);
            } else {
              setProgress(0);
              openErrorModal({
                description: response.error,
              });
            }
          }
        }
      } catch (err) {
        openErrorModal();
      } finally {
        setIsLoading(false);
      }
    },
    [userId, setUserDetails]
  );

  return (
    <Stack flex={1}>
      <UploadPageHeading type={type as TypeEnum} />
      <UploadCarousel
        latestStyleImage={mainUrl?.url}
        requirements={styleRequirements?.[finalType as "head" | "body"] || []}
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
        isStyle
      />
    </Stack>
  );
}
