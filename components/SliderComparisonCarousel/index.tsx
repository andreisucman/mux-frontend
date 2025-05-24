import React, { useMemo } from "react";
import { Carousel } from "@mantine/carousel";
import { Group, Stack } from "@mantine/core";
import { formatDate } from "@/helpers/formatDate";
import ContentPublicityIndicator from "../ContentPublicityIndicator";
import SliderComparisonCard from "./SliderComparisonCard";
import classes from "./SliderComparisonCarousel.module.css";

type Props = {
  currentImages: string[];
  compareImages: string[];
  currentDate: string;
  compareDate: string;
  isPublicPage: boolean;
  isPublic: boolean;
  isSelf: boolean;
};

export default function SliderComparisonCarousel({
  currentImages,
  compareImages,
  currentDate,
  compareDate,
  isPublicPage,
  isPublic,
  isSelf,
}: Props) {
  const firstDate = useMemo(() => formatDate({ date: currentDate }), [currentDate]);
  const lastDate = useMemo(() => formatDate({ date: compareDate }), [compareDate]);

  const slides = useMemo(
    () =>
      currentImages.map((url, index) => (
        <Carousel.Slide key={index}>
          <SliderComparisonCard srcOne={compareImages[index]} srcTwo={url} />
        </Carousel.Slide>
      )),
    [currentImages.length]
  );

  return (
    <Stack className={classes.container}>
      <Group className={classes.dates}>
        <span>{lastDate}</span>
        <span>{firstDate}</span>
      </Group>

      <Carousel
        align="center"
        height="60vh"
        orientation="vertical"
        className={classes.carousel}
        classNames={{
          control: `carouselControl ${classes.control}`,
          controls: classes.controls,
          slide: classes.slide,
        }}
      >
        {slides}
      </Carousel>
      {!isPublicPage && isSelf && (
        <ContentPublicityIndicator isPublic={isPublic} position="top-left" showText />
      )}
    </Stack>
  );
}
