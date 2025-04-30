import React, { useMemo } from "react";
import cn from "classnames";
import { DonutChart } from "@mantine/charts";
import { Stack, Text, Title } from "@mantine/core";
import { normalizeString } from "@/helpers/utils";
import classes from "./AnalysisCard.module.css";

type Props = {
  currentScore: number;
  changeScore: number;
  concern: string;
  explanation: string;
  isReverse?: boolean;
};

export default function AnalysisCard({
  currentScore,
  changeScore,
  concern,
  explanation,
  isReverse,
}: Props) {
  const data = isReverse
    ? [
        { name: "Ok", value: currentScore, color: "var(--mantine-color-green-7)" },
        {
          name: "Not ok",
          value: 100 - currentScore,
          color: "light-dark(var(--mantine-color-gray-2),var(--mantine-color-gray-7))",
        },
      ]
    : [
        { name: "Not ok", value: currentScore, color: "var(--mantine-color-red-7)" },
        {
          name: "Ok",
          value: 100 - currentScore,
          color: "light-dark(var(--mantine-color-gray-2),var(--mantine-color-gray-7))",
        },
      ];

  const change = useMemo(() => {
    if (!changeScore) return;
    const denominator = currentScore - changeScore;
    const percent = currentScore > 0 && denominator !== 0 ? 1 - currentScore / denominator : 0;
    const displayValue = `${changeScore < 0 ? "-" : "+"}${Math.round(percent * 100)}%`;
    return (
      <span className={cn(classes.change, { [classes.positive]: changeScore < 0 })}>
        {displayValue}
      </span>
    );
  }, [changeScore]);

  return (
    <Stack className={classes.container}>
      <Stack className={classes.content}>
        {change}
        <DonutChart data={data} startAngle={180} endAngle={0} tooltipDataSource="segment" />
        <Stack className={classes.titleStack}>
          <Title order={1} className={classes.score}>
            {currentScore}
          </Title>
          <Title order={2} className={classes.title}>
            {normalizeString(concern)}
          </Title>
        </Stack>
      </Stack>
      <Text className={classes.explanation}>{explanation}</Text>
    </Stack>
  );
}
