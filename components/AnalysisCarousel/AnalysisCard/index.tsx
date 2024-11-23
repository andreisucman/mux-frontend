"use client";

import React, { useMemo } from "react";
import { Skeleton, Stack, Text } from "@mantine/core";
import { useElementSize, useMediaQuery } from "@mantine/hooks";
import { getRingColor } from "@/helpers/utils";
import { ProgressType } from "@/types/global";
import FiveRingsGrid from "./FiveRingsGrid";
import OneRingGrid from "./OneRingGrid";
import SevenRingsGrid from "./SevenRingsGrid";
import SixRingsGrid from "./SixRingsGrid";
import ThreeRingsGrid from "./ThreeRingsGrid";
import classes from "./AnalysisCard.module.css";

type Props = {
  record: { [key: string]: ProgressType | null | number };
  title: string;
};

export type CircleObjectType = { label: string; value: any; color: string }[];

export default function AnalysisCard({ record, title }: Props) {
  const { width: containerWidth, height: containerHeight, ref } = useElementSize();
  const isMobile = !!useMediaQuery("(max-width: 36em)");
  const partValues = Object.values(record)
    .filter((rec) => typeof rec !== "number")
    .filter(Boolean);

  const averageScore = record.overall as number;

  const ringColor = useMemo(() => getRingColor(averageScore), []);

  const overallContent = [{ label: "Overall", value: averageScore, color: ringColor }];

  const featureRingObjects = useMemo(
    () =>
      partValues.flatMap((obj) => {
        const scores = Object.entries((obj as ProgressType).scores);
        const parts = [
          ...scores
            .filter(([key]) => key !== "overall")
            .map(([key, value]) => [
              {
                label: key,
                value,
                color: getRingColor(value),
              },
            ]),
        ];

        return parts;
      }),
    [partValues.length]
  );

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
            />
          )}
          {len === 2 && (
            <ThreeRingsGrid
              ringObjects={featureRingObjects}
              containerHeight={containerHeight}
              containerWidth={containerWidth}
              overallContent={overallContent}
              isMobile={isMobile}
            />
          )}
          {len === 4 && (
            <FiveRingsGrid
              ringObjects={featureRingObjects}
              containerHeight={containerHeight}
              containerWidth={containerWidth}
              overallContent={overallContent}
              isMobile={isMobile}
            />
          )}
          {len === 5 && (
            <SixRingsGrid
              ringObjects={featureRingObjects}
              containerHeight={containerHeight}
              containerWidth={containerWidth}
              overallContent={overallContent}
              isMobile={isMobile}
            />
          )}
          {len === 6 && (
            <SevenRingsGrid
              ringObjects={featureRingObjects}
              containerHeight={containerHeight}
              containerWidth={containerWidth}
              overallContent={overallContent}
              isMobile={isMobile}
            />
          )}
        </Stack>
      </Stack>
    </Skeleton>
  );
}
