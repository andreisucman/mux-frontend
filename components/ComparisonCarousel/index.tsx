import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Carousel } from "@mantine/carousel";
import { Skeleton, Stack, Title } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import { BeforeAfterType } from "@/app/types";
import Link from "@/helpers/custom-router/patch-router/link";
import { formatDate } from "@/helpers/formatDate";
import { getPartIcon, partIcons } from "@/helpers/icons";
import openResultModal, { getRedirectModalTitle } from "@/helpers/openResultModal";
import useShowSkeleton from "@/helpers/useShowSkeleton";
import CardMetaPanel from "../CardMetaPanel";
import ImageCard from "../ImageCard";
import classes from "./ComparisonCarousel.module.css";

type Props = {
  data: BeforeAfterType;
};

export default function ComparisonCarousel({ data }: Props) {
  const { userName, routineName, part, images, initialImages, initialDate, updatedAt, avatar } =
    data;
  const [slides, setSlides] = useState<React.ReactNode[]>();

  const formattedDate = useMemo(() => formatDate({ date: updatedAt || null }), []);

  const redirectUrl = `/club/routines/${userName}?part=${part}`;

  const handleClickCarousel = useCallback(() => {
    const title = (
      <Title order={5} lineClamp={1}>
        {upperFirst(routineName || part)}
      </Title>
    );

    const modalTitle = getRedirectModalTitle({
      avatar,
      redirectUrl,
      title,
    });

    openResultModal({
      record: data,
      isPublicPage: true,
      title: modalTitle,
      type: "progress",
    });
  }, [userName, part, routineName, redirectUrl, formattedDate]);

  useEffect(() => {
    const objects = images?.flatMap((obj, i) => [
      {
        image: obj.mainUrl.url || "",
        date: formatDate({ date: initialDate }),
      },
      {
        image: initialImages?.[i].mainUrl.url || "",
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
        <Title order={5} className={classes.title} lineClamp={1}>
          <Link className={classes.titleLink} href={redirectUrl}>
            {partIcons[part]} {upperFirst(routineName || part)}
          </Link>
        </Title>
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

        <CardMetaPanel
          redirectUrl={redirectUrl}
          name={userName || ""}
          avatar={avatar}
          formattedDate={formattedDate}
        />
      </Stack>
    </Skeleton>
  );
}
