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
import { ComparisonSlideImageType } from "./types";
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

  const [showSkeleton, setShowSkeleton] = useState(true);
  const [comparisonObjects, setComparisonObjects] = useState<ComparisonSlideImageType[]>([]);

  const formattedDate = useMemo(() => formatDate({ date: updatedAt || null }), []);
  const title = useMemo(() => `${upperFirst(part)}`, [part]);

  const slides = useMemo(
    () =>
      comparisonObjects.map((obj, index) => (
        <Carousel.Slide key={index}>
          <ImageCard image={obj.image} datePosition="top-left" showDate isStatic />
        </Carousel.Slide>
      )),
    [comparisonObjects.length]
  );

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

    setComparisonObjects(objects || []);
  }, [updatedAt, images && images.length]);

  useEffect(() => {
    const tId = setTimeout(() => {
      setShowSkeleton(false);
      clearTimeout(tId);
    }, Number(process.env.NEXT_PUBLIC_SKELETON_DURATION));
  }, []);

  return (
    <Skeleton className={"skeleton"} visible={showSkeleton}>
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
          withIndicators={slides.length > 2}
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
