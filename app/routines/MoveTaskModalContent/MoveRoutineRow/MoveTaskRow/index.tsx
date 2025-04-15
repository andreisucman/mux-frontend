import React, { useMemo } from "react";
import { Group, Stack, Text } from "@mantine/core";
import IconWithColor from "@/app/tasks/TasksList/CreateTaskOverlay/IconWithColor";
import Indicator from "@/components/Indicator";
import { AllTaskType, TaskStatusEnum } from "@/types/global";
import classes from "./MoveTaskRow.module.css";

type Props = {
  data: AllTaskType;
};

export default function MoveTaskRow({ data }: Props) {
  const { ids, icon, color, name } = data;

  const taskStatus = useMemo(() => {
    const isActive = ids.some((obj) => obj.status === TaskStatusEnum.ACTIVE);
    const isCompleted =
      !ids.some((obj) => obj.status === TaskStatusEnum.ACTIVE) &&
      ids.some((obj) => obj.status === TaskStatusEnum.COMPLETED);

    if (isActive) return TaskStatusEnum.ACTIVE;
    if (isCompleted) return TaskStatusEnum.COMPLETED;
    return TaskStatusEnum.EXPIRED;
  }, [ids]);

  return (
    <Stack className={classes.container}>
      <Group className={classes.title}>
        <Indicator status={taskStatus} customStyles={{ zIndex: 1 }} />
        <IconWithColor icon={icon} color={color} />
        <Text className={classes.name} lineClamp={2}>
          {name}
        </Text>
      </Group>
    </Stack>
  );
}
