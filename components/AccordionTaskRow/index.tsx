import React, { useMemo } from "react";
import { IconBinoculars, IconCalendar } from "@tabler/icons-react";
import { ActionIcon, Collapse, Group, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import IconWithColor from "@/app/tasks/TasksList/CreateTaskOverlay/IconWithColor";
import { AllTaskType, TaskStatusEnum } from "@/types/global";
import { RedirectWithDateProps } from "../AccordionRoutineRow";
import Indicator from "../Indicator";
import StatsGroup from "../StatsGroup";
import RoutineIndividualTasksList from "./IndividualTasksList";
import classes from "./AccordionTaskRow.module.css";

type Props = {
  data: AllTaskType;
  routineId: string;
  isSelf: boolean;
  handleCloneTaskInstance: (taskId: string) => void;
  openTaskDetails?: (task: AllTaskType, routineId: string) => void;
  redirectWithDate: (props: RedirectWithDateProps) => void;
  redirectToTask: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  updateTaskStatus: (taskId: string, newStatus: string) => void;
};

export default function AccordionTaskRow({
  data,
  isSelf,
  routineId,
  deleteTask,
  handleCloneTaskInstance,
  openTaskDetails,
  redirectToTask,
  updateTaskStatus,
  redirectWithDate,
}: Props) {
  const [openedIndividualTasks, { open, close }] = useDisclosure(false);
  const { ids, icon, key, color, name } = data;

  const notDeletedIds = useMemo(() => ids.filter((idObj) => !idObj.deletedOn), [ids]);

  const total = useMemo(
    () =>
      ids.filter((obj) =>
        [TaskStatusEnum.COMPLETED, TaskStatusEnum.ACTIVE].includes(obj.status as TaskStatusEnum)
      ).length,
    [ids]
  );

  const completed = useMemo(
    () => ids.filter((io) => io.status === TaskStatusEnum.COMPLETED).length,
    [ids]
  );

  const taskStatus = useMemo(() => {
    const isActive = ids.some((obj) => obj.status === TaskStatusEnum.ACTIVE);
    const isCompleted =
      !ids.some((obj) => obj.status === TaskStatusEnum.ACTIVE) &&
      ids.some((obj) => obj.status === TaskStatusEnum.COMPLETED);

    if (isActive) return TaskStatusEnum.ACTIVE;
    if (isCompleted) return TaskStatusEnum.COMPLETED;
    return TaskStatusEnum.EXPIRED;
  }, [ids]);

  const completionRate = useMemo(() => Math.round((completed / total) * 100), [completed, total]);

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
          <StatsGroup completed={completed} completionRate={completionRate} total={total} />
          {routineId && (
            <>
              {isSelf ? (
                <ActionIcon
                  variant="default"
                  size="sm"
                  component="div"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (redirectWithDate) redirectWithDate({ taskKey: key, page: "calendar" });
                  }}
                >
                  <IconCalendar className={"icon icon__small icon__gray"} />
                </ActionIcon>
              ) : (
                <ActionIcon
                  variant="default"
                  size="sm"
                  component="div"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (openTaskDetails) openTaskDetails(data, routineId);
                  }}
                >
                  <IconBinoculars className={"icon icon__small icon__gray"} />
                </ActionIcon>
              )}
            </>
          )}
        </Group>
      </Group>
      <Collapse in={openedIndividualTasks}>
        <RoutineIndividualTasksList
          color={color}
          icon={icon}
          isSelf={isSelf}
          taskKey={key}
          taskIdsObjects={notDeletedIds}
          deleteTask={deleteTask}
          handleCloneTaskInstance={handleCloneTaskInstance}
          redirectToTask={redirectToTask}
          updateTaskStatus={updateTaskStatus}
        />
      </Collapse>
    </Stack>
  );
}
