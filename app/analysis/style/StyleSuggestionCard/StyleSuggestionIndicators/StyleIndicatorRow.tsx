import React from "react";
import { Group, Popover, Progress, Text, Tooltip } from "@mantine/core";
import classes from "./StyleSuggestionIndicators.module.css";

type Props = {
  name?: string;
  value?: number;
  icon?: string;
};

export default function StyleIndicatorRow({ name, value, icon }: Props) {
  return (
    <Group className={classes.indicatorRowContainer}>
      <Progress.Root size={18} className={classes.indicatorRowProgressRoot}>
        <Tooltip label={name}>
          <Progress.Section value={(value || 0) * 10}>
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
