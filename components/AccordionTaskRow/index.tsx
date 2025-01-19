import React, { useMemo } from "react";
import { IconBinoculars } from "@tabler/icons-react";
import cn from "classnames";
import { ActionIcon, Collapse, Group, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import IconWithColor from "@/app/tasks/TasksList/CreateTaskOverlay/IconWithColor";
import { AllTaskType, TypeEnum } from "@/types/global";
import StatsGroup from "../StatsGroup";
import RoutineIndividualTasksList from "./IndividualTasksList";
import classes from "./AccordionTaskRow.module.css";

type Props = {
  type: TypeEnum;
  data: AllTaskType;
  routineId: string;
  isSelf: boolean;
  openTaskDetails?: (task: AllTaskType, routineId: string) => void;
  redirectToCalendar: (taskKey: string) => void;
  redirectToTask: (taskId: string) => void;
};

export default function AccordionTaskRow({
  data,
  isSelf,
  routineId,
  openTaskDetails,
  redirectToTask,
  redirectToCalendar,
}: Props) {
  const [openedIndividualTasks, { open, close }] = useDisclosure(false);
  const { ids, icon, key, color, name, total, completed } = data;

  const someTaskActive = useMemo(() => ids.some((obj) => obj.status === "active"), [ids]);
  const completionRate = useMemo(() => Math.round((completed / total) * 100), [total, completed]);

  const handleOpenList = () => {
    if (ids.length > 1) {
      openedIndividualTasks ? close() : open();
    }
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
          {!isSelf && (
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
          taskIdsObjects={ids}
          redirectToCalendar={redirectToCalendar}
          redirectToTask={redirectToTask}
        />
      </Collapse>
    </Stack>
  );
}
