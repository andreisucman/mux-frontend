import React, { useMemo } from "react";
import { IconBinoculars, IconCalendar } from "@tabler/icons-react";
import cn from "classnames";
import { ActionIcon, Collapse, Group, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import IconWithColor from "@/app/tasks/TasksList/CreateTaskOverlay/IconWithColor";
import { AllTaskType, TaskStatusEnum, TypeEnum } from "@/types/global";
import StatsGroup from "../StatsGroup";
import RoutineIndividualTasksList from "./IndividualTasksList";
import classes from "./AccordionTaskRow.module.css";

type Props = {
  type: TypeEnum;
  data: AllTaskType;
  routineId: string;
  isSelf: boolean;
  handleCloneTask: (taskId: string) => void;
  openTaskDetails?: (task: AllTaskType, routineId: string) => void;
  redirectToCalendar: (taskKey: string) => void;
  redirectToTask: (taskId: string) => void;
  updateTaskStatus: (taskId: string, newStatus: string) => void;
};

export default function AccordionTaskRow({
  data,
  isSelf,
  routineId,
  handleCloneTask,
  openTaskDetails,
  redirectToTask,
  updateTaskStatus,
  redirectToCalendar,
}: Props) {
  const [openedIndividualTasks, { open, close }] = useDisclosure(false);
  const { ids, icon, key, color, name, total, completed } = data;

  const notDeletedIds = useMemo(
    () => ids.filter((idObj) => idObj.status !== TaskStatusEnum.DELETED),
    [ids]
  );

  const someTaskActive = useMemo(() => ids.some((obj) => obj.status === "active"), [ids]);
  const completionRate = useMemo(() => Math.round((completed / total) * 100), [total, completed]);

  const handleOpenList = () => {
    openedIndividualTasks ? close() : open();
  };

  return (
    <Stack className={classes.container}>
      <Group className={classes.wrapper} onClick={handleOpenList}>
        <Group className={classes.title}>
          <div
            className={cn(classes.indicator, {
              [classes.active]: someTaskActive,
            })}
          />
          <IconWithColor icon={icon} color={color} />
          <Text className={classes.name} lineClamp={2}>
            {name}
          </Text>
        </Group>
        <Group className={classes.content}>
          <StatsGroup
            completed={completed}
            completionRate={completionRate}
            total={total}
            isChild={true}
          />
          {isSelf ? (
            <ActionIcon
              variant="default"
              size="sm"
              component="div"
              onClick={(e) => {
                e.stopPropagation();
                if (redirectToCalendar) redirectToCalendar(key);
              }}
            >
              <IconCalendar className={"icon icon__small"} />
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
              <IconBinoculars className={"icon icon__small"} />
            </ActionIcon>
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
          handleCloneTask={handleCloneTask}
          redirectToCalendar={redirectToCalendar}
          redirectToTask={redirectToTask}
          updateTaskStatus={updateTaskStatus}
        />
      </Collapse>
    </Stack>
  );
}
