import React, { useMemo } from "react";
import { CircleObjectType } from "@/components/AnalysisCarousel/AnalysisCard";
import RingComponent from "@/components/RingComponent";
import { calculateCircleRadius } from "@/helpers/utils";
import classes from "./OneRingGrid.module.css";

type Props = {
  ringObjects: CircleObjectType[];
  containerWidth: number;
  containerHeight: number;
  isMobile: boolean;
};

export default function OneRingGrid({
  ringObjects,
  containerHeight,
  containerWidth,
  isMobile,
}: Props) {
  const ringSize = useMemo(() => {
    const size = calculateCircleRadius(containerWidth, containerHeight, ringObjects.length);
    return isMobile ? size * 0.8 : size * 0.6;
  }, [containerWidth, containerHeight, ringObjects.length, isMobile]);

  return (
    <div className={classes.container}>
      {ringObjects.map((featureObject, index) => {
        return <RingComponent data={featureObject} ringSize={ringSize} key={index} />;
      })}
    </div>
  );
}
