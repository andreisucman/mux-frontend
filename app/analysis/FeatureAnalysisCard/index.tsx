import React, { useMemo } from "react";
import { Group, Stack, Text } from "@mantine/core";
import RingComponent from "@/components/RingComponent";
import { getRingColor } from "@/helpers/utils";
import { LatestScoresType } from "@/types/global";
import classes from "./FeatureAnalysisCard.module.css";

type Props = {
  latestFeatureScores?: LatestScoresType;
  part: string;
};

export default function FeatureAnalysisCard({ latestFeatureScores, part }: Props) {
  const featureRows = useMemo(() => {
    if (!latestFeatureScores || !part) return;

    const partFeatures = latestFeatureScores[part];

    if (!partFeatures) return;

    return partFeatures.map((obj, index) => {
      const data = [
        {
          value: obj.value,
          color: getRingColor(obj.value, true),
          label: obj.name,
        },
      ];
      return (
        <Group className={classes.row} key={index}>
          {partFeatures.length > 1 && <RingComponent data={data} ringSize={75} />}
          <Text>{obj.explanation}</Text>
        </Group>
      );
    });
  }, [latestFeatureScores, part]);

  return <Stack>{featureRows}</Stack>;
}
