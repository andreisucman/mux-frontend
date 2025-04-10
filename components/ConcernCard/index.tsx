import React, { useMemo } from "react";
import cn from "classnames";
import { DonutChart } from "@mantine/charts";
import { Stack, Text, Title } from "@mantine/core";
import { normalizeString } from "@/helpers/utils";
import classes from "./ConcernCard.module.css";

type Props = { currentScore: number; changeScore: number; concern: string; explanation: string };

export default function ConcernCard({ currentScore, changeScore, concern, explanation }: Props) {
  const data = [
    { name: "Not ok", value: currentScore, color: "var(--mantine-color-red-7)" },
    { name: "Ok", value: 100 - currentScore, color: "var(--mantine-color-green-7)" },
  ];

  const change = useMemo(() => {
    if (!changeScore) return;
    return (
      <span className={cn(classes.change, { [classes.positive]: changeScore < 0 })}>
        +{changeScore}
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
