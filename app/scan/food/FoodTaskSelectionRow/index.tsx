"use client";

import React from "react";
import { Group, rem, RingProgress, Skeleton, Stack, Text, ThemeIcon } from "@mantine/core";
import IconWithColor from "@/app/tasks/TasksList/CreateTaskOverlay/IconWithColor";
import useShowSkeleton from "@/helpers/useShowSkeleton";
import { TaskType } from "@/types/global";
import classes from "./FoodTaskSelectionRow.module.css";

type Props = {
  task: TaskType;
  onClick: (task: TaskType) => void;
};

export default function FoodTaskSelectionRow({ task, onClick }: Props) {
  const { color, name, icon } = task;
  const showSkeleton = useShowSkeleton();

  return (
    <Skeleton className="skeleton" visible={showSkeleton}>
      <Group className={classes.container} onClick={() => onClick(task)}>
        <IconWithColor
          icon={icon || ""}
          color={color}
          customStyles={{
            fontSize: rem(22),
            minWidth: rem(50),
            minHeight: rem(60),
          }}
        />
        <Text className={classes.title} lineClamp={1}>
          {name}
        </Text>

        <Stack ml="auto">
          <RingProgress
            size={60}
            thickness={7}
            label={
              <ThemeIcon c="gray.3" variant="transparent" radius="xl">
                <Text fz="sm">0%</Text>
              </ThemeIcon>
            }
            className={classes.ringProgress}
            classNames={{ label: classes.label }}
            sections={[{ value: 100, color: "gray.3" }]}
          />
        </Stack>
      </Group>
    </Skeleton>
  );
}
