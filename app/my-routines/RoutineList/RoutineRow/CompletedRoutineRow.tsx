"use client";

import React, { useEffect, useMemo, useState } from "react";
import { IconCheck } from "@tabler/icons-react";
import { ActionIcon, Group, rem, RingProgress, Skeleton, Stack, Text } from "@mantine/core";
import { CompletedTaskType } from "@/app/history/type";
import { convertUTCToLocal } from "@/helpers/convertUTCToLocal";
import { formatDate } from "@/helpers/formatDate";
import IconWithColor from "../CreateTaskOverlay/IconWithColor";
import classes from "./RoutineRow.module.css";

interface Props extends CompletedTaskType {
  onClick?: () => void;
}

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export default function CompletedRoutineRow({
  color,
  name,
  icon,
  completedAt,
  description,
  onClick,
}: Props) {
  const [showSkeleton, setShowSkeleton] = useState(true);

  const completionDate = useMemo(() => {
    const date = convertUTCToLocal({
      utcDate: new Date(completedAt),
      timeZone,
    });

    return formatDate({ date });
  }, [completedAt]);

  useEffect(() => {
    const tId = setTimeout(() => {
      setShowSkeleton(false);
      clearTimeout(tId);
    }, Number(process.env.NEXT_PUBLIC_SKELETON_DURATION));
  }, []);

  return (
    <Skeleton className="skeleton" visible={showSkeleton}>
      <Group className={classes.container} onClick={onClick ? onClick : undefined}>
        <IconWithColor
          icon={icon || ""}
          color={color}
          customStyles={{
            fontSize: rem(22),
            minWidth: rem(50),
            minHeight: rem(115),
          }}
        />
        <Stack className={classes.wrapper}>
          <Text className={classes.title} lineClamp={1}>
            {name}
          </Text>
          <Text className={classes.description} c="dimmed" size="sm" lineClamp={2}>
            {description}
          </Text>
          <Text size="xs" c="green.7">
            Completed on {completionDate}
          </Text>
        </Stack>

        <Stack>
          <RingProgress
            size={85}
            thickness={9}
            label={
              <ActionIcon c="green.7" variant="transparent" radius="xl">
                <IconCheck stroke={3} className="icon icon__large" />
              </ActionIcon>
            }
            className={classes.ringProgress}
            classNames={{ label: classes.label }}
            sections={[{ value: 100, color: "green.7" }]}
          />
        </Stack>
      </Group>
    </Skeleton>
  );
}
