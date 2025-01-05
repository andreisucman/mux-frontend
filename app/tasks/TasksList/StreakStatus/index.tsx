import React, { memo } from "react";
import { IconFlame, IconFlameFilled } from "@tabler/icons-react";
import { RingProgress } from "@mantine/core";
import classes from "./StreakStatus.module.css";

type Props = {
  completionPercent: number;
  customRingStyles?: { [key: string]: any };
};

function StreakStatus({ completionPercent, customRingStyles }: Props) {
  const sections = [];

  sections.push(
    { value: completionPercent, color: "var(--mantine-color-green-7)" },
    {
      value: 100 - completionPercent,
      color: "var(--mantine-color-dark-4)",
    }
  );

  const label =
    completionPercent === 100 ? (
      <IconFlameFilled className={classes.icon} color={"var(--mantine-color-orange-7)"} />
    ) : (
      <IconFlame className={classes.icon} color="white" />
    );

  return (
    <RingProgress
      size={36}
      thickness={4}
      label={label}
      sections={sections}
      styles={customRingStyles}
      classNames={{ label: classes.label }}
    />
  );
}

export default memo(StreakStatus);
