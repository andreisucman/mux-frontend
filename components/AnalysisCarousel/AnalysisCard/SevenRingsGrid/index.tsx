import React, { useMemo } from "react";
import { Stack } from "@mantine/core";
import { CircleObjectType } from "@/components/AnalysisCarousel/AnalysisCard";
import RingComponent from "@/components/RingComponent";
import { calculateCircleRadius } from "@/helpers/utils";
import classes from "./SevenRingsGrid.module.css";

type Props = {
  overallContent: CircleObjectType;
  ringObjects: CircleObjectType[];
  containerWidth: number;
  containerHeight: number;
  isMobile: boolean;
  explanations?: { [key: string]: string };
  openExplanationModal?: (object: { values: CircleObjectType; explanation: string }) => void;
};

export default function SevenRingsGrid({
  overallContent,
  ringObjects,
  containerHeight,
  containerWidth,
  isMobile,
  explanations,
  openExplanationModal,
}: Props) {
  const ringSize = useMemo(() => {
    const size = calculateCircleRadius(containerWidth, containerHeight, ringObjects.length);
    return size;
  }, [containerWidth, containerHeight, ringObjects.length, isMobile]);

  return (
    <Stack className={classes.container}>
      <RingComponent
        data={overallContent}
        ringSize={ringSize}
        isPotential={!!openExplanationModal}
      />
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
