import React from "react";
import { Group, Text } from "@mantine/core";
import classes from "./ScoreCell.module.css";

type Props = {
  score: number;
  icon: React.ReactNode;
  customStyles?: { [key: string]: any };
};

export default function ScoreCell({ score, icon, customStyles }: Props) {
  return (
    <Group className={classes.cell} style={customStyles ? customStyles : {}}>
      {icon}
      <Text className={classes.text}>{String(score)}</Text>
    </Group>
  );
}
