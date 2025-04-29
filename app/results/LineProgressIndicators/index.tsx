import React, { useMemo } from "react";
import { Group, Progress, rem, Stack, Text } from "@mantine/core";
import { normalizeString } from "@/helpers/utils";
import { ScoreDifferenceType, ScoreType } from "@/types/global";
import classes from "./LineProgressIndicators.module.css";

type Props = {
  showScores?: boolean;
  customStyles?: { [key: string]: any };
  concernScores: ScoreType[];
  concernScoresDifference: ScoreDifferenceType[];
  title?: string;
};

const renderIndicator = ([label, value]: [string, number], isPercent = true) => {
  const color = value < 0 ? "var(--mantine-color-green-7)" : "var(--mantine-color-red-7)";

  let displayValue =
    value < 0
      ? `${Math.abs(value).toFixed(0)}%`
      : value > 0
        ? `-${Math.abs(value).toFixed(0)}%`
        : "";

  if (isPercent) displayValue = displayValue.slice(1, -1);

  return (
    <Group key={`${label}-${value}`} gap="sm">
      <Text size="sm" lineClamp={1}>
        {normalizeString(label)}
      </Text>

      <Progress.Root
        className={classes.barRoot}
        size={18}
        styles={{ label: { minWidth: rem(40), textAlign: "center" } }}
      >
        <Progress.Section value={Math.abs(value)} color={color}>
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
  concernScoresDifference,
}: Props) {
  const concernIndicator = useMemo(() => {
    return concernScores.map((csdo) => {
      const relevantDifference = concernScoresDifference.find((co) => co.name === csdo.name) || {
        value: 0,
      };
      const initialValue = csdo.value - relevantDifference.value;
      let percent = initialValue > 0 ? Math.round((1 - csdo.value / initialValue) * 100) : 0;
      if (relevantDifference.value < 0) percent = percent * -1;
      console.log(
        "csdo.name, showScores ? csdo.value : percent",
        csdo.name,
        showScores ? csdo.value : percent
      );
      return renderIndicator([csdo.name, showScores ? csdo.value : percent], showScores);
    });
  }, [concernScores]);

  return (
    <Stack className={classes.container} style={customStyles || {}}>
      <Stack className={classes.wrapper}>
        {title && (
          <Text c="dimmed" size="xs">
            {title}
          </Text>
        )}

        <Stack className={`${classes.indicatorsWrapper} scrollbar`}>
          <Stack gap={8}>{concernIndicator}</Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
