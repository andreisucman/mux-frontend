import React, { useMemo } from "react";
import { IconCheck, IconSun, IconSunrise, IconSunset } from "@tabler/icons-react";
import { ActionIcon, Group, rem, RingProgress, Stack, Text } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import Timer from "@/components/Timer";
import { convertUTCToLocal } from "@/helpers/convertUTCToLocal";
import { formatDate } from "@/helpers/formatDate";
import { daysFrom } from "@/helpers/utils";
import { RequiredSubmissionType } from "@/types/global";
import IconWithColor from "../CreateTaskOverlay/IconWithColor";
import classes from "./RoutineRow.module.css";

type Props = {
  color: string;
  name: string;
  icon?: string;
  startsAt: string;
  expiresAt: string;
  description: string;
  requiredSubmissions?: RequiredSubmissionType[];
  customStyles?: { [key: string]: any };
  onClick?: () => void;
};

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export default function RoutineRow({
  color,
  name,
  icon,
  startsAt,
  expiresAt,
  description,
  customStyles,
  requiredSubmissions,
  onClick,
}: Props) {
  const { height, ref } = useElementSize();

  const submitted = requiredSubmissions?.filter((r) => r.isSubmitted);
  const isCompleted = submitted?.length === requiredSubmissions?.length;

  const completionPercentage = useMemo(
    () =>
      (requiredSubmissions &&
        submitted &&
        Math.round((submitted?.length / requiredSubmissions?.length) * 100)) ||
      0,
    [requiredSubmissions?.length]
  );

  const dayTimeSpecified = useMemo(
    () => requiredSubmissions && requiredSubmissions?.filter((s) => s.dayTime).length > 0,
    [requiredSubmissions?.length]
  );

  const ringLabel = useMemo(
    () =>
      isCompleted ? (
        <ActionIcon c="green.7" variant="transparent" radius="xl">
          <IconCheck stroke={3} className="icon icon__large" />
        </ActionIcon>
      ) : (
        <Text fw={600} ta="center" size="sm">
          {completionPercentage}%
        </Text>
      ),
    [isCompleted]
  );

  const sections = useMemo(() => {
    const sections = [];
    if (isCompleted) {
      sections.push({ value: 100, color: "green.7" });
    } else {
      if (completionPercentage > 0) {
        sections.push({
          value: completionPercentage || 0,
          color: "yellow.7",
        });
      } else {
        sections.push({
          value: completionPercentage || 0,
          color: "gray.3",
        });
      }
    }
    return sections;
  }, [isCompleted, completionPercentage]);

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

  const timerText = isCompleted ? "Resets after" : started ? "Expires in" : "Starts in";

  const dayTimeIcons = useMemo(() => {
    return requiredSubmissions?.map((submission, index) => {
      const submissionColor = submission.isSubmitted
        ? "var(--mantine-color-green-7)"
        : "var(--mantine-color-gray-3)";
      if (submission.dayTime === "morning")
        return <IconSunrise key={index} color={submissionColor} className={classes.icon} />;
      if (submission.dayTime === "evening")
        return <IconSunset key={index} color={submissionColor} className={classes.icon} />;
      if (submission.dayTime === "noon")
        return <IconSun key={index} color={submissionColor} className={classes.icon} />;
    });
  }, [requiredSubmissions?.length]);

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
            text={timerText}
            showDays={false}
            customStyles={
              isCompleted
                ? {
                    fontSize: rem(12),
                    color: "var(--mantine-color-green-7)",
                  }
                : started
                  ? {
                      fontSize: rem(12),
                      color: "var(--mantine-color-red-7)",
                    }
                  : {
                      fontSize: rem(12),
                      color: "var(--mantine-color-green-7)",
                    }
            }
          />
        </>
      ),
    [startsOnDate, timerDate, isCompleted, timerText]
  );

  return (
    <Group
      ref={ref}
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
      {dayTimeSpecified && (
        <Stack gap={0} p={"0.25rem 0"} h={height} className={classes.dayTimeContainer}>
          {dayTimeIcons}
        </Stack>
      )}
      <RingProgress
        size={85}
        thickness={9}
        label={ringLabel}
        className={classes.ringProgress}
        styles={{ label: { display: "flex", justifyContent: "center" } }}
        sections={sections}
      />
    </Group>
  );
}
