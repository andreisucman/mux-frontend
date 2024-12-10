import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "@/helpers/custom-router/patch-router/link";
import { Carousel } from "@mantine/carousel";
import { Skeleton, Stack, Title, UnstyledButton } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { SimpleBeforeAfterType } from "@/app/types";
import { formatDate } from "@/helpers/formatDate";
import openResultModal from "@/helpers/openResultModal";
import AvatarComponent from "../AvatarComponent";
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
    latestScoresDifference,
  } = data;

  const [showSkeleton, setShowSkeleton] = useState(true);
  const [comparisonObjects, setComparisonObjects] = useState<ComparisonSlideImageType[]>([]);

  const formattedDate = useMemo(() => formatDate({ date: updatedAt }), []);

  const slides = useMemo(
    () =>
      comparisonObjects.map((obj, index) => (
        <Carousel.Slide key={index}>
          <ImageCard
            image={obj.image}
            date={formattedDate}
            datePosition="top-left"
            showDate
            isStatic
          />
        </Carousel.Slide>
      )),
    [comparisonObjects.length]
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
          <Title order={5} ml="0" lineClamp={2}>
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
        date: formatDate({ date: updatedAt }),
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
          faceProgress={latestScoresDifference?.head?.overall || 0}
          bodyProgress={latestScoresDifference?.body?.overall || 0}
        />
      </Stack>
    </Skeleton>
  );
}
