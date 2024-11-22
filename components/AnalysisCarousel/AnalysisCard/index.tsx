"use client";

import React, { useMemo } from "react";
import cn from "classnames";
import { Skeleton, Stack, Text } from "@mantine/core";
import { useElementSize, useMediaQuery } from "@mantine/hooks";
import RingComponent from "@/components/RingComponent";
import { calculateCircleRadius, getRingColor } from "@/helpers/utils";
import { ProgressType } from "@/types/global";
import classes from "./AnalysisCard.module.css";

type Props = {
  record: { [key: string]: ProgressType | null | number };
  title: string;
};

export default function AnalysisCard({ record, title }: Props) {
  const { width: containerWidth, height: containerHeight, ref } = useElementSize();
  const isMobile = useMediaQuery("(max-width: 36em)");
  const partValues = Object.values(record)
    .filter((rec) => typeof rec !== "number")
    .filter(Boolean);
  const averageScore = record.overall as number;
  const averageScoreColor = useMemo(() => getRingColor(averageScore), []);

  const featureCircleObjects = useMemo(
    () =>
      partValues.flatMap((obj) => {
        const scores = Object.entries((obj as ProgressType).scores);
        console.log("scores", scores);
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

        if (parts.length > 1) {
          parts.unshift([
            {
              value: averageScore,
              color: averageScoreColor,
              label: "Overall",
            },
          ]);
        }

        return parts;
      }),
    [partValues.length]
  );

  const len = featureCircleObjects.length;

  const ringSize = useMemo(() => {
    const size = calculateCircleRadius(containerWidth, containerHeight, len);
    return size * 0.8;
  }, [containerWidth, containerHeight, len]);

  const customRingStyles = useMemo(() => {
    return len === 1 && isMobile
      ? { transform: "translateY(-25%)" }
      : len === 1
        ? { transform: "translateY(-10%)" }
        : {};
  }, [len]);

  return (
    <Skeleton className="skeleton" visible={containerHeight === 0}>
      <Stack className={classes.container}>
        <Text ta="left" w="100%" fz={14} c="dimmed">
          {title}
        </Text>
        <Stack className={classes.wrapper} ref={ref}>
          <div
            className={cn(classes.grid)}
            style={{
              gridTemplateColumns: `repeat(auto-fill, minmax(${Math.floor(ringSize)}px, 1fr))`,
            }}
          >
            {featureCircleObjects.map((featureObject, index) => {
              return (
                <RingComponent
                  data={featureObject}
                  ringSize={ringSize}
                  key={index}
                  customStyles={customRingStyles}
                />
              );
            })}
          </div>
        </Stack>
      </Stack>
    </Skeleton>
  );
}
