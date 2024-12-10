import React, { useMemo } from "react";
import { Group, Popover, Progress, Text, Tooltip } from "@mantine/core";
import classes from "./StyleSuggestionIndicators.module.css";

type Props = {
  name?: string;
  value?: number;
  icon?: string;
};

export function getColor(score: number) {
  let color = "var(--mantine-color-green-7)";
  if (score < 7) {
    color = "var(--mantine-color-orange-7)";
  }
  if (score < 3) {
    color = "var(--mantine-color-red-7)";
  }
  return color;
}

export default function StyleIndicatorRow({ name, value, icon }: Props) {
  const color = useMemo(() => getColor(value || 0), []);
  return (
    <Group className={classes.indicatorRowContainer}>
      <Progress.Root size={16} className={classes.indicatorRowProgressRoot}>
        <Tooltip label={name}>
          <Progress.Section value={(value || 0) * 10} color={color}>
            <Progress.Label>{value || 0}</Progress.Label>
          </Progress.Section>
        </Tooltip>
      </Progress.Root>
      <Popover withArrow offset={0} styles={{ dropdown: { padding: "0.25rem 0.5rem" } }}>
        <Popover.Target>
          <Text className={classes.indicatorRowTargetIcon}>{icon}</Text>
        </Popover.Target>
        <Popover.Dropdown>{name}</Popover.Dropdown>
      </Popover>
    </Group>
  );
}
