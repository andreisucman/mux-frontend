import React, { useMemo } from "react";
import { Accordion, Checkbox, Group, Skeleton, Stack, Text } from "@mantine/core";
import StatsGroup from "@/components/StatsGroup";
import getReadableDateInterval from "@/helpers/getReadableDateInterval";
import { partIcons } from "@/helpers/icons";
import useShowSkeleton from "@/helpers/useShowSkeleton";
import { AllTaskType, TaskStatusEnum } from "@/types/global";
import MoveTaskRow from "./MoveTaskRow";
import classes from "./MoveRoutineRow.module.css";

export type SimpleRoutineType = {
  allTasks: AllTaskType[];
  _id: string;
  part: string;
  startsAt: string;
  lastDate: string;
};

type Props = {
  routine: SimpleRoutineType;
  selectedRoutineId: string;
  setSelectedRoutineId: React.Dispatch<React.SetStateAction<string>>;
};

export default function MoveRoutineRow({
  routine,
  selectedRoutineId,
  setSelectedRoutineId,
}: Props) {
  const showSkeleton = useShowSkeleton();

  const rowLabel = useMemo(
    () => getReadableDateInterval(routine.startsAt, routine.lastDate),
    [routine]
  );

  const totalTotal = useMemo(
    () =>
      routine.allTasks.reduce(
        (a, c) =>
          a +
          c.ids.filter((obj) =>
            [TaskStatusEnum.ACTIVE, TaskStatusEnum.COMPLETED].includes(obj.status as TaskStatusEnum)
          ).length,
        0
      ),
    [routine.allTasks]
  );

  const totalCompleted = useMemo(
    () =>
      routine.allTasks.reduce(
        (a, c) => a + c.ids.filter((io) => io.status === TaskStatusEnum.COMPLETED).length,
        0
      ),
    [routine.allTasks]
  );

  const completionRate = useMemo(
    () => Math.round((totalCompleted / totalTotal) * 100),
    [totalTotal, totalCompleted]
  );

  return (
    <Skeleton visible={showSkeleton} className={classes.skeleton}>
      <Accordion.Item key={routine._id} value={routine._id} className={classes.item}>
        <Accordion.Control className={classes.control}>
          <Group className={classes.title}>
            <Checkbox
              checked={routine._id === selectedRoutineId}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => {
                e.stopPropagation();
                setSelectedRoutineId(routine._id);
              }}
            />
            {partIcons[routine.part]}
            {rowLabel}
            <StatsGroup
              completed={totalCompleted}
              completionRate={completionRate}
              total={totalTotal}
            />
          </Group>
        </Accordion.Control>
        <Accordion.Panel>
          <Stack gap={12}>
            {routine.allTasks.map((at, i) => (
              <MoveTaskRow key={i} data={at} />
            ))}
          </Stack>
        </Accordion.Panel>
      </Accordion.Item>
    </Skeleton>
  );
}
