import React from "react";
import { RingProgress, Stack, Text } from "@mantine/core";
import classes from "./RewardRingCell.module.css";

type Props = { icon: string; sections: { value: number; color: string }[] };

export default function RewardRingCell({ icon, sections }: Props) {
  return (
    <Stack className={classes.container}>
      <Text>{icon}</Text>
      <RingProgress
        size={55}
        thickness={8}
        label={<Text className={classes.labelText}>0</Text>}
        classNames={{ label: classes.label }}
        sections={sections}
      />
    </Stack>
  );
}
