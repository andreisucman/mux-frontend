import React from "react";
import { IconTrendingUp } from "@tabler/icons-react";
import { Group, Text } from "@mantine/core";
import classes from "./ScoreCell.module.css";

type Props = {
  icon?: React.ReactNode;
  score: number;
  customStyles?: { [key: string]: any };
};

export default function ScoreCell({ icon, score, customStyles }: Props) {
  return (
    <Group className={classes.cell} style={customStyles ? customStyles : {}}>
      <IconTrendingUp className="icon" />
      <Text className={classes.text}>
        {icon} {score}
      </Text>
    </Group>
  );
}
