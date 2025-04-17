"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { Carousel } from "@mantine/carousel";
import { Skeleton, Stack, Text } from "@mantine/core";
import { TaskExampleType } from "@/types/global";
import VideoPlayer from "../VideoPlayer";
import classes from "./ExampleContainer.module.css";

type Props = {
  title?: string;
  examples: TaskExampleType[];
  customStyles?: { [key: string]: any };
  customClass?: string;
};

export default function ExampleContainer({ title, examples, customClass, customStyles }: Props) {
  const [isReady, setIsReady] = useState(false);

  const slides = useMemo(() => {
    return examples.map((example, i) => {
      const isYoutube =
        example.type === "video" &&
        (example.url.startsWith("https://youtu") || example.url.startsWith("https://www.youtu"));

      return (
        <Carousel.Slide key={i}>
          {example.type === "video" ? (
            <>
              {isYoutube ? (
                <iframe
                  width="560"
                  height="315"
                  src={example.url}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  className={classes.iframe}
                  onLoad={() => setIsReady(true)}
                ></iframe>
              ) : (
                <VideoPlayer url={example.url} onLoad={() => setIsReady(true)} />
              )}
            </>
          ) : (
            <Image
              className={classes.exampleImage}
              src={example.url}
              width={100}
              height={100}
              alt=""
              unoptimized
              onLoad={() => setIsReady(true)}
            />
          )}
        </Carousel.Slide>
      );
    });
  }, [examples]);

  return (
    <Stack
      className={customClass ? `${classes.container} ${classes[customClass]}` : classes.container}
      style={customStyles || {}}
    >
      {title && (
        <Text c="dimmed" className={classes.title}>
          {title}
        </Text>
      )}

      <Skeleton visible={!isReady} className={classes.exampleContainer} style={{ borderRadius: 0 }}>
        <Carousel
          align="start"
          slideGap={16}
          slidesToScroll={1}
          classNames={{
            root: classes.carouselRoot,
            controls: classes.carouselControls,
            control: `carouselControl`,
            viewport: classes.carouselViewport,
            container: classes.carouselContainer,
          }}
        >
          {slides}
        </Carousel>
      </Skeleton>
    </Stack>
  );
}
