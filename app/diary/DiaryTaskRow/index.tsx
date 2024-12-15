"use client";

import React from "react";
import { IconCheck } from "@tabler/icons-react";
import { Group, rem, RingProgress, Skeleton, Stack, Text, ThemeIcon } from "@mantine/core";
import IconWithColor from "@/app/tasks/TasksList/CreateTaskOverlay/IconWithColor";
import useShowSkeleton from "@/helpers/useShowSkeleton";
import { DiaryTaskType } from "../type";
import classes from "./DiaryTaskRow.module.css";

export default function DiaryTaskRow({ color, name, icon }: DiaryTaskType) {
  const showSkeleton = useShowSkeleton();

  return (
    <Skeleton className="skeleton" visible={showSkeleton}>
      <Group className={classes.container}>
        <IconWithColor
          icon={icon || ""}
          color={color}
          customStyles={{
            fontSize: rem(22),
            minWidth: rem(40),
            minHeight: rem(60),
          }}
        />
        <Stack className={classes.wrapper}>
          <Text className={classes.title} lineClamp={1}>
            {name}
          </Text>
        </Stack>

        <Stack>
          <RingProgress
            size={45}
            thickness={6}
            label={
              <ThemeIcon c="green.7" variant="transparent" radius="xl">
                <IconCheck stroke={3} className="icon" />
              </ThemeIcon>
            }
            classNames={{ label: classes.label }}
            sections={[{ value: 100, color: "green.7" }]}
            mr={4}
          />
        </Stack>
      </Group>
    </Skeleton>
  );
}
