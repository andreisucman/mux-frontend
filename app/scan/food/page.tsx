"use client";

import React, { useCallback, useContext, useMemo, useState } from "react";
import { useRouter as useDefaultRouter } from "next/navigation";
import getBrowserFingerprint from "get-browser-fingerprint";
import { Button, rem, Stack } from "@mantine/core";
import { ReferrerEnum } from "@/app/auth/AuthForm/types";
import ImageDisplayContainer from "@/components/ImageDisplayContainer";
import PhotoCapturer from "@/components/PhotoCapturer";
import ProgressLoadingOverlay from "@/components/ProgressLoadingOverlay";
import CalorieGoalProvider, { CalorieGoalContext } from "@/context/CalorieGoalContext";
import { silhouettes } from "@/data/silhouettes";
import callTheServer from "@/functions/callTheServer";
import uploadToSpaces from "@/functions/uploadToSpaces";
import openAuthModal from "@/helpers/openAuthModal";
import openErrorModal from "@/helpers/openErrorModal";
import foodImage from "@/public/assets/placeholders/food.svg";
import { ScanTypeEnum } from "@/types/global";
import ScanHeader from "../ScanHeader";
import CalorieGoalController from "./CalorieGoal";
import classes from "./food.module.css";

export default function ScanFoodPage() {
  const defaultRouter = useDefaultRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [localUrl, setLocalUrl] = useState<string>("");

  const { calorieGoal } = useContext(CalorieGoalContext);

  const handleAnalyzeFood = useCallback(async () => {
    if (!localUrl) return;
    setIsLoading(true);

    try {
      const fingerprint = await getBrowserFingerprint({ hardwareOnly: true });

      const fileUrls = await uploadToSpaces({
        itemsArray: [localUrl],
        mime: "image/webp",
      });

      const response = await callTheServer({
        endpoint: "analyzeFood",
        method: "POST",
        body: {
          url: fileUrls[0],
          calorieGoal,
          fingerprint,
        },
      });

      if (response.status === 200) {
        if (response.error) {
          if (response.error === "must login") {
            openAuthModal({
              title: "Login to continue",
              stateObject: {
                referrer: ReferrerEnum.SCAN_FOOD,
                redirectPath: "/scan/food",
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
          defaultRouter.replace(`/analysis/food/${response.message}`);
        }
      }
    } catch (err: any) {
      openErrorModal();
      setIsLoading(false);
    }
  }, [localUrl, calorieGoal]);

  const silhouette = useMemo(
    () => silhouettes.find((rec) => rec.scanType === ScanTypeEnum.FOOD),
    []
  );

  return (
    <Stack className={`${classes.container} smallPage`}>
      <ScanHeader />
      <CalorieGoalProvider>
        <CalorieGoalController disabled={isLoading} />
      </CalorieGoalProvider>

      <Stack className={classes.content}>
        <ProgressLoadingOverlay
          isLoading={isLoading}
          customStyles={{ borderRadius: rem(16), gap: rem(16) }}
          customContainerStyles={{ width: "100%" }}
          loaderType="bars"
          description="Analyzing"
          showDisclaimer
        />
        {localUrl ? (
          <ImageDisplayContainer
            handleDelete={() => setLocalUrl("")}
            image={localUrl}
            placeholder={foodImage}
          />
        ) : (
          <PhotoCapturer
            handleCapture={(base64string: string) => setLocalUrl(base64string)}
            silhouette={silhouette?.url || ""}
            hideTimerButton
          />
        )}
      </Stack>

      <Button disabled={!localUrl || isLoading} onClick={handleAnalyzeFood}>
        Analyze
      </Button>
    </Stack>
  );
}
