"use client";

import React, { memo, useMemo, useState } from "react";
import Image from "next/image";
import { Carousel } from "@mantine/carousel";
import { Button, Skeleton, Stack, Text } from "@mantine/core";
import { TaskExampleType } from "@/types/global";
import VideoPlayer from "../VideoPlayer";
import classes from "./ExampleContainer.module.css";

type Props = {
  title?: string;
  timeExpired: boolean;
  examples?: TaskExampleType[] | null;
  findExamples: (
    isLoading: boolean,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => void;
  customStyles?: { [key: string]: any };
  customClass?: string;
};

function ExampleContainer({
  title,
  examples,
  timeExpired,
  findExamples,
  customClass,
  customStyles,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const slides = useMemo(() => {
    if (!examples) return;

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

  const disableButton = isLoading || !examples || examples.length > 0 || timeExpired;

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
      {examples ? (
        <>
          {examples.length > 0 ? (
            <Skeleton
              visible={!isReady}
              className={classes.exampleContainer}
              style={{ borderRadius: 0 }}
            >
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
          ) : (
            <Stack className={classes.box}>
              <Button
                loading={isLoading}
                disabled={disableButton}
                onClick={() => findExamples(isLoading, setIsLoading)}
              >
                Show an example
              </Button>
            </Stack>
          )}
        </>
      ) : (
        <Stack className={classes.box}>
          <Text className={classes.notFoundText}>Example not found</Text>
        </Stack>
      )}
    </Stack>
  );
}

export default memo(ExampleContainer);
