"use client";

import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter as useDefaultRouter, useSearchParams } from "next/navigation";
import { IconMenu2 } from "@tabler/icons-react";
import { Button, rem, Stack, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { ReferrerEnum } from "@/app/auth/AuthForm/types";
import CalorieResultOverlay, { FoodAnalysisType } from "@/components/CalorieResultOverlay";
import ImageDisplayContainer from "@/components/ImageDisplayContainer";
import PhotoCapturer from "@/components/PhotoCapturer";
import ProgressLoadingOverlay from "@/components/ProgressLoadingOverlay";
import { UserContext } from "@/context/UserContext";
import { silhouettes } from "@/data/silhouettes";
import callTheServer from "@/functions/callTheServer";
import uploadToSpaces from "@/functions/uploadToSpaces";
import modifyQuery from "@/helpers/modifyQuery";
import openAuthModal from "@/helpers/openAuthModal";
import openErrorModal from "@/helpers/openErrorModal";
import foodImage from "@/public/assets/placeholders/food.svg";
import { ScanTypeEnum } from "@/types/global";
import ScanHeader from "../ScanHeader";
import CalorieGoalController from "./CalorieGoal";
import FoodTaskSelectionModalContent from "./FoodTaskSelectionModalContent";
import classes from "./food.module.css";

export default function ScanFoodPage() {
  const defaultRouter = useDefaultRouter();
  const searchParams = useSearchParams();
  const { status, userDetails } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<FoodAnalysisType | null>(null);
  const [calorieGoal, setCalorieGoal] = useState(0);
  const [localUrl, setLocalUrl] = useState<string>("");
  const [goalType, setGoalType] = useState<string>("portion");

  const analysisId = searchParams.get("analysisId");

  const handleAnalyzeFood = useCallback(async () => {
    if (!localUrl) return;
    setIsLoading(true);

    try {
      const fileUrls = await uploadToSpaces({
        itemsArray: [localUrl],
        mime: "image/webp",
      });

      const response = await callTheServer({
        endpoint: "analyzeFood",
        method: "POST",
        body: {
          // url: fileUrls[0],
          url: "https://mux-data.nyc3.cdn.digitaloceanspaces.com/food.jpg",
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
          const { analysis, _id, url } = response.message;
          setAnalysisResult(analysis);
          setLocalUrl(url);

          const query = modifyQuery({
            params: [{ name: "analysisId", value: _id, action: "replace" }],
          });
          defaultRouter.replace(`/scan/food?${query}`);
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
    if (analysisId) {
      const query = modifyQuery({
        params: [{ name: "analysisId", action: "delete", value: null }],
      });
      defaultRouter.replace(`/scan/food?${query}`);
    }

    setAnalysisResult(null);
    setLocalUrl("");
  }, [analysisId]);

  const handleUploadAsProof = useCallback(() => {
    try {
      if (status !== "authenticated") {
        openAuthModal({
          title: "Login to continue",
          stateObject: {
            redirectPath: "/scan/food",
            redirectQuery: searchParams.toString(),
          },
          referrer: ReferrerEnum.SCAN_FOOD,
        });
        return;
      }

      const { tasks } = userDetails || {};

      if (!tasks) throw new Error("Tasks not found");

      const foodTasks = tasks.filter((task) => task.isRecipe && task.status === "active");

      if (foodTasks.length === 0) {
        openErrorModal({ description: "You don't have any active food tasks for today." });
        return;
      }

      modals.openContextModal({
        modal: "general",
        centered: true,
        title: (
          <Title component={"p"} order={5}>
            Select food task
          </Title>
        ),
        innerProps: <FoodTaskSelectionModalContent foodUrl={localUrl} tasks={foodTasks} />,
      });
    } catch (err) {
      openErrorModal();
      console.log("Error in handleUploadAsProof: ", err);
    }
  }, [status, localUrl, userDetails, searchParams.toString()]);

  const silhouette = useMemo(
    () => silhouettes.find((rec) => rec.scanType === ScanTypeEnum.FOOD),
    []
  );

  useEffect(() => {
    if (!analysisId) return;
    callTheServer({ endpoint: `getFoodAnalysis/${analysisId}`, method: "GET" }).then((response) => {
      if (response.status === 200) {
        const { analysis, url } = response.message;
        setLocalUrl(url);
        setAnalysisResult(analysis);
      }
    });
  }, [analysisId]);

  return (
    <Stack className={`${classes.container} smallPage`}>
      <ScanHeader />
      <CalorieGoalController
        calorieGoal={calorieGoal}
        goalType={goalType}
        disabled={isLoading}
        setGoalType={setGoalType}
        setCalorieGoal={setCalorieGoal}
      />
      <Stack className={classes.content}>
        <ProgressLoadingOverlay
          isLoading={isLoading}
          customStyles={{ borderRadius: rem(16), gap: rem(16) }}
          customContainerStyles={{ width: "100%" }}
          showDisclaimer
          loaderType="bars"
          description="Analyzing"
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
          />
        )}
      </Stack>
      {analysisResult && (
        <CalorieResultOverlay
          data={analysisResult}
          calorieGoal={calorieGoal}
          handleResetResult={handleResetResult}
          handleUploadAsProof={handleUploadAsProof}
        />
      )}
      <Button disabled={!localUrl} onClick={handleAnalyzeFood}>
        <IconMenu2 className="icon" style={{ marginRight: rem(8), transform: "rotate(90deg)" }} />{" "}
        Analyze
      </Button>
    </Stack>
  );
}
