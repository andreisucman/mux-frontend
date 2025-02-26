import React from "react";
import { IconTrendingUp } from "@tabler/icons-react";
import { Group, Text } from "@mantine/core";
import classes from "./ScoreCell.module.css";

type Props = {
  score: number;
  customStyles?: { [key: string]: any };
};

export default function ScoreCell({ score, customStyles }: Props) {
  return (
    <Group className={classes.cell} style={customStyles ? customStyles : {}}>
      <IconTrendingUp className="icon" />
      <Text className={classes.text}>{score}</Text>
    </Group>
  );
}
