import React, { useCallback, useContext, useMemo } from "react";
import { Carousel } from "@mantine/carousel";
import { Stack } from "@mantine/core";
import ConcernsCard from "@/components/AnalysisCarousel//ConcernsCard";
import AnalysisCard from "@/components/AnalysisCarousel/AnalysisCard";
import { UserContext } from "@/context/UserContext";
import GetScoresAndFeedbackCard from "./GetScoresAndFeedbackCard";
import classes from "./AnalysisCarousel.module.css";

export default function AnalysisCarousel() {
  const { status, userDetails } = useContext(UserContext);
  const { _id: userId, concerns, latestScores, latestProgress } = userDetails || {};

  const getSlides = useCallback(() => {
    if (latestScores && !latestScores.overall)
      return (
        <Carousel.Slide key={"analysisCard"}>
          <GetScoresAndFeedbackCard title="Scan uploaded" />
        </Carousel.Slide>
      );

    const analysisCard = (
      <Carousel.Slide key={"analysisCard"}>
        {latestScores && latestProgress && (
          <AnalysisCard
            title="Current condition"
            currentRecord={latestProgress}
            latestScores={latestScores}
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
            userId={userId || null}
            latestScores={latestScores}
            status={status}
          />
        )}
      </Carousel.Slide>
    );

    const slides = [analysisCard, concernsCard];

    return slides;
  }, [latestScores, concerns, userId, status]);

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
          control: `carouselControl ${classes.carouselControl}`,
          viewport: classes.viewport,
          container: classes.container,
        }}
      >
        {slides}
      </Carousel>
    </Stack>
  );
}
