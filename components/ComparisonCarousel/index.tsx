import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Carousel } from "@mantine/carousel";
import { Group, Skeleton, Stack, Title } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import { SimpleBeforeAfterType } from "@/app/types";
import { formatDate } from "@/helpers/formatDate";
import { partIcons } from "@/helpers/icons";
import openResultModal, { getRedirectModalTitle } from "@/helpers/openResultModal";
import useShowSkeleton from "@/helpers/useShowSkeleton";
import CardMetaPanel from "../CardMetaPanel";
import ImageCard from "../ImageCard";
import classes from "./ComparisonCarousel.module.css";

type Props = {
  data: SimpleBeforeAfterType;
};

export default function ComparisonCarousel({ data }: Props) {
  const { userName, part, images, initialImages, initialDate, updatedAt, avatar } = data;
  const [slides, setSlides] = useState<React.ReactNode[]>();

  const formattedDate = useMemo(() => formatDate({ date: updatedAt || null }), []);
  const title = useMemo(() => `${upperFirst(part)}`, [part]);

  const handleClickCarousel = useCallback(() => {
    const modalTitle = getRedirectModalTitle({
      avatar,
      redirectUrl: `/club/routines/${userName}`,
      title: `${userName} - ${upperFirst(part)}`,
    });

    openResultModal({
      record: data,
      type: "progress",
      isPublicPage: true,
      title: modalTitle,
    });
  }, [userName, part, formattedDate]);

  useEffect(() => {
    const objects = images?.flatMap((obj, i) => [
      {
        image: initialImages?.[i].mainUrl.url || "",
        date: formatDate({ date: initialDate }),
      },
      {
        image: obj.mainUrl.url || "",
        date: formatDate({ date: updatedAt || null }),
      },
    ]);

    const newSlides = objects.map((object, index) => (
      <Carousel.Slide key={index} onClick={handleClickCarousel}>
        <ImageCard image={object.image} datePosition="top-left" showDate isRelative />
      </Carousel.Slide>
    ));

    setSlides(newSlides);
  }, [updatedAt, images && images.length]);

  const showSkeleton = useShowSkeleton();

  return (
    <Skeleton className={"skeleton"} visible={showSkeleton || !slides}>
      <Stack className={classes.container}>
        <Group className={classes.title}>
          {partIcons[part]}
          <Title order={5}>{title}</Title>
        </Group>

        <Carousel
          slideSize={{ base: "50%" }}
          align="start"
          slidesToScroll={2}
          withIndicators={slides && slides.length > 2}
          className={classes.carousel}
          classNames={{
            viewport: classes.carouselViewport,
            root: classes.carouselRoot,
            control: "carouselControl",
          }}
          withControls
        >
          {slides}
        </Carousel>

        <CardMetaPanel name={userName || ""} avatar={avatar} formattedDate={formattedDate} />
      </Stack>
    </Skeleton>
  );
}
