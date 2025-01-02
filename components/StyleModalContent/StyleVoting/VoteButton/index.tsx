import React from "react";
import { IconThumbUp } from "@tabler/icons-react";
import cn from "classnames";
import { ActionIcon, Group } from "@mantine/core";
import classes from "./VoteButton.module.css";

type Props = {
  styleId: string;
  votedFor: "current" | "compare" | null;
  styleIcon: string;
  isInverse?: boolean;
  votes: number;
  type: "current" | "compare";
  handleVote: (styleId: string, votedFor: "current" | "compare") => void;
};

export default function VoteButton({
  isInverse,
  styleId,
  votedFor,
  styleIcon,
  votes,
  type,
  handleVote,
}: Props) {
  return (
    <Group
      className={cn(classes.group, {
        [classes.selected]: votedFor === type,
        [classes.inverse]: isInverse,
      })}
    >
      <span className={classes.icon}>{styleIcon}</span>
      <span className={classes.votes}>{votes}</span>
      <ActionIcon
        size="xl"
        variant={"default"}
        className={cn({ [classes.filledButton]: votedFor === type })}
        onClick={() => handleVote(styleId, type)}
      >
        <IconThumbUp
          className={cn("icon icon__large", classes.icon, {
            [classes.filled]: votedFor === type,
            [classes.inverseIcon]: isInverse,
          })}
        />
      </ActionIcon>
    </Group>
  );
}
