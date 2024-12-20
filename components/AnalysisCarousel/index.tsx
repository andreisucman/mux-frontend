import React, { useCallback, useContext, useMemo } from "react";
import { Carousel } from "@mantine/carousel";
import { Stack } from "@mantine/core";
import ConcernsCard from "@/components/AnalysisCarousel//ConcernsCard";
import AnalysisCard from "@/components/AnalysisCarousel/AnalysisCard";
import AnalysisCardPotential from "@/components/AnalysisCarousel/AnalysisCardPotential";
import BetterThanCard from "@/components/AnalysisCarousel/BetterThanCard";
import BetterThanCardPotential from "@/components/AnalysisCarousel/BetterThanCardPotential";
import { UserContext } from "@/context/UserContext";
import { StyleAnalysisType, TypeEnum } from "@/types/global";
import classes from "./AnalysisCarousel.module.css";

type Props = {
  type: TypeEnum;
  styleAnalyses?: StyleAnalysisType[];
};

export default function AnalysisCarousel({ type }: Props) {
  const { status, userDetails } = useContext(UserContext);
  const {
    _id: userId,
    demographics,
    concerns,
    potential,
    latestProgress,
    latestStyleAnalysis,
    currentlyHigherThan,
    potentiallyHigherThan,
  } = userDetails || {};

  const { ageInterval } = demographics || {};

  const progressRecord = latestProgress?.[type as "head"];
  const potentialRecord = potential?.[type as "head"];
  const styleAnalysis = latestStyleAnalysis?.[type as "head"];

  const getSlides = useCallback(() => {
    const analysisCard = (
      <Carousel.Slide key={"analysisCard"}>
        {progressRecord && (
          <AnalysisCard record={progressRecord} title={`Current ${type} analysis`} />
        )}
      </Carousel.Slide>
    );

    const analysisPotentialCard = (
      <Carousel.Slide key={"analysisCardPotential"}>
        {potentialRecord && progressRecord && (
          <AnalysisCardPotential
            currentRecord={progressRecord}
            potentialRecord={potentialRecord}
            title={`Potential ${type}`}
          />
        )}
      </Carousel.Slide>
    );

    const typeCurrentlyHigherThan = currentlyHigherThan && currentlyHigherThan[type as "head"];

    const currentBetterCard = (
      <Carousel.Slide key={"currentBetterThanCard"}>
        {progressRecord && typeCurrentlyHigherThan && (
          <BetterThanCard
            userId={userId || null}
            ageInterval={ageInterval}
            progressRecord={progressRecord}
            currentlyHigherThan={typeCurrentlyHigherThan}
            type={type as TypeEnum}
            title={`Current ${type} statistics`}
          />
        )}
      </Carousel.Slide>
    );

    const typePotentiallyHigherThan =
      potentiallyHigherThan && potentiallyHigherThan[type as "head"];

    const potentialBetterCard = (
      <Carousel.Slide key={"potentialBetterCard"}>
        {potentialRecord && typePotentiallyHigherThan && (
          <BetterThanCardPotential
            userId={userId || null}
            ageInterval={ageInterval}
            potentialRecord={potentialRecord}
            potentiallyHigherThan={typePotentiallyHigherThan}
            type={type as TypeEnum}
            authStatus={status}
            title={`Potential ${type} statistics`}
          />
        )}
      </Carousel.Slide>
    );

    const concernsCard = (
      <Carousel.Slide key={"concernsCard"}>
        {concerns && (
          <ConcernsCard
            concerns={concerns}
            title="Areas of improvement"
            type={type as TypeEnum}
            userId={userId || null}
            status={status}
          />
        )}
      </Carousel.Slide>
    );

    const slides = [
      analysisCard,
      analysisPotentialCard,
      currentBetterCard,
      potentialBetterCard,
      concernsCard,
    ];

    return slides;
  }, [
    progressRecord,
    potentialRecord,
    currentlyHigherThan,
    potentiallyHigherThan,
    concerns,
    userId,
    status,
    type,
  ]);

  const slides = useMemo(() => getSlides(), [progressRecord, styleAnalysis]);

  return (
    <Stack className={classes.container}>
      {progressRecord && (
        <Carousel
          align="start"
          slideGap={16}
          slidesToScroll={1}
          classNames={{
            root: classes.root,
            controls: classes.controls,
            control: "carouselControl",
            viewport: classes.viewport,
            container: classes.container,
          }}
        >
          {slides}
        </Carousel>
      )}
    </Stack>
  );
}
