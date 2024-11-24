import React from "react";
import { IconFlame } from "@tabler/icons-react";
import { Group, RingProgress, Text } from "@mantine/core";
import classes from "./StreakStatus.module.css";

type Props = {
  completionPercent: number;
  icon: React.ReactNode;
  serie: number;
  customRingStyles?: { [key: string]: any };
};

export default function StreakStatus({ completionPercent, customRingStyles, icon, serie }: Props) {
  const sections = [];

  sections.push(
    { value: completionPercent, color: "green.7" },
    {
      value: 100 - completionPercent,
      color: "gray.3",
    }
  );

  return (
    <Group className={classes.container}>
      <RingProgress
        size={37}
        thickness={5}
        label={icon}
        sections={sections}
        styles={customRingStyles}
        classNames={{ label: classes.label }}
      />
      <Text className={classes.text}>
        <IconFlame className="icon" /> {serie || 0}
      </Text>
    </Group>
  );
}
