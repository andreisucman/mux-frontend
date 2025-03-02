import React, { memo } from "react";
import { IconBatteryVertical, IconBatteryVertical4 } from "@tabler/icons-react";
import { Group, Popover, Progress, rem, Text } from "@mantine/core";

type Props = {
  value: number;
};

function EnergyIndicator({ value }: Props) {
  const normalizedValue = Math.round(
    (value * 100) / Number(process.env.NEXT_PUBLIC_COACH_MAX_ENERGY!)
  );
  const color =
    normalizedValue >= 75
      ? "var(--mantine-color-green-7)"
      : normalizedValue >= 50
        ? "var(--mantine-color-orange-7)"
        : "var(--mantine-color-red-7)";
  return (
    <Group wrap="nowrap" w="100%" gap={rem(8)}>
      <IconBatteryVertical className="icon" />
      <Popover withArrow offset={0}>
        <Popover.Target>
          <Progress.Root size={18} flex={1} w="100%">
            <Progress.Section value={Number(normalizedValue)} color={color}>
              <Progress.Label>{normalizedValue}%</Progress.Label>
            </Progress.Section>
          </Progress.Root>
        </Popover.Target>
        <Popover.Dropdown>
          <Text size="sm">The energy recovers every hour.</Text>
        </Popover.Dropdown>
      </Popover>

      <IconBatteryVertical4 className="icon" />
    </Group>
  );
}

export default memo(EnergyIndicator);
