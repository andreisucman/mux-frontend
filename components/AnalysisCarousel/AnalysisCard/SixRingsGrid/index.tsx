import React, { useMemo } from "react";
import cn from "classnames";
import { CircleObjectType } from "@/components/AnalysisCarousel/AnalysisCard";
import RingComponent from "@/components/RingComponent";
import { calculateCircleRadius, getRingColor } from "@/helpers/utils";
import classes from "./SixRingsGrid.module.css";

type Props = {
  ringObjects: CircleObjectType[];
  containerWidth: number;
  containerHeight: number;
  averageScore: number;
  isMobile: boolean;
};

export default function SixRingsGrid({
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

  const newObjects = useMemo(
    () => [[{ label: "Overall", value: averageScore, color: ringColor }], ...ringObjects],
    [ringObjects.length]
  );

  return (
    <div className={cn(classes.container, { [classes.mobile]: isMobile })}>
      {newObjects.map((featureObject, index) => {
        return <RingComponent data={featureObject} ringSize={ringSize} key={index} />;
      })}
    </div>
  );
}
