import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Carousel } from "@mantine/carousel";
import { Group, Skeleton, Stack, Title } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import { SimpleBeforeAfterType } from "@/app/types";
import { partIconMap } from "@/context/CreateRoutineContext/SelectPartForRoutineModalContent/partIconMap";
import { formatDate } from "@/helpers/formatDate";
import openResultModal, { getRedirectModalTitle } from "@/helpers/openResultModal";
import CardMetaPanel from "../CardMetaPanel";
import ImageCard from "../ImageCard";
import classes from "./ComparisonCarousel.module.css";

type Props = {
  data: SimpleBeforeAfterType;
};

export default function ComparisonCarousel({ data }: Props) {
  const {
    clubName,
    part,
    images,
    initialImages,
    initialDate,
    updatedAt,
    avatar,
    latestHeadScoreDifference,
    latestBodyScoreDifference,
  } = data;

  const [slides, setSlides] = useState<React.ReactNode[]>();
  const [showSkeleton, setShowSkeleton] = useState(true);

  const formattedDate = useMemo(() => formatDate({ date: updatedAt || null }), []);
  const title = useMemo(() => `${upperFirst(part)}`, [part]);

  const handleClickCarousel = useCallback(() => {
    const modalTitle = getRedirectModalTitle({
      avatar,
      redirectUrl: `/club/routine?followingUserId=${data.userId}`,
      title: `${clubName} - ${upperFirst(part)} - ${formattedDate}`,
    });

    openResultModal({
      record: data,
      type: "progress",
      showTrackButton: true,
      title: modalTitle,
    });
  }, [clubName, part, formattedDate]);

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
      <Carousel.Slide key={index}>
        <ImageCard image={object.image} datePosition="top-left" showDate isStatic />
      </Carousel.Slide>
    ));

    setSlides(newSlides);
    setShowSkeleton(false);
  }, [updatedAt, images && images.length]);

  return (
    <Skeleton className={"skeleton"} visible={showSkeleton || !slides}>
      <Stack className={classes.container}>
        <Group className={classes.title}>
          {partIconMap[part]}
          <Title order={5}>{title}</Title>
        </Group>

        <Carousel
          slideSize={{ base: "50%" }}
          align="start"
          withControls={false}
          slidesToScroll={2}
          withIndicators={slides && slides.length > 2}
          className={classes.carousel}
          onClick={handleClickCarousel}
          classNames={{
            viewport: classes.carouselViewport,
            root: classes.carouselRoot,
          }}
        >
          {slides}
        </Carousel>

        <CardMetaPanel
          name={clubName || ""}
          avatar={avatar}
          userId={data.userId}
          formattedDate={formattedDate}
          headProgress={latestHeadScoreDifference}
          bodyProgress={latestBodyScoreDifference}
        />
      </Stack>
    </Skeleton>
  );
}
