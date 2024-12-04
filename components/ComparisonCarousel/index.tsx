import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Carousel } from "@mantine/carousel";
import { Skeleton, Stack, Title, UnstyledButton } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { formatDate } from "@/helpers/formatDate";
import openResultModal from "@/helpers/openResultModal";
import { ProgressType } from "@/types/global";
import AvatarComponent from "../AvatarComponent";
import CardMetaPanel from "../CardMetaPanel";
import ImageCard from "../ImageCard";
import { ComparisonSlideImageType } from "./types";
import classes from "./ComparisonCarousel.module.css";

type Props = {
  data: ProgressType;
};

export default function ComparisonCarousel({ data }: Props) {
  const {
    clubName,
    part,
    images,
    initialImages,
    initialDate,
    createdAt,
    avatar,
    scoresDifference,
  } = data;

  const [showSkeleton, setShowSkeleton] = useState(true);
  const [comparisonObjects, setComparisonObjects] = useState<ComparisonSlideImageType[]>([]);

  const formattedDate = useMemo(() => formatDate({ date: createdAt }), []);

  const slides = useMemo(
    () =>
      comparisonObjects.map((obj, index) => (
        <Carousel.Slide key={index}>
          <ImageCard image={obj.image} date={formattedDate} datePosition="top-left" showDate />
        </Carousel.Slide>
      )),
    [comparisonObjects]
  );

  const handleClickCarousel = useCallback(() => {
    openResultModal({
      record: data,
      type: "progress",
      showTrackButton: true,
      title: (
        <UnstyledButton
          className={classes.modalHead}
          component={Link}
          href={`/club/routine?followingUserId=${data.userId}`}
          onClick={() => modals.closeAll()}
        >
          <AvatarComponent avatar={avatar} size="xs" />
          <Title order={5} ml="0" lineClamp={1}>
            {clubName} - {upperFirst(part)} - {formattedDate}
          </Title>
        </UnstyledButton>
      ),
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
        date: formatDate({ date: createdAt }),
      },
    ]);

    setComparisonObjects(objects || []);
  }, [createdAt]);

  useEffect(() => {
    const tId = setTimeout(() => {
      setShowSkeleton(false);
      clearTimeout(tId);
    }, Number(process.env.NEXT_PUBLIC_SKELETON_DURATION));
  }, []);

  return (
    <Stack className={classes.container}>
      <Skeleton className="skeleton" visible={showSkeleton}>
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
      </Skeleton>

      <CardMetaPanel
        name={clubName || ""}
        avatar={avatar}
        userId={data.userId}
        faceProgress={scoresDifference?.head?.overall || 0}
        bodyProgress={scoresDifference?.body?.overall || 0}
      />
    </Stack>
  );
}
