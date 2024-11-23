"use client";

import React, { useMemo } from "react";
import { Skeleton, Stack, Text } from "@mantine/core";
import { useElementSize, useMediaQuery } from "@mantine/hooks";
import OneRingGrid from "@/components/AnalysisCarousel/AnalysisCard//OneRingGrid";
import SevenRingsGrid from "@/components/AnalysisCarousel/AnalysisCard//SevenRingsGrid";
import SixRingsGrid from "@/components/AnalysisCarousel/AnalysisCard//SixRingsGrid";
import ThreeRingsGrid from "@/components/AnalysisCarousel/AnalysisCard//ThreeRingsGrid";
import FiveRingsGrid from "@/components/AnalysisCarousel/AnalysisCard/FiveRingsGrid";
import { getRingColor } from "@/helpers/utils";
import { FormattedRatingType, ProgressType } from "@/types/global";
import { openExplanationModal } from "./openExplanationModal";
import classes from "./AnalysisCardPotential.module.css";

type Props = {
  currentRecord: { [key: string]: ProgressType | null | number };
  potentialRecord: { [key: string]: FormattedRatingType | null | number };
  title: string;
};

export default function AnalysisCardPotential({ currentRecord, potentialRecord, title }: Props) {
  const { height: containerHeight, width: containerWidth, ref } = useElementSize();
  const isMobile = !!useMediaQuery("(max-width: 36em)");

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

  const featureRingObjects = useMemo(
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
              value: potentialScores[key] - value || 0,
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

  console.log("potentialScores", potentialScores);
  console.log("featureRingObjects", featureRingObjects);

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

  const len = featureRingObjects.length;

  return (
    <Skeleton className="skeleton" visible={containerHeight === 0}>
      <Stack className={classes.container}>
        <Text className={classes.title} c="dimmed">
          {title}
        </Text>
        <Stack className={classes.wrapper} ref={ref}>
          {len === 1 && (
            <OneRingGrid
              ringObjects={featureRingObjects}
              containerHeight={containerHeight}
              containerWidth={containerWidth}
              isMobile={isMobile}
              explanations={potentialExplanations}
              openExplanationModal={openExplanationModal}
            />
          )}
          {len === 2 && (
            <ThreeRingsGrid
              isMobile={isMobile}
              ringObjects={featureRingObjects}
              containerHeight={containerHeight}
              containerWidth={containerWidth}
              overallContent={overallContent}
              explanations={potentialExplanations}
              openExplanationModal={openExplanationModal}
            />
          )}
          {len === 4 && (
            <FiveRingsGrid
              isMobile={isMobile}
              ringObjects={featureRingObjects}
              containerHeight={containerHeight}
              containerWidth={containerWidth}
              overallContent={overallContent}
              explanations={potentialExplanations}
              openExplanationModal={openExplanationModal}
            />
          )}
          {len === 5 && (
            <SixRingsGrid
              isMobile={isMobile}
              ringObjects={featureRingObjects}
              containerHeight={containerHeight}
              containerWidth={containerWidth}
              overallContent={overallContent}
              explanations={potentialExplanations}
              openExplanationModal={openExplanationModal}
            />
          )}
          {len === 6 && (
            <SevenRingsGrid
              isMobile={isMobile}
              ringObjects={featureRingObjects}
              containerHeight={containerHeight}
              containerWidth={containerWidth}
              overallContent={overallContent}
              explanations={potentialExplanations}
              openExplanationModal={openExplanationModal}
            />
          )}
        </Stack>
      </Stack>
    </Skeleton>
  );
}
