import React, { useMemo } from "react";
import { Collapse, Group, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import IconWithColor from "@/app/tasks/TasksList/CreateTaskOverlay/IconWithColor";
import { AllTaskType, TaskStatusEnum } from "@/types/global";
import Indicator from "../Indicator";
import StatsGroup from "../StatsGroup";
import AccordionTaskMenu from "./AccordionTaskMenu";
import TaskInstanceList from "./TaskInstanceList";
import classes from "./AccordionTaskRow.module.css";

type Props = {
  data: AllTaskType;
  isSelf: boolean;
  addTaskInstance: (taskId: string) => void;
  copyTaskInstance: (taskId: string) => void;
  rescheduleTaskInstance?: (taskKey: string) => void;
  redirectToTaskInstance: (taskId: string) => void;
  deleteTaskInstance: (taskId: string) => void;
  updateTaskInstance: (taskId: string, newStatus: string) => void;
  copyTask: (taskKey: string) => void;
  rescheduleTask?: (taskKey: string) => void;
  redirectToTask?: (props: { taskKey?: string; page: "calendar" | "diary" }) => void;
  deleteTask?: (taskKey: string) => void;
  updateTask?: (taskKey: string, newStatus: string) => void;
};

export default function AccordionTaskRow({
  data,
  isSelf,
  addTaskInstance,
  copyTaskInstance,
  rescheduleTaskInstance,
  deleteTaskInstance,
  updateTaskInstance,
  redirectToTaskInstance,
  copyTask,
  rescheduleTask,
  deleteTask,
  updateTask,
  redirectToTask,
}: Props) {
  const [openedIndividualTasks, { open, close }] = useDisclosure(false);
  const { ids, icon, key, color, name } = data;

  const hasActiveOrCanceledTasks = useMemo(() => {
    const hasActive = ids.some((obj) => obj.status === TaskStatusEnum.ACTIVE);
    const hasCanceled = ids.some((obj) => obj.status === TaskStatusEnum.CANCELED);
    const allTasksCanceled = ids.every((obj) => obj.status === TaskStatusEnum.CANCELED);
    return { hasActive, hasCanceled, allTasksCanceled };
  }, [ids]);

  const notDeletedIds = useMemo(() => ids.filter((idObj) => !idObj.deletedOn), [ids]);

  const analytics = useMemo(() => {
    const total = ids.filter((obj) =>
      [TaskStatusEnum.COMPLETED, TaskStatusEnum.ACTIVE].includes(obj.status as TaskStatusEnum)
    ).length;
    const completed = ids.filter((io) => io.status === TaskStatusEnum.COMPLETED).length;
    const completionRate = Math.round((completed / total) * 100);
    return { total, completed, completionRate };
  }, [ids]);

  const taskStatus = useMemo(() => {
    const isActive = ids.some((obj) => obj.status === TaskStatusEnum.ACTIVE);
    const isCompleted =
      !ids.some((obj) => obj.status === TaskStatusEnum.ACTIVE) &&
      ids.some((obj) => obj.status === TaskStatusEnum.COMPLETED);

    if (isActive) return TaskStatusEnum.ACTIVE;
    if (isCompleted) return TaskStatusEnum.COMPLETED;
    return TaskStatusEnum.EXPIRED;
  }, [ids]);

  const handleOpenList = () => {
    openedIndividualTasks ? close() : open();
  };

  return (
    <Stack className={classes.container}>
      <Group className={classes.wrapper} onClick={handleOpenList}>
        <Group className={classes.title}>
          <Indicator status={taskStatus} />
          <IconWithColor icon={icon} color={color} />
          <Text className={classes.name} lineClamp={2}>
            {name}
          </Text>
        </Group>
        <Group className={classes.content}>
          <StatsGroup
            completed={analytics.completed}
            completionRate={analytics.completionRate}
            total={analytics.total}
          />
          <AccordionTaskMenu
            isSelf={isSelf}
            redirectToTask={redirectToTask}
            rescheduleTask={rescheduleTask}
            copyTask={copyTask}
            deleteTask={deleteTask}
            updateTask={updateTask}
            hasActiveTasks={hasActiveOrCanceledTasks.hasActive}
            hasCanceledTasks={hasActiveOrCanceledTasks.hasCanceled}
            allTasksCanceled={hasActiveOrCanceledTasks.allTasksCanceled}
            taskKey={key}
          />
        </Group>
      </Group>
      <Collapse in={openedIndividualTasks}>
        <TaskInstanceList
          color={color}
          icon={icon}
          isSelf={isSelf}
          taskIdsObjects={notDeletedIds}
          deleteTaskInstance={deleteTaskInstance}
          copyTaskInstance={copyTaskInstance}
          addTaskInstance={addTaskInstance}
          updateTaskInstance={updateTaskInstance}
          redirectToTaskInstance={redirectToTaskInstance}
          rescheduleTaskInstance={rescheduleTaskInstance}
        />
      </Collapse>
    </Stack>
  );
}
