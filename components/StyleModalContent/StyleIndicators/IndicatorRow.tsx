import React, { memo } from "react";
import { Group, Popover, Progress, Text, Tooltip } from "@mantine/core";
import classes from "./StyleIndicators.module.css";

type Props = {
  name?: string;
  values: number[];
  icon?: string;
};

function IndicatorRow({ name, values, icon }: Props) {
  return (
    <Group className={classes.indicatorRowContainer}>
      <Progress.Root size={18} className={classes.indicatorRowProgressRoot}>
        <Tooltip label={name}>
          {values.map((value, index) => {
            const color = index === 0 ? "brand.7" : value > 0 ? "brand.3" : "gray.3";
            return (
              <Progress.Section value={(value || 0) * 10} key={index} color={color}>
                <Progress.Label>{value || 0}</Progress.Label>
              </Progress.Section>
            );
          })}
        </Tooltip>
      </Progress.Root>
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
