import React, { useMemo } from "react";
import { Carousel } from "@mantine/carousel";
import { Stack } from "@mantine/core";
import { SimpleProgressType } from "@/app/results/types";
import { formatDate } from "@/helpers/formatDate";
import SliderComparisonCard from "./SliderComparisonCard";
import classes from "./SliderComparisonCarousel.module.css";

type Props = {
  progressRecord: SimpleProgressType;
};

export default function SliderComparisonCarousel({ progressRecord }: Props) {
  const { images, initialImages, createdAt, initialDate } = progressRecord;

  const firstDate = useMemo(() => formatDate({ date: initialDate }), []);
  const lastDate = useMemo(() => formatDate({ date: createdAt }), []);

  const slides = useMemo(
    () =>
      images.map((obj, index) => (
        <Carousel.Slide key={index}>
          <SliderComparisonCard
            srcOne={initialImages[index].mainUrl.url || ""}
            srcTwo={obj.mainUrl.url || ""}
          />
        </Carousel.Slide>
      )),
    [images.length]
  );

  return (
    <Stack className={classes.container}>
      <span className={classes.lastDate}>{lastDate}</span>
      <span className={classes.firstDate}>{firstDate}</span>
      <Carousel
        align="center"
        orientation="vertical"
        className={classes.carousel}
        styles={{ slide: { height: "100%" } }}
        height={"50vh"}
        classNames={{ control: classes.control, controls: classes.controls }}
      >
        {slides}
      </Carousel>
    </Stack>
  );
}
