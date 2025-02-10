import React, { useCallback, useContext, useMemo } from "react";
import { Carousel } from "@mantine/carousel";
import { Stack } from "@mantine/core";
import ConcernsCard from "@/components/AnalysisCarousel//ConcernsCard";
import AnalysisCard from "@/components/AnalysisCarousel/AnalysisCard";
import { UserContext } from "@/context/UserContext";
import { StyleAnalysisType } from "@/types/global";
import classes from "./AnalysisCarousel.module.css";

type Props = {
  styleAnalyses?: StyleAnalysisType[];
};

export default function AnalysisCarousel({}: Props) {
  const { status, userDetails } = useContext(UserContext);
  const { _id: userId, concerns, potential, latestProgress } = userDetails || {};

  const getSlides = useCallback(() => {
    const analysisPotentialCard = (
      <Carousel.Slide key={"analysisCard"}>
        {potential && latestProgress && (
          <AnalysisCard title="Current condition" currentRecord={latestProgress} potentialRecord={potential} />
        )}
      </Carousel.Slide>
    );

    const concernsCard = (
      <Carousel.Slide key={"concernsCard"}>
        {concerns && (
          <ConcernsCard
            concerns={concerns}
            title="Areas of improvement"
            userId={userId || null}
            status={status}
          />
        )}
      </Carousel.Slide>
    );

    const slides = [analysisPotentialCard, concernsCard];

    return slides;
  }, [concerns, userId, status]);

  const slides = useMemo(() => getSlides(), []);

  return (
    <Stack className={classes.container}>
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
    </Stack>
  );
}
