import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { IconSeparatorVertical } from "@tabler/icons-react";
import { Carousel } from "@mantine/carousel";
import { ActionIcon, Button, Skeleton, Stack, Title } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import { BeforeAfterType } from "@/app/types";
import { formatDate } from "@/helpers/formatDate";
import { getPartIcon } from "@/helpers/icons";
import openResultModal, { getRedirectModalTitle } from "@/helpers/openResultModal";
import useShowSkeleton from "@/helpers/useShowSkeleton";
import { normalizeString } from "@/helpers/utils";
import CardMetaPanel from "../CardMetaPanel";
import ImageCard from "../ImageCard";
import classes from "./ComparisonCarousel.module.css";

type Props = {
  data: BeforeAfterType;
};

export default function ComparisonCarousel({ data }: Props) {
  const { userName, part, concern, images, initialImages, initialDate, updatedAt, avatar } = data;
  const [slides, setSlides] = useState<React.ReactNode[]>();

  const formattedDate = useMemo(() => formatDate({ date: updatedAt || null }), []);

  const redirectUrl = `/club/routines/${userName}?part=${part}&concern=${concern}`;
  const name = `${normalizeString(part)} - ${normalizeString(concern)}`;

  const handleClickCarousel = useCallback(() => {
    const titleText = `${userName} - ${part} - ${concern}`;
    const title = (
      <Title order={5} lineClamp={1}>
        {titleText}
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
      type: "ba",
    });
  }, [userName, part, redirectUrl, formattedDate]);

  useEffect(() => {
    const objects = images?.flatMap((obj, i) => [
      {
        image: initialImages?.[i].mainUrl.url || "",
        date: formatDate({ date: updatedAt || null }),
      },
      {
        image: obj.mainUrl.url || "",
        date: formatDate({ date: initialDate }),
      },
    ]);

    const newSlides = objects.map((object, index) => (
      <Carousel.Slide key={index} onClick={handleClickCarousel} className={classes.slide}>
        <ImageCard
          image={object.image}
          datePosition="top-left"
          position={index % 2 === 0 ? "right" : "left"}
          showDate
          isRelative
          limitMaxHeight
        />
      </Carousel.Slide>
    ));

    setSlides(newSlides);
  }, [updatedAt, images && images.length]);

  const showSkeleton = useShowSkeleton();
  const icon = getPartIcon(part, 24);

  return (
    <Skeleton className={"skeleton shadow"} visible={showSkeleton || !slides}>
      <Stack className={classes.container}>
        <Title order={5} className={classes.title} lineClamp={1}>
          <Link className={classes.titleLink} href={redirectUrl}>
            {icon} {name}
          </Link>
        </Title>
        <Carousel
          slideSize={{ base: "50%" }}
          align="start"
          slidesToScroll={2}
          withIndicators={slides && slides.length > 2}
          classNames={{
            viewport: classes.carouselViewport,
            root: classes.carouselRoot,
            control: "carouselControl",
          }}
          withControls
        >
          {slides}
        </Carousel>
        <ActionIcon
          onClick={handleClickCarousel}
          size="lg"
          className={classes.viewButton}
          variant="light"
        >
          <IconSeparatorVertical size={24} />
        </ActionIcon>
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
