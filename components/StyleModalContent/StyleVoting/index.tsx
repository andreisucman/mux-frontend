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
  styleId,
  setRecords,
}: Props) {
  const [localVotes, setLocalVotes] = useState(votes);
  const [localCompareVotes, setLocalCompareVotes] = useState(compareVotes);
  const [votedFor, setVotedFor] = useState<"current" | "compare" | null>(null);

  const handleUpdateVotes = useCallback((lastVoteType: string | null, newVoteType: string) => {
    if (lastVoteType === newVoteType) return;

    console.log("line 33", "lastVoteType", lastVoteType, "newVoteType", newVoteType);

    if (newVoteType === "current") {
      setLocalVotes((prev) => prev + 1);
      if (lastVoteType === "compare") {
        setLocalCompareVotes((prev) => prev - 1);
      }
    } else {
      setLocalCompareVotes((prev) => prev + 1);
      if (lastVoteType === "current") {
        setLocalVotes((prev) => prev - 1);
      }
    }

    if (!lastVoteType) {
      setRecords((prev: any[] | undefined) => {
        if (!prev) return prev;
        const updatedRecords = prev.map((rec) => {
          if (rec._id === styleId) {
            const newVotes =
              newVoteType === "current"
                ? { votes: rec.votes + 1 }
                : { compareVotes: rec.compareVotes + 1 };

            return { ...rec, ...newVotes };
          } else {
            return rec;
          }
        });

        return updatedRecords;
      });
      return;
    }

    setRecords((prev: any[] | undefined) => {
      if (!prev) return prev;
      const updatedRecords = prev.map((rec) => {
        if (rec._id === styleId) {
          const newVotes =
            newVoteType === "current"
              ? { votes: rec.votes + 1, compareVotes: rec.compareVotes - 1 }
              : { compareVotes: rec.compareVotes + 1, votes: rec.votes - 1 };

          return { ...rec, ...newVotes };
        } else {
          return rec;
        }
      });

      return updatedRecords;
    });
  }, []);

  const handleVote = useCallback(
    async (styleId: string, voteType: "current" | "compare") => {
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
      } catch (err) {}
    },
    [votedFor]
  );

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
        votedFor={votedFor}
        votes={localVotes}
        type={"current"}
      />
      <VoteButton
        handleVote={handleVote}
        styleIcon={compareIcon}
        styleId={styleId}
        votedFor={votedFor}
        votes={localCompareVotes}
        type={"compare"}
        isInverse
      />
    </Group>
  );
}
