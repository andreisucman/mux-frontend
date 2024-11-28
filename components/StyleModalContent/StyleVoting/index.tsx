import React, { useCallback, useEffect, useState } from "react";
import { Group } from "@mantine/core";
import callTheServer from "@/functions/callTheServer";
import VoteButton from "./VoteButton";
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
      <VoteButton
        handleVote={handleVote}
        styleIcon={styleIcon}
        styleId={styleId}
        styleName={styleName}
        votedFor={votedFor}
        votes={votes}
        type={"current"}
      />
      <VoteButton
        handleVote={handleVote}
        styleIcon={compareIcon}
        styleId={styleId}
        styleName={compareName}
        votedFor={votedFor}
        votes={compareVotes}
        type={"compare"}
      />
    </Group>
  );
}
