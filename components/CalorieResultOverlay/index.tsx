import React, { useMemo } from "react";
import { CloseButton, Highlight, Overlay, Stack, Table, Text } from "@mantine/core";
import PieChartComponent from "@/components/PieChart";
import percentageToFraction from "@/helpers/percentageToFraction";
import classes from "./CalorieResultOverlay.module.css";

export type FoodAnalysisType = {
  shouldEat: boolean;
  energy: number;
  proteins: number;
  carbohydrates: number;
  fats: number;
  explanation: string;
};

type Props = {
  data: FoodAnalysisType;
  actionChildren: React.ReactNode;
  calorieGoal: number;
  handleClose: () => void;
};

export default function CalorieResultOverlay({
  data,
  calorieGoal,
  actionChildren,
  handleClose,
}: Props) {
  const { shouldEat, energy, proteins, carbohydrates, fats, explanation } = data;

  const tableData = {
    body: [
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
      const eatFraction = percentageToFraction(eatShare);
      response.chartShares = [{ name: "eat", value: 100 }];

      if (energy > calorieGoal) {
        response.chartShares = [
          { name: "eat", value: eatShare },
          { name: "skip", value: 100 - eatShare },
        ];
      }
      response.eatFraction = eatFraction;
      response.titleText =
        eatFraction === "everything"
          ? "Eat everything"
          : eatFraction
            ? `Eat ${eatFraction} of it`
            : "Skip it";
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
            <PieChartComponent data={displayData.chartShares} />
            <Highlight highlight={displayData.eatFraction} ta="center" fz={32} fw={600}>
              {displayData.titleText}
            </Highlight>
            {explanation && <Text>{explanation}</Text>}
            <Table
              data={tableData}
              classNames={{ table: classes.table, td: classes.td, th: classes.th }}
            />
            {actionChildren}
          </Stack>
          <CloseButton className={classes.close} onClick={handleClose} />
        </>
      }
    />
  );
}
