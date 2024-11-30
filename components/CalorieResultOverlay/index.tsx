import React, { useMemo } from "react";
import { Highlight, Overlay, Stack, Table } from "@mantine/core";
import PieChartComponent from "@/components/PieChart";
import percentageToFraction from "@/helpers/percentageToFraction";
import classes from "./CalorieResultOverlay.module.css";

export type FoodAnalysisType = {
  energy: number;
  proteins: number;
  carbohydrates: number;
  fats: number;
};

type Props = {
  data: FoodAnalysisType;
  actionChildren: React.ReactNode;
  calorieGoal: number;
};

export default function CalorieResultOverlay({ data, calorieGoal, actionChildren }: Props) {
  const { energy, proteins, carbohydrates, fats } = data;

  const tableData = {
    body: [
      ["Calories", `${energy}kcal`],
      ["Protein", `${proteins}g`],
      ["Carbohydrates", `${carbohydrates}g`],
      ["Fats", `${fats}g`],
    ],
  };

  const eatShare = useMemo(
    () => (calorieGoal > energy ? 100 : Math.round((calorieGoal / energy) * 100)),
    [energy, calorieGoal]
  );
  const eatFraction = useMemo(() => percentageToFraction(eatShare), [eatShare]);

  const shares = useMemo(() => {
    let shares = [{ name: "eat", value: 100 }];

    if (energy > calorieGoal) {
      shares = [
        { name: "eat", value: eatShare },
        { name: "skip", value: 100 - eatShare },
      ];
    }

    return shares;
  }, [energy, calorieGoal]);

  const text =
    eatFraction === "everything"
      ? "Eat everything"
      : eatFraction
        ? `Eat ${eatFraction} of it`
        : "Skip it";

  return (
    <Overlay
      className={classes.overlay}
      children={
        <Stack className={classes.container}>
          <PieChartComponent data={shares} />
          <Highlight highlight={eatFraction} ta="center" fz={32} fw={600}>
            {text}
          </Highlight>
          <Table
            data={tableData}
            classNames={{ table: classes.table, td: classes.td, th: classes.th }}
          />
          {actionChildren}
        </Stack>
      }
    />
  );
}
