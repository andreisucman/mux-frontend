import React, { useMemo } from "react";
import { IconFilter, IconFilterOff, IconInfoCircle } from "@tabler/icons-react";
import { ActionIcon, Group, Skeleton, Text } from "@mantine/core";
import { formatDate } from "@/helpers/formatDate";
import useShowSkeleton from "@/helpers/useShowSkeleton";
import { TaskType } from "@/types/global";
import IconWithColor from "../../tasks/TasksList/CreateTaskOverlay/IconWithColor";
import classes from "./CalendarRow.module.css";

type Props = {
  task: TaskType;
  mode: string;
  customStyles?: { [key: string]: any };
  changeMode: (mode: string, taskKey?: string) => void;
  resetMode: () => void;
  redirectToTask: (taskId: string) => void;
};

export default function CalendarRow({
  task,
  mode,
  customStyles,
  redirectToTask,
  changeMode,
  resetMode,
}: Props) {
  const { key: taskKey, color, icon, name, startsAt, _id: taskId } = task;

  const date = useMemo(() => formatDate({ date: startsAt, hideYear: true }), [startsAt]);

  const showSkeleton = useShowSkeleton();

  return (
    <Skeleton visible={showSkeleton} mih={50}>
      <Group className={classes.container} style={customStyles ? customStyles : {}}>
        <Text className={classes.date}>{date}</Text>
        <IconWithColor icon={icon} color={color} />
        <Text className={classes.name} lineClamp={2}>
          {name}
        </Text>
        <Group className={classes.buttonGroup}>
          <ActionIcon
            variant="default"
            className={classes.button}
            onClick={(e) => {
              e.stopPropagation();
              redirectToTask(taskId);
            }}
          >
            <IconInfoCircle className="icon" />
          </ActionIcon>
          {mode === "all" && (
            <ActionIcon
              variant="default"
              className={classes.button}
              onClick={(e) => {
                e.stopPropagation();
                changeMode("individual", taskKey);
              }}
            >
              <IconFilter className="icon" />
            </ActionIcon>
          )}
          {mode === "individual" && (
            <ActionIcon
              variant="default"
              onClick={(e) => {
                e.stopPropagation();
                resetMode();
              }}
              className={classes.button}
            >
              <IconFilterOff className={"icon"} />
            </ActionIcon>
          )}
        </Group>
      </Group>
    </Skeleton>
  );
}
