import React, { useMemo } from "react";
import { Stack } from "@mantine/core";
import { CircleObjectType } from "@/components/AnalysisCarousel/AnalysisCard";
import RingComponent from "@/components/RingComponent";
import { calculateCircleRadius } from "@/helpers/utils";
import classes from "./ThreeRingsGrid.module.css";

type Props = {
  ringObjects: CircleObjectType[];
  containerWidth: number;
  containerHeight: number;
  overallContent: CircleObjectType;
  isMobile: boolean;
  explanations?: { [key: string]: string };
  openExplanationModal?: (object: { values: CircleObjectType; explanation: string }) => void;
};

export default function ThreeRingsGrid({
  isMobile,
  ringObjects,
  containerHeight,
  containerWidth,
  overallContent,
  explanations,
  openExplanationModal,
}: Props) {
  const ringSize = useMemo(() => {
    const size = calculateCircleRadius(containerWidth, containerHeight, ringObjects.length);
    return isMobile ? size : size * 0.8;
  }, [containerWidth > 0, containerHeight > 0, ringObjects.length, isMobile]);

  return (
    <Stack className={classes.container}>
      <RingComponent data={overallContent} ringSize={ringSize} />
      <div className={classes.grid}>
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
    </Stack>
  );
}
