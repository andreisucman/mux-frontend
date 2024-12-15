import React, { useCallback, useMemo } from "react";
import { IconSearch } from "@tabler/icons-react";
import { ActionIcon, Checkbox, Group, Skeleton, Text } from "@mantine/core";
import { formatDate } from "@/helpers/formatDate";
import useShowSkeleton from "@/helpers/useShowSkeleton";
import { TaskType } from "@/types/global";
import IconWithColor from "../../TasksList/CreateTaskOverlay/IconWithColor";
import classes from "./CalendarRow.module.css";

type Props = {
  task: TaskType;
  mode: string;
  tasksToUpdate: TaskType[];
  customStyles?: { [key: string]: any };
  selectTask: (task: TaskType) => void;
  handleChangeMode: (mode: string, taskKey?: string) => void;
};

export default function CalendarRow({
  task,
  mode,
  customStyles,
  tasksToUpdate,
  selectTask,
  handleChangeMode,
}: Props) {
  const { key: taskKey, color, icon, name, startsAt, _id: taskId } = task;

  const date = useMemo(() => formatDate({ date: startsAt, hideYear: true }), [startsAt]);

  const handleSeeIndividualTasks = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, taskKey: string) => {
      e.stopPropagation();
      handleChangeMode("individual", taskKey);
    },
    [taskKey]
  );

  const checked = useMemo(
    () => tasksToUpdate.map((t) => t._id).includes(taskId),
    [taskId, tasksToUpdate.length]
  );

  const showSkeleton = useShowSkeleton();

  return (
    <Skeleton visible={showSkeleton}>
      <Group
        className={classes.container}
        onClick={() => selectTask(task)}
        style={customStyles ? customStyles : {}}
      >
        <Checkbox checked={checked} readOnly />
        <Text className={classes.date}>{date}</Text>
        <IconWithColor icon={icon} color={color} />
        <Text className={classes.name} lineClamp={2}>
          {name}
        </Text>
        {mode === "all" && (
          <ActionIcon
            variant="default"
            className={classes.button}
            onClick={(e) => handleSeeIndividualTasks(e, taskKey)}
          >
            <IconSearch />
          </ActionIcon>
        )}
      </Group>
    </Skeleton>
  );
}
