import React, { useMemo } from "react";
import { IconCheck } from "@tabler/icons-react";
import { ActionIcon, Group, rem, RingProgress, Skeleton, Stack, Text } from "@mantine/core";
import Timer from "@/components/Timer";
import { convertUTCToLocal } from "@/helpers/convertUTCToLocal";
import { formatDate } from "@/helpers/formatDate";
import useShowSkeleton from "@/helpers/useShowSkeleton";
import { daysFrom } from "@/helpers/utils";
import { TaskStatusEnum } from "@/types/global";
import IconWithColor from "../CreateTaskOverlay/IconWithColor";
import classes from "./TaskRow.module.css";

type Props = {
  color: string;
  name: string;
  icon?: string;
  startsAt: string;
  expiresAt: string;
  description: string;
  status: TaskStatusEnum;
  customStyles?: { [key: string]: any };
  onClick?: () => void;
};

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export default function TaskRow({
  color,
  name,
  icon,
  startsAt,
  expiresAt,
  description,
  customStyles,
  status,
  onClick,
}: Props) {
  const showSkeleton = useShowSkeleton();

  const ringLabel = useMemo(
    () =>
      status === TaskStatusEnum.COMPLETED ? (
        <ActionIcon c="green.7" variant="transparent" radius="xl">
          <IconCheck stroke={3} className="icon icon__large" />
        </ActionIcon>
      ) : (
        <Text fw={600} ta="center" size="sm">
          0%
        </Text>
      ),
    [status]
  );

  const sections = useMemo(() => {
    const sections = [];
    if (status === TaskStatusEnum.COMPLETED) {
      sections.push({ value: 100, color: "green.7" });
    } else {
      sections.push({
        value: 0,
        color: "gray.3",
      });
    }
    return sections;
  }, [status]);

  const localStartDate = useMemo(
    () =>
      convertUTCToLocal({
        utcDate: new Date(startsAt),
        timeZone,
      }),
    [startsAt]
  );

  const localExpiryDate = useMemo(
    () =>
      convertUTCToLocal({
        utcDate: new Date(expiresAt),
        timeZone,
      }),
    [expiresAt]
  );

  const started = localStartDate < new Date();

  const moreThanOneDay = useMemo(
    () => new Date(localStartDate).getTime() > daysFrom({ days: 1 }).getTime(),
    [localStartDate]
  );

  const timerDate = started ? new Date(localExpiryDate) : new Date(localStartDate);

  const timerText =
    status === TaskStatusEnum.COMPLETED ? "Archived in" : started ? "Expires in" : "Starts in";

  const startsOnDate = useMemo(() => formatDate({ date: startsAt, hideYear: true }), [startsAt]);

  const timer = useMemo(
    () =>
      moreThanOneDay ? (
        <Text fz={12} c={"green.7"}>
          Starts on {startsOnDate}
        </Text>
      ) : (
        <>
          <Timer
            date={timerDate}
            children={<Text size="xs">{timerText}</Text>}
            showDays={false}
            customStyles={
              status === TaskStatusEnum.COMPLETED
                ? {
                    fontSize: "Var(--mantine-font-size-xs)",
                    color: "var(--mantine-color-green-7)",
                  }
                : started
                  ? {
                      fontSize: "Var(--mantine-font-size-xs)",
                      color: "var(--mantine-color-red-7)",
                    }
                  : {
                      fontSize: "Var(--mantine-font-size-xs)",
                      color: "var(--mantine-color-green-7)",
                    }
            }
          />
        </>
      ),
    [startsOnDate, timerDate, status, timerText]
  );

  return (
    <Skeleton visible={showSkeleton} mih={70}>
      <Group
        className={classes.container}
        onClick={onClick ? onClick : undefined}
        style={customStyles ? customStyles : {}}
      >
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
          {timer}
        </Stack>
        <RingProgress
          size={70}
          thickness={8}
          label={ringLabel}
          className={classes.ringProgress}
          styles={{ label: { display: "flex", justifyContent: "center" } }}
          sections={sections}
        />
      </Group>
    </Skeleton>
  );
}
