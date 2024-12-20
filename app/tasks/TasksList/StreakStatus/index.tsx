import React from "react";
import { IconFlameFilled } from "@tabler/icons-react";
import { RingProgress } from "@mantine/core";
import classes from "./StreakStatus.module.css";

type Props = {
  completionPercent: number;
  customRingStyles?: { [key: string]: any };
};

export default function StreakStatus({ completionPercent, customRingStyles }: Props) {
  const sections = [];

  sections.push(
    { value: completionPercent, color: "var(--mantine-color-green-7)" },
    {
      value: 100 - completionPercent,
      color: "var(--mantine-color-gray-3)",
    }
  );

  return (
    <RingProgress
      size={30}
      thickness={3}
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
  );
}
