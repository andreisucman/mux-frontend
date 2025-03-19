"use client";

import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button, Overlay, Skeleton, Stack, Table, Text, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { ReferrerEnum } from "@/app/auth/AuthForm/types";
import { ChatCategoryEnum } from "@/app/diary/type";
import FoodTaskSelectionModalContent from "@/components/FoodTaskSelectionModalContent";
import OverlayWithText from "@/components/OverlayWithText";
import PageHeader from "@/components/PageHeader";
import PieChartComponent from "@/components/PieChart";
import { CalorieGoalContext } from "@/context/CalorieGoalContext";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import { useRouter } from "@/helpers/custom-router";
import openAuthModal from "@/helpers/openAuthModal";
import openErrorModal from "@/helpers/openErrorModal";
import { FoodAnalysisResponseType } from "./types";
import classes from "./food.module.css";

export const runtime = "edge";

export default function FoodScanResult() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { calorieGoal } = useContext(CalorieGoalContext);
  const [data, setData] = useState<FoodAnalysisResponseType>();
  const { status, userDetails } = useContext(UserContext);
  const [displayComponent, setDisplayComponent] = useState<"loading" | "analysis" | "empty">(
    "loading"
  );
  const [pageLoaded, setPageLoaded] = useState(false);
  const analysisId = searchParams.get("analysisId");

  const { url, analysis } = data || {};
  const { shouldEat, foodName, amount, energy, proteins, carbohydrates, fats, explanation } =
    analysis || {};

  const { _id: userId } = userDetails || {};

  const tableData = {
    body: [
      ["Amount", `${amount}g`],
      ["Calories", `${energy}kcal`],
      ["Protein", `${proteins}g`],
      ["Carbohydrates", `${carbohydrates}g`],
      ["Fats", `${fats}g`],
    ],
  };

  const displayData = useMemo(() => {
    if (energy === undefined || shouldEat === undefined) return;

    let response = [] as { name: string; value: number }[];

    if (shouldEat) {
      const eatShare = calorieGoal > energy ? 100 : Math.round((calorieGoal / energy) * 100);

      response = [{ name: "eat", value: 100 }];

      if (energy > calorieGoal) {
        response = [
          { name: "eat", value: eatShare },
          { name: "skip", value: 100 - eatShare },
        ];
      }
    } else {
      response = [
        { name: "eat", value: 0 },
        { name: "skip", value: 100 },
      ];
    }
    return response;
  }, [shouldEat, energy]);

  const handleUploadAsProof = useCallback(() => {
    if (!url) return;
    try {
      if (status !== "authenticated") {
        openAuthModal({
          title: "Sign in to continue",
          stateObject: {
            redirectPath: "/scan/food",
            localUserId: userId,
            redirectQuery: searchParams.toString(),
            referrer: ReferrerEnum.SCAN_FOOD,
          },
        });
        return;
      }

      const { tasks } = userDetails || {};

      if (!tasks) throw new Error("Tasks not found");

      const foodTasks = tasks.filter((task) => task.isDish && task.status === "active");

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
        innerProps: <FoodTaskSelectionModalContent foodUrl={url} tasks={foodTasks} />,
      });
    } catch (err) {
      openErrorModal();
      console.log("Error in handleUploadAsProof: ", err);
    }
  }, [status, url, userDetails, searchParams.toString()]);

  useEffect(() => {
    if (!pageLoaded) return;

    callTheServer({
      endpoint: `getLatestFoodAnalysis${analysisId ? `/${analysisId}` : ""}`,
      method: "GET",
    }).then((response) => {
      if (response.status === 200) {
        if (response.message) {
          setData(response.message);
          setDisplayComponent("analysis");
        } else {
          setDisplayComponent("empty");
        }
      }
    });
  }, [analysisId, pageLoaded]);

  useEffect(() => {
    setPageLoaded(true);
  }, []);

  const title = foodName
    ? shouldEat
      ? `Eat ${foodName.toLowerCase()}`
      : `Skip ${foodName.toLowerCase()}`
    : "Food analysis";

  return (
    <Stack className={`${classes.container} smallPage`}>
      <PageHeader title={title} />
      <Skeleton className={`skeleton ${classes.skeleton}`} visible={displayComponent === "loading"}>
        {displayComponent === "analysis" && (
          <Stack className={classes.container}>
            {explanation && <Text>{explanation}</Text>}
            <Stack className={classes.chartWrapper} style={{ backgroundImage: `url(${url})` }}>
              <Overlay className={classes.overlay}>
                <PieChartComponent data={displayData || []} />
              </Overlay>
            </Stack>
            <Button size="compact-sm" onClick={handleUploadAsProof}>
              Upload as proof
            </Button>
            <Stack className={classes.tableStack}>
              <Table data={tableData} />
            </Stack>
          </Stack>
        )}
        {displayComponent === "empty" && (
          <OverlayWithText
            text={`Nothing found`}
            button={
              <Button mt={8} variant="default" onClick={() => router.push(`/scan/food`)}>
                Scan food
              </Button>
            }
          />
        )}
      </Skeleton>
    </Stack>
  );
}
