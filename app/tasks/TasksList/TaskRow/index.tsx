import React, { useMemo } from "react";
import { IconCheck } from "@tabler/icons-react";
import { ActionIcon, Group, rem, RingProgress, Skeleton, Stack, Text } from "@mantine/core";
import Timer from "@/components/Timer";
import { convertUTCToLocal } from "@/helpers/convertUTCToLocal";
import { formatDate } from "@/helpers/formatDate";
import useShowSkeleton from "@/helpers/useShowSkeleton";
import { daysFrom } from "@/helpers/utils";
import IconWithColor from "../CreateTaskOverlay/IconWithColor";
import classes from "./TaskRow.module.css";

type Props = {
  color: string;
  name: string;
  icon?: string;
  startsAt: string;
  expiresAt: string;
  description: string;
  isCompleted: boolean;
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
  isCompleted,
  onClick,
}: Props) {
  const showSkeleton = useShowSkeleton();

  const ringLabel = useMemo(
    () =>
      isCompleted ? (
        <ActionIcon c="green.7" variant="transparent" radius="xl">
          <IconCheck stroke={3} className="icon icon__large" />
        </ActionIcon>
      ) : (
        <Text fw={600} ta="center" size="sm">
          {isCompleted ? "100%" : "0%"}
        </Text>
      ),
    [isCompleted]
  );

  const sections = useMemo(() => {
    const sections = [];
    if (isCompleted) {
      sections.push({ value: 100, color: "green.7" });
    } else {
      sections.push({
        value: 0,
        color: "gray.3",
      });
    }
    return sections;
  }, [isCompleted]);

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

  const timerText = isCompleted ? "Archived after" : started ? "Expires in" : "Starts in";

  const startsOnDate = useMemo(() => formatDate({ date: startsAt, hideYear: true }), [startsAt]);

  const timer = useMemo(
    () =>
      moreThanOneDay ? (
        <Text size="sm" c={"green.7"}>
          Starts on {startsOnDate}
        </Text>
      ) : (
        <>
          <Timer
            date={timerDate}
            children={<Text size="xs">{timerText}</Text>}
            showDays={false}
            customStyles={
              isCompleted
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
    [startsOnDate, timerDate, isCompleted, timerText]
  );

  return (
    <Skeleton visible={showSkeleton}>
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
          <Text className={classes.description} c="dimmed" size="sm" lineClamp={2}>
            {description}
          </Text>
          {timer}
        </Stack>
        <RingProgress
          size={85}
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
