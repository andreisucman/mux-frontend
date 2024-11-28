import React from "react";
import { IconCaretUp } from "@tabler/icons-react";
import cn from "classnames";
import { Group } from "@mantine/core";
import classes from "./VotesCountIndicator.module.css";

type Props = {
  votes: number;
  position?: "bottom-left" | "bottom-right";
  customStyles?: { [key: string]: any };
};

export default function VotesCountIndicator({
  votes,
  position = "bottom-left",
  customStyles,
}: Props) {
  return (
    <Group
      className={cn(classes.container, {
        [classes.bottomLeft]: position === "bottom-left",
        [classes.bottomRight]: position === "bottom-right",
      })}
      style={customStyles ? customStyles : {}}
    >
      <IconCaretUp className={`icon ${classes.icon}`} />
      <span className={classes.votes}>{votes}</span>
    </Group>
  );
}
