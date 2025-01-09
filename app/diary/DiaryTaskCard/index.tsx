"use client";

import React, { useMemo } from "react";
import NextImage from "next/image";
import { Group, Image, Skeleton, Stack, Text } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import VideoPlayer from "@/components/VideoPlayer";
import useShowSkeleton from "@/helpers/useShowSkeleton";
import { DiaryActivityType } from "../type";
import classes from "./DiaryTaskCard.module.css";

export default function DiaryTaskCard({ name, contentType, url, thumbnail, icon }: DiaryActivityType) {
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
    <Skeleton className="skeleton" visible={showSkeleton}>
      <Stack className={classes.container}>
        <Group className={classes.head}>
          {icon}
          <Text className={classes.title} lineClamp={1}>
            {upperFirst(name || "")}
          </Text>
        </Group>
        {body}
      </Stack>
    </Skeleton>
  );
}
