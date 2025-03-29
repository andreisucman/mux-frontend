"use client";

import React, { useMemo } from "react";
import NextImage from "next/image";
import { Group, Image, Skeleton, Stack, Text, Title } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import VideoPlayer from "@/components/VideoPlayer";
import useShowSkeleton from "@/helpers/useShowSkeleton";
import { DiaryActivityType } from "../../app/diary/type";
import classes from "./DiaryTaskCard.module.css";

export default function DiaryTaskCard({
  name,
  url,
  icon,
  contentType,
  thumbnail,
}: DiaryActivityType) {
  const showSkeleton = useShowSkeleton();

  const body = useMemo(() => {
    if (contentType === "image") {
      return (
        <Stack className={classes.imageWrapper}>
          <Image
            m="auto"
            src={url}
            className={classes.image}
            component={NextImage}
            alt=""
            width={200}
            height={200}
          />
        </Stack>
      );
    }
    if (contentType === "video") {
      return (
        <VideoPlayer
          url={url}
          thumbnail={thumbnail}
          createdAt={new Date().toISOString()}
          isRelative
        />
      );
    }
  }, [url]);

  return (
    <Skeleton className={"skeleton"} visible={showSkeleton}>
      <Stack className={classes.container}>
        <Group className={classes.head}>
          <Text className={classes.icon}>{icon}</Text>
          <Title order={5} lineClamp={1}>
            {upperFirst(name || "")}
          </Title>
        </Group>
        {body}
      </Stack>
    </Skeleton>
  );
}
