"use client";

import React, { useMemo } from "react";
import { SimpleGrid, Skeleton, Stack, Text } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import { FormattedRatingType, ProgressType } from "@/types/global";
import { getRingColor } from "@/helpers/utils";
import RingComponent from "@/components/RingComponent";
import { openExplanationModal } from "./openExplanationModal";
import classes from "./AnalysisCardPotential.module.css";

type Props = {
  currentRecord: { [key: string]: ProgressType | null | number };
  potentialRecord: { [key: string]: FormattedRatingType | null | number };
  title: string;
};

export default function AnalysisCardPotential({ currentRecord, potentialRecord, title }: Props) {
  const { height: containerHeight, width: containerWidth, ref } = useElementSize();
  const partValues = Object.values(currentRecord)
    .filter((rec) => typeof rec !== "number")
    .filter(Boolean);
  const potentialPartValues = Object.values(potentialRecord)
    .filter((rec) => typeof rec !== "number")
    .filter(Boolean);

  const averageScore = currentRecord.overall as number;
  const potentialAverageScore = potentialRecord.overall as number;

  const potentialScores = useMemo(
    () =>
      potentialPartValues.reduce((acc: { [key: string]: any }, obj) => {
        const scores = obj as { [key: string]: any };
        Object.keys(scores).forEach((key) => {
          if (key !== "overall" && key !== "explanations") {
            acc[key] = scores[key];
          }
        });
        return acc;
      }, {}),
    [potentialPartValues.length]
  );

  const potentialExplanations = useMemo(
    () =>
      potentialPartValues
        .flatMap((obj) => obj?.explanations)
        .reduce((a: { [key: string]: any }, c) => {
          a[c!.feature] = c?.explanation;
          return a;
        }, {}),
    [potentialPartValues.length]
  );

  const featureCircleObjects = useMemo(
    () =>
      partValues.flatMap((obj) =>
        Object.entries((obj as ProgressType).scores)
          .filter(([key]) => key !== "overall")
          .map(([key, value]) => [
            {
              label: key,
              value,
              color: getRingColor(potentialScores[key]),
            },
            {
              label: key,
              value: potentialScores[key] - value,
              color: getRingColor(potentialScores[key], true),
            },
            {
              label: key,
              value: 100 - (potentialScores[key] || value || 0),
              color: "gray.4",
            },
          ])
      ),
    [partValues.length]
  );

  const overallContent = [
    {
      label: "Overall",
      value: averageScore,
      color: getRingColor(potentialAverageScore),
    },
    {
      label: "Overall",
      value: potentialAverageScore - averageScore,
      color: getRingColor(potentialAverageScore, true),
    },
    {
      label: "Overall",
      value: 100 - (potentialAverageScore || averageScore || 0),
      color: "gray.4",
    },
  ];

  const cols = featureCircleObjects.length < 3 ? 1 : 2;

  const ringSize = useMemo(() => {
    return Math.max(
      Math.min(containerHeight, containerWidth) * 0.4,
      Math.min(containerHeight, containerWidth) / featureCircleObjects.length,
      125
    );
  }, [containerHeight, containerWidth, featureCircleObjects.length]);

  const showOverall = featureCircleObjects.length > 1;
  const evenFeatures = featureCircleObjects.length % 2 === 0;

  return (
    <Skeleton className="skeleton" visible={containerHeight === 0}>
      <Stack className={classes.container} ref={ref}>
        <Text ta="left" w="100%" fz={14} c="dimmed">
          {title}
        </Text>
        <Stack className={classes.wrapper}>
          {showOverall && evenFeatures && (
            <RingComponent data={overallContent} ringSize={ringSize} isPotential />
          )}
          <SimpleGrid cols={cols} spacing={0} w="100%">
            {showOverall && !evenFeatures && (
              <RingComponent data={overallContent} ringSize={ringSize} isPotential />
            )}
            {featureCircleObjects.map((featureObject, index) => {
              return (
                <RingComponent
                  data={featureObject}
                  ringSize={ringSize}
                  key={index}
                  isPotential
                  onClick={() =>
                    openExplanationModal({
                      values: featureObject,
                      explanation: potentialExplanations[featureObject[0].label],
                    })
                  }
                />
              );
            })}
          </SimpleGrid>
        </Stack>
      </Stack>
    </Skeleton>
  );
}
