import React, { memo } from "react";
import { Group, Popover, Progress, Stack, Text, Tooltip } from "@mantine/core";
import { getLineIndicatorColor } from "@/helpers/utils";
import classes from "./StyleIndicators.module.css";

type Props = {
  name?: string;
  values: number[];
  icon?: string;
};

function IndicatorRow({ name, values, icon }: Props) {
  return (
    <Group className={classes.indicatorRowContainer}>
      <Tooltip label={name}>
        <Progress.Root size={18} className={classes.indicatorRowProgressRoot}>
          {values.map((value, index) => {
            const color =
              value > 0 ? getLineIndicatorColor(value) : "var(--mantine-color-gray-3)";
            return (
              <Progress.Section value={(value || 0) * 10} key={index} color={color}>
                <Progress.Label>{value || 0}</Progress.Label>
              </Progress.Section>
            );
          })}
        </Progress.Root>
      </Tooltip>

      <Popover withArrow offset={0} classNames={{ dropdown: classes.popoverDropdown }}>
        <Popover.Target>
          <Text className={classes.indicatorRowTargetIcon}>{icon}</Text>
        </Popover.Target>
        <Popover.Dropdown>{name}</Popover.Dropdown>
      </Popover>
    </Group>
  );
}

export default memo(IndicatorRow);
