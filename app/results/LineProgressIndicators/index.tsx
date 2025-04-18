import React, { useMemo } from "react";
import { Group, Progress, rem, Stack, Text } from "@mantine/core";
import { normalizeString } from "@/helpers/utils";
import { ScoreDifferenceType } from "@/types/global";
import classes from "./LineProgressIndicators.module.css";

type Props = {
  customStyles?: { [key: string]: any };
  concernScoreDifference?: ScoreDifferenceType;
  title?: string;
};

const renderIndicator = ([label, value]: [string, number], index: number) => {
  const color = value < 0 ? "var(--mantine-color-green-7)" : "var(--mantine-color-red-7)";

  const displayValue =
    value > 0 ? `+${value.toFixed(0)}` : value < 0 ? `-${Math.abs(value).toFixed(0)}` : undefined;

  return (
    <Group key={`${label}-${index}`} gap="sm">
      <Text size="sm" lineClamp={1}>
        {normalizeString(label)}
      </Text>

      <Progress.Root
        className={classes.barRoot}
        size={18}
        styles={{ label: { minWidth: rem(30) } }}
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
  customStyles,
  concernScoreDifference,
}: Props) {
  const concernIndicator = useMemo(() => {
    if (!concernScoreDifference) return;
    return renderIndicator([concernScoreDifference.name, concernScoreDifference.value], 0);
  }, [concernScoreDifference]);

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
