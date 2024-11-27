import React, { useCallback, useEffect, useState } from "react";
import { IconCaretUp } from "@tabler/icons-react";
import cn from "classnames";
import { ActionIcon, Group } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import callTheServer from "@/functions/callTheServer";
import classes from "./StyleVoting.module.css";

type Props = {
  styleId: string;
  votes: number;
  styleIcon: string;
  styleName: string;
  compareIcon: string;
  compareName: string;
  compareVotes: number;
  setRecords: React.Dispatch<React.SetStateAction<any[] | undefined>>;
};

export default function StyleVoting({
  votes,
  compareVotes,
  styleIcon,
  compareIcon,
  styleName,
  compareName,
  styleId,
  setRecords,
}: Props) {
  const [votedFor, setVotedFor] = useState<"current" | "compare" | null>(null);

  const handleUpdateVotes = useCallback((lastVoteType: string | null, newVoteType: string) => {
    if (lastVoteType === newVoteType) return;

    if (!lastVoteType) {
      setRecords((prev: any) => {
        if (prev._id === styleId) {
          const newVotes =
            newVoteType === "current"
              ? { votes: prev.votes + 1 }
              : { compareVotes: prev.compareVotes + 1 };
          return { ...prev, ...newVotes };
        } else {
          return prev;
        }
      });
      return;
    }

    setRecords((prev: any) => {
      if (prev._id === styleId) {
        const newVotes =
          newVoteType === "current"
            ? { votes: prev.votes + 1, compareVotes: prev.compareVotes - 1 }
            : { compareVotes: prev.compareVotes + 1, votes: prev.votes - 1 };
        return { ...prev, ...newVotes };
      } else {
        return prev;
      }
    });
  }, []);

  const handleVote = useCallback(async (styleId: string, voteType: "current" | "compare") => {
    try {
      const response = await callTheServer({
        endpoint: "voteForStyle",
        method: "POST",
        body: { styleId, voteType },
      });
      if (response.status === 200) {
        setVotedFor(voteType);
        handleUpdateVotes(votedFor, voteType);
      }
    } catch (err) {
      console.log("Error in handleVote: ", err);
    }
  }, []);

  useEffect(() => {
    callTheServer({ endpoint: `getLastStyleVote/${styleId}`, method: "GET" }).then((res) => {
      if (res.status === 200) {
        setVotedFor(res.message);
      }
    });
  }, []);

  return (
    <Group className={classes.container}>
      <Group className={cn(classes.group, { [classes.selected]: votedFor === "current" })}>
        <Group className={classes.name}>
          <span className={classes.icon}>{styleIcon}</span>
          {upperFirst(styleName)}
        </Group>
        <Group className={classes.action}>
          <span className={classes.votes}>{votes}</span>

          <ActionIcon
            size="lg"
            variant={votedFor === "current" ? "filled" : "default"}
            onClick={() => handleVote(styleId, "current")}
          >
            <IconCaretUp className="icon" />
          </ActionIcon>
        </Group>
      </Group>
      <Group className={cn(classes.group, { [classes.selected]: votedFor === "compare" })}>
        <Group className={classes.name}>
          <span className={classes.icon}>{compareIcon}</span>
          {upperFirst(compareName)}
        </Group>
        <Group className={classes.action}>
          <span className={classes.votes}>{compareVotes}</span>
          <ActionIcon
            size="lg"
            variant={votedFor === "compare" ? "filled" : "default"}
            onClick={() => handleVote(styleId, "compare")}
          >
            <IconCaretUp className="icon" />
          </ActionIcon>
        </Group>
      </Group>
    </Group>
  );
}
