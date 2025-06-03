import React, { useMemo } from "react";
import cn from "classnames";
import { Group, Progress, rem, Stack, Text } from "@mantine/core";
import { normalizeString } from "@/helpers/utils";
import { ScoreDifferenceType, ScoreType } from "@/types/global";
import classes from "./LineProgressIndicators.module.css";

type Props = {
  showScores?: boolean;
  customStyles?: { [key: string]: any };
  concernScores: ScoreType[];
  concernScoresDifferences: ScoreDifferenceType[];
  title?: string;
};

const renderIndicator = ([label, improvementPercent]: [string, number], isPercent = false) => {
  const color =
    improvementPercent < 0 ? "var(--mantine-color-red-7)" : "var(--mantine-color-green-7)";

  let displayValue =
    improvementPercent < 0
      ? `-${Math.abs(improvementPercent).toFixed(0)}%`
      : improvementPercent > 0
        ? `${Math.abs(improvementPercent).toFixed(0)}%`
        : "";

  if (isPercent) displayValue = displayValue.slice(1, -1);

  return (
    <Group key={`${label}-${improvementPercent}`} gap="sm">
      <Text size="sm" lineClamp={1}>
        {normalizeString(label)}
      </Text>

      <Progress.Root
        className={classes.barRoot}
        size={18}
        styles={{ label: { minWidth: rem(40), textAlign: "center" } }}
      >
        <Progress.Section value={Math.abs(improvementPercent)} color={color}>
          <Progress.Label>{displayValue}</Progress.Label>
        </Progress.Section>
      </Progress.Root>
    </Group>
  );
};

export default function LineProgressIndicators({
  title,
  showScores,
  customStyles,
  concernScores,
  concernScoresDifferences,
}: Props) {
  const concernIndicator = useMemo(() => {
    if (showScores) concernScores = concernScores.filter((cso) => cso.value !== 0);

    return concernScores
      .map((cso) => {
        if (!cso) return null;

        const relevantDifference = concernScoresDifferences.find((co) => co.name === cso.name) || {
          [cso.name]: 0,
        };

        const initialValue = cso.value - relevantDifference.value;

        let improvementPercent =
          relevantDifference.value < 0 ? Math.round((1 - cso.value / initialValue) * 100) : 0;

        return renderIndicator([cso.name, showScores ? cso.value : improvementPercent], showScores);
      })
      .filter(Boolean);
  }, [concernScores]);

  return (
    <Stack className={classes.container} style={customStyles || {}}>
      <Stack className={classes.wrapper}>
        {title && (
          <Text c="dimmed" size="xs">
            {title}
          </Text>
        )}
        <Stack className={cn(classes.indicatorsWrapper, "scrollbar")}>
          <Stack gap={8}>{concernIndicator}</Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
