"use client";

import React, { useCallback, useState } from "react";
import { IconMenu2, IconRotate } from "@tabler/icons-react";
import { Button, rem, Stack } from "@mantine/core";
import CalorieResultOverlay, { FoodAnalysisType } from "@/components/CalorieResultOverlay";
import ImageDisplayContainer from "@/components/ImageDisplayContainer";
import PhotoCapturer from "@/components/PhotoCapturer";
import ProgressLoadingOverlay from "@/components/ProgressLoadingOverlay";
import callTheServer from "@/functions/callTheServer";
import uploadToSpaces from "@/functions/uploadToSpaces";
import openErrorModal from "@/helpers/openErrorModal";
import ScanPageHeading from "../ScanPageHeading";
import CalorieGoalController from "./CalorieGoal";
import classes from "./food.module.css";

export default function ScanFoodPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<FoodAnalysisType | null>(null);
  const [calorieGoal, setCalorieGoal] = useState(300);
  const [localUrl, setLocalUrl] = useState<string>("");
  const [goalType, setGoalType] = useState<string>("portion");

  const handleAnalyzeFood = useCallback(async () => {
    if (!localUrl) return;
    setIsLoading(true);

    const fileUrls = await uploadToSpaces({
      itemsArray: [localUrl],
      mime: "image/webp",
    });

    try {
      const response = await callTheServer({
        endpoint: "analyzeFood",
        method: "POST",
        body: {
          url: fileUrls[0],
        },
      });

      if (response.status === 200) {
        if (response.error) {
          openErrorModal({
            description: response.error,
          });
          return;
        }

        if (response.message) {
          setAnalysisResult(response.message);
        }
      }
    } catch (err: any) {
      openErrorModal();
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [localUrl]);

  const handleResetResult = useCallback(() => {
    setAnalysisResult(null);
    setLocalUrl("");
  }, []);

  return (
    <Stack className={`${classes.container} smallPage`}>
      <ScanPageHeading />
      <CalorieGoalController
        calorieGoal={calorieGoal}
        setCalorieGoal={setCalorieGoal}
        goalType={goalType}
        setGoalType={setGoalType}
        disabled={isLoading}
      />
      <Stack className={classes.content}>
        <ProgressLoadingOverlay isLoading={isLoading} loaderType="bars" description="Analyzing" />
        {localUrl ? (
          <ImageDisplayContainer handleDelete={() => setLocalUrl("")} image={localUrl} />
        ) : (
          <PhotoCapturer handleCapture={(base64string: string) => setLocalUrl(base64string)} />
        )}
      </Stack>
      {analysisResult && (
        <CalorieResultOverlay
          data={analysisResult}
          calorieGoal={calorieGoal}
          handleClose={handleResetResult}
          actionChildren={
            <Button variant="default" w="100%" onClick={handleResetResult}>
              <IconRotate className="icon" style={{ marginRight: rem(8) }} /> New scan
            </Button>
          }
        />
      )}
      <Button disabled={!localUrl} onClick={handleAnalyzeFood}>
        <IconMenu2 className="icon" style={{ marginRight: rem(8), transform: "rotate(90deg)" }} />{" "}
        Analyze
      </Button>
    </Stack>
  );
}
