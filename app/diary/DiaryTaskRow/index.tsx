"use client";

import React, { useEffect, useState } from "react";
import { IconCheck } from "@tabler/icons-react";
import { ActionIcon, Group, rem, RingProgress, Skeleton, Stack, Text } from "@mantine/core";
import { CompletedTaskType } from "@/app/tasks/history/type";
import IconWithColor from "@/app/tasks/TasksList/CreateTaskOverlay/IconWithColor";
import classes from "./DiaryTaskRow.module.css";

export default function DiaryTaskRow({ color, name, icon }: CompletedTaskType) {
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    const tId = setTimeout(() => {
      setShowSkeleton(false);
      clearTimeout(tId);
    }, Number(process.env.NEXT_PUBLIC_SKELETON_DURATION));
  }, []);

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
            size={50}
            thickness={6}
            label={
              <ActionIcon c="green.7" variant="transparent" radius="xl">
                <IconCheck stroke={3} className="icon" />
              </ActionIcon>
            }
            classNames={{ label: classes.label }}
            sections={[{ value: 100, color: "green.7" }]}
          />
        </Stack>
      </Group>
    </Skeleton>
  );
}
