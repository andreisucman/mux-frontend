import React, { useMemo } from "react";
import { IconCaretUp } from "@tabler/icons-react";
import cn from "classnames";
import { ActionIcon, Group } from "@mantine/core";
import { outlookStyles } from "@/app/analysis/style/SelectStyleGoalModalContent/outlookStyles";
import classes from "./VoteButton.module.css";

type Props = {
  styleId: string;
  votedFor: "current" | "compare" | null;
  styleIcon: string;
  styleName: string;
  votes: number;
  type: "current" | "compare";
  handleVote: (styleId: string, votedFor: "current" | "compare") => void;
};

export default function VoteButton({ styleId, votedFor, styleName, votes, handleVote }: Props) {
  const styleIcon = useMemo(
    () => outlookStyles.find((item) => item.name === styleName.toLowerCase())?.icon,
    [styleName]
  );
  return (
    <Group className={cn(classes.group, { [classes.selected]: votedFor === "current" })}>
      <span className={classes.icon}>{styleIcon}</span>
      <Group className={classes.action}>
        <span className={classes.votes}>{votes}</span>
        <ActionIcon
          size="lg"
          variant={"default"}
          className={cn({ [classes.filledButton]: votedFor === "current" })}
          onClick={() => handleVote(styleId, "current")}
        >
          <IconCaretUp
            className={cn("icon", classes.icon, { [classes.filled]: votedFor === "current" })}
          />
        </ActionIcon>
      </Group>
    </Group>
  );
}
