"use client";

import React, { useCallback, useContext, useState } from "react";
import { useRouter as useDefaultRouter } from "next/navigation";
import { Button, rem, Stack } from "@mantine/core";
import { ReferrerEnum } from "@/app/auth/AuthForm/types";
import ImageDisplayContainer from "@/components/ImageDisplayContainer";
import PhotoCapturer from "@/components/PhotoCapturer";
import ProgressLoadingOverlay from "@/components/ProgressLoadingOverlay";
import CalorieGoalProvider, { CalorieGoalContext } from "@/context/CalorieGoalContext";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import uploadToSpaces from "@/functions/uploadToSpaces";
import openAuthModal from "@/helpers/openAuthModal";
import openErrorModal from "@/helpers/openErrorModal";
import foodImage from "@/public/assets/placeholders/food.svg";
import ScanHeader from "../ScanHeader";
import CalorieGoalController from "./CalorieGoal";
import classes from "./food.module.css";

export default function ScanFoodPage() {
  const defaultRouter = useDefaultRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [localUrl, setLocalUrl] = useState<string>("");

  const { calorieGoal } = useContext(CalorieGoalContext);
  const { userDetails } = useContext(UserContext);
  const { _id: userId } = userDetails || {};

  const handleAnalyzeFood = useCallback(async () => {
    if (!localUrl) return;
    setIsLoading(true);

    try {
      const fileUrls = await uploadToSpaces({
        itemsArray: [localUrl],
        mime: "image/jpg",
      });

      const response = await callTheServer({
        endpoint: "analyzeFood",
        method: "POST",
        body: {
          // url: fileUrls[0],
          url: "https://mux-data.nyc3.cdn.digitaloceanspaces.com/pasta.webp",
          calorieGoal,
        },
      });

      if (response.status === 200) {
        if (response.error) {
          if (response.error === "must login") {
            openAuthModal({
              title: "Sign in to continue",
              stateObject: {
                referrer: ReferrerEnum.SCAN_FOOD,
                redirectPath: "/scan/food",
                localUserId: userId,
              },
            });
            setIsLoading(false);
            return;
          }

          openErrorModal({
            description: response.error,
          });
          return;
        }

        if (response.message) {
          defaultRouter.push(`/analysis/food?analysisId=${response.message}`);
        }
      }
    } catch (err: any) {
      openErrorModal();
      setIsLoading(false);
    }
  }, [localUrl, userDetails, calorieGoal]);

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
          description="Analyzing food"
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
            silhouette={foodImage && foodImage.src}
            defaultFacingMode="environment"
            hideTimerButton
          />
        )}
        {localUrl && !isLoading && (
          <Button
            disabled={!localUrl || isLoading}
            className={classes.button}
            onClick={handleAnalyzeFood}
          >
            Analyze
          </Button>
        )}
      </Stack>
    </Stack>
  );
}
