"use client";

import React, { useMemo } from "react";
import { IconCheck, IconClock, IconCancel } from "@tabler/icons-react";
import { ActionIcon, Group, rem, Skeleton, Stack, Text } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import { InactiveTaskType } from "@/app/tasks/history/type";
import { convertUTCToLocal } from "@/helpers/convertUTCToLocal";
import { formatDate } from "@/helpers/formatDate";
import useShowSkeleton from "@/helpers/useShowSkeleton";
import { TaskStatusEnum } from "@/types/global";
import IconWithColor from "../CreateTaskOverlay/IconWithColor";
import classes from "./TaskRow.module.css";

interface Props extends InactiveTaskType {
  onClick?: () => void;
}

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export default function InactiveTaskRow({
  color,
  name,
  icon,
  completedAt,
  description,
  expiresAt,
  status,
  onClick,
}: Props) {
  const text = useMemo(() => {
    const date = convertUTCToLocal({
      utcDate: new Date(completedAt || expiresAt),
      timeZone,
    });

    return `${upperFirst(status)} at ${formatDate({ date })}`;
  }, [completedAt]);

  const taskColor = useMemo(() => (status === TaskStatusEnum.COMPLETED ? "green.7" : "red.7"), []);

  const finalIcon = useMemo(() => {
    return (
      <ActionIcon c={taskColor} variant="transparent" radius="xl">
        {status === TaskStatusEnum.COMPLETED ? (
          <IconCheck stroke={3} className="icon icon__large" />
        ) : status === TaskStatusEnum.EXPIRED ? (
          <IconClock stroke={3} className="icon icon__large" />
        ) : (
          <IconCancel stroke={3} className="icon icon__large" />
        )}
      </ActionIcon>
    );
  }, [completedAt, taskColor, status]);

  const showSkeleton = useShowSkeleton();

  return (
    <Skeleton className="skeleton" visible={showSkeleton} mih={70}>
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
          <Text className={classes.description} c="dimmed" size="sm" mb={2} lineClamp={1}>
            {description}
          </Text>
          <Text size="xs" c={taskColor}>
            {text}
          </Text>
        </Stack>

        <Stack miw={50}>{finalIcon}</Stack>
      </Group>
    </Skeleton>
  );
}
