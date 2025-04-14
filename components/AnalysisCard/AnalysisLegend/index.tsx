import React from "react";
import { Group, Text } from "@mantine/core";
import classes from "./AnalysisLegend.module.css";

type Props = { text: string; color: string };

export default function AnalysisLegend({ text, color }: Props) {
  return (
    <Group gap={12}>
      <div className={classes.square} style={{ backgroundColor: color }} />
      <Text className={classes.text}>{text}</Text>
    </Group>
  );
}
