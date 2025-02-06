import React, { useCallback, useMemo } from "react";
import { CircleObjectType } from "@/components/AnalysisCarousel/AnalysisCard";
import RingComponent from "@/components/RingComponent";
import { calculateCircleRadius } from "@/helpers/utils";
import classes from "./OneRingGrid.module.css";

type Props = {
  ringObjects: CircleObjectType[];
  containerWidth: number;
  containerHeight: number;
  isMobile: boolean;
  explanations?: { [key: string]: string };
  openExplanationModal?: (object: { values: CircleObjectType; explanation: string }) => void;
};

export default function OneRingGrid({
  ringObjects,
  containerHeight,
  containerWidth,
  isMobile,
  explanations,
  openExplanationModal,
}: Props) {
  const ringSize = useMemo(() => {
    const size = calculateCircleRadius(containerWidth, containerHeight, ringObjects.length);
    return size * 0.8;
  }, [containerWidth, containerHeight, ringObjects.length, isMobile]);

  return (
    <div className={classes.container}>
      {ringObjects.map((featureObject, index) => {
        return (
          <RingComponent
            onClick={() =>
              openExplanationModal &&
              explanations &&
              openExplanationModal({
                values: featureObject,
                explanation: explanations[featureObject[0].label] || "",
              })
            }
            data={featureObject}
            ringSize={ringSize}
            key={index}
            isPotential={!!openExplanationModal}
          />
        );
      })}
    </div>
  );
}
