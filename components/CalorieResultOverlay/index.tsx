import React, { useMemo } from "react";
import { IconRotate, IconTarget } from "@tabler/icons-react";
import {
  Button,
  CloseButton,
  Group,
  Highlight,
  Overlay,
  rem,
  Stack,
  Table,
  Text,
} from "@mantine/core";
import PieChartComponent from "@/components/PieChart";
import classes from "./CalorieResultOverlay.module.css";

export type FoodAnalysisType = {
  shouldEat: boolean;
  amount: number;
  energy: number;
  proteins: number;
  carbohydrates: number;
  fats: number;
  explanation: string;
};

type Props = {
  data: FoodAnalysisType;
  calorieGoal: number;
  handleResetResult: () => void;
  handleUploadAsProof: () => void;
};

export default function CalorieResultOverlay({
  data,
  calorieGoal,
  handleResetResult,
  handleUploadAsProof,
}: Props) {
  const { shouldEat, amount, energy, proteins, carbohydrates, fats, explanation } = data;

  const tableData = {
    body: [
      ["Amount", `${amount}g`],
      ["Calories", `${energy}kcal`],
      ["Protein", `${proteins}g`],
      ["Carbohydrates", `${carbohydrates}g`],
      ["Fats", `${fats}g`],
    ],
  };

  let displayData = useMemo(() => {
    let response = {
      titleText: "",
      eatFraction: "",
      chartShares: [] as { name: string; value: number }[],
    };

    if (shouldEat) {
      const eatShare = calorieGoal > energy ? 100 : Math.round((calorieGoal / energy) * 100);

      response.chartShares = [{ name: "eat", value: 100 }];

      if (energy > calorieGoal) {
        response.chartShares = [
          { name: "eat", value: eatShare },
          { name: "skip", value: 100 - eatShare },
        ];
      }
      response.eatFraction = `${eatShare}%`;
      response.titleText =
        eatShare === 100 ? "Eat everything" : eatShare ? `Eat ${eatShare}% of it` : "Skip it";
    } else {
      response.titleText = "Skip it";
      response.chartShares = [
        { name: "eat", value: 0 },
        { name: "skip", value: 100 },
      ];
    }
    return response;
  }, [shouldEat, energy]);

  return (
    <Overlay
      className={classes.overlay}
      children={
        <>
          <Stack className={classes.container}>
            <CloseButton className={classes.close} onClick={handleResetResult} />
            <Highlight highlight={displayData.eatFraction} ta="center" fz={32} fw={600}>
              {displayData.titleText}
            </Highlight>
            {explanation && <Text ta="center">{explanation}</Text>}
            <PieChartComponent data={displayData.chartShares} />
            <Stack className={classes.tableStack}>
              <Text ml={8} fz="sm" c="dimmed">
                Analysis:
              </Text>
              <Table data={tableData} />
            </Stack>
            <Group className={classes.buttons}>
              <Button className={classes.button} variant="default" onClick={handleResetResult}>
                New scan
              </Button>
              <Button className={classes.button} onClick={handleUploadAsProof}>
                Upload as proof
              </Button>
            </Group>
          </Stack>
        </>
      }
    />
  );
}
