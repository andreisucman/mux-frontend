import React from "react";
import { IconFlameFilled } from "@tabler/icons-react";
import { Group, RingProgress, Text } from "@mantine/core";
import classes from "./StreakStatus.module.css";

type Props = {
  completionPercent: number;
  serie: number;
  customRingStyles?: { [key: string]: any };
};

export default function StreakStatus({ completionPercent, customRingStyles, serie }: Props) {
  const sections = [];

  console.log("completionPercent",completionPercent)

  sections.push(
    { value: completionPercent, color: "var(--mantine-color-green-7)" },
    {
      value: 100 - completionPercent,
      color: "var(--mantine-color-gray-3)",
    }
  );

  return (
    <Group className={classes.container}>
      <RingProgress
        size={30}
        thickness={4}
        label={
          <IconFlameFilled
            className={classes.icon}
            color={completionPercent === 100 ? "var(--mantine-color-orange-7)" : undefined}
          />
        }
        sections={sections}
        styles={customRingStyles}
        classNames={{ label: classes.label }}
      />
      <Text className={classes.text}>{serie || 0}</Text>
    </Group>
  );
}
