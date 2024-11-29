import React, { memo } from "react";
import { IconBatteryVertical, IconBatteryVertical4 } from "@tabler/icons-react";
import { Group, Progress, rem } from "@mantine/core";

type Props = {
  value: number;
};

function EnergyIndicator({ value }: Props) {
  const normalizedValue = Math.round((value * 100) / 100000);
  const color = normalizedValue >= 75 ? "green.7" : normalizedValue >= 50 ? "orange.7" : "red.7";
  return (
    <Group wrap="nowrap" w="100%" gap={rem(8)}>
      <IconBatteryVertical className="icon" />
      <Progress.Root size={18} flex={1} w="100%">
        <Progress.Section value={Number(normalizedValue)} color={color}>
          <Progress.Label>{`⚡️ ${normalizedValue}%`}</Progress.Label>
        </Progress.Section>
      </Progress.Root>
      <IconBatteryVertical4 className="icon" />
    </Group>
  );
}

export default memo(EnergyIndicator);
