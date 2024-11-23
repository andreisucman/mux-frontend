import React, { useMemo } from "react";
import cn from "classnames";
import { Stack } from "@mantine/core";
import { CircleObjectType } from "@/components/AnalysisCarousel/AnalysisCard";
import RingComponent from "@/components/RingComponent";
import { calculateCircleRadius, getRingColor } from "@/helpers/utils";
import classes from "./ThreeRingsGrid.module.css";

type Props = {
  ringObjects: CircleObjectType[];
  containerWidth: number;
  containerHeight: number;
  averageScore: number;
  isMobile: boolean;
};

export default function ThreeRingsGrid({
  ringObjects,
  containerHeight,
  containerWidth,
  averageScore,
  isMobile,
}: Props) {
  const ringSize = useMemo(() => {
    const size = calculateCircleRadius(containerWidth, containerHeight, ringObjects.length);
    return isMobile ? size : size * 0.8;
  }, [containerWidth, containerHeight, ringObjects.length, isMobile]);

  const ringColor = useMemo(() => getRingColor(averageScore), []);

  return (
    <Stack className={cn(classes.container, { [classes.desktop]: !isMobile })}>
      <RingComponent
        data={[{ label: "Overall", value: averageScore, color: ringColor }]}
        ringSize={ringSize}
      />
      <div className={cn(classes.grid, { [classes.horizontal]: !isMobile })}>
        {ringObjects.map((featureObject, index) => {
          return <RingComponent data={featureObject} ringSize={ringSize} key={index} />;
        })}
      </div>
    </Stack>
  );
}
