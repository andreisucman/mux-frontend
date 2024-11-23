import React, { useMemo } from "react";
import { Stack } from "@mantine/core";
import { CircleObjectType } from "@/components/AnalysisCarousel/AnalysisCard";
import RingComponent from "@/components/RingComponent";
import { calculateCircleRadius, getRingColor } from "@/helpers/utils";
import classes from "./FiveRingsGrid.module.css";

type Props = {
  ringObjects: CircleObjectType[];
  containerWidth: number;
  containerHeight: number;
  averageScore: number;
  isMobile: boolean;
};

export default function FiveRingsGrid({
  ringObjects,
  containerHeight,
  containerWidth,
  averageScore,
  isMobile,
}: Props) {
  const ringSize = useMemo(() => {
    const size = calculateCircleRadius(containerWidth, containerHeight, ringObjects.length);
    return isMobile ? size : size * 0.525;
  }, [containerWidth, containerHeight, ringObjects.length]);

  const ringColor = useMemo(() => getRingColor(averageScore), []);

  return (
    <Stack className={classes.container}>
      <RingComponent
        data={[{ label: "Overall", value: averageScore, color: ringColor }]}
        ringSize={ringSize}
      />
      <div className={classes.grid}>
        {ringObjects.map((featureObject, index) => {
          return <RingComponent data={featureObject} ringSize={ringSize} key={index} />;
        })}
      </div>
    </Stack>
  );
}
