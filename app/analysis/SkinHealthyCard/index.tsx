import React from "react";
import { IconCheck } from "@tabler/icons-react";
import { RingProgress, Stack, Text, Title } from "@mantine/core";
import { LatestScoresDifferenceType, LatestScoresType } from "@/types/global";
import classes from "./SkinHealthyCard.module.css";

type Props = {
  part: string;
  latestFeatureScores: LatestScoresType;
  latestFeatureScoresDifference: LatestScoresDifferenceType;
};

export default function SkinHealthyCard({
  part,
  latestFeatureScores,
  latestFeatureScoresDifference,
}: Props) {
  const data = [
    {
      value: 100 as number,
      label: "Overall",
      color: "var(--mantine-color-green-7)",
    },
  ];
  return (
    <Stack className={classes.container}>
      <Stack className={classes.wrapper}>
        <RingProgress
          size={125}
          thickness={12}
          sections={data}
          label={
            <Stack className={classes.label}>
              <IconCheck size={48} stroke={4} color={"var(--mantine-color-green-7)"} />{" "}
            </Stack>
          }
        />
        <Title className={classes.title}>Your {part} looks perfect!</Title>
        <Text className={classes.description}>We couldn't find any concerns from your photos!</Text>
        <Stack>
          
        </Stack>
      </Stack>
    </Stack>
  );
}
