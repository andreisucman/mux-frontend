import React, { useCallback, useMemo } from "react";
import { IconBinoculars } from "@tabler/icons-react";
import cn from "classnames";
import { ActionIcon, Group, Stack, Text, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import IconWithColor from "@/app/tasks/TasksList/CreateTaskOverlay/IconWithColor";
import { formatDate } from "@/helpers/formatDate";
import { AllTaskType, TypeEnum } from "@/types/global";
import StatsGroup from "../StatsGroup";
import AccordionTaskMenu from "./AccordionTaskMenu";
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
  const { ids, icon, key, color, name, total, completed } = data;

  const someTaskActive = useMemo(() => ids.some((obj) => obj.status === "active"), [ids]);
  const completionRate = useMemo(() => Math.round((completed / total) * 100), [total, completed]);

  const openSelectTasksModal = useCallback(() => {
    modals.openContextModal({
      modal: "general",
      centered: true,
      title: (
        <Title order={5} component={"p"}>
          Select task
        </Title>
      ),
      size: "md",
      innerProps: (
        <Stack>
          {ids.map((idObj) => {
            const date = formatDate({ date: idObj.startsAt });
            return (
              <Group
                key={idObj._id}
                className={classes.taskRow}
                onClick={() => redirectToTask(idObj._id)}
              >
                <div
                  className={cn(classes.indicator, {
                    [classes.active]: idObj.status === "active",
                    [classes.canceled]: idObj.status === "canceled",
                  })}
                />
                <IconWithColor icon={icon} color={color} />
                <Text className={classes.name} lineClamp={2}>
                  {name}
                </Text>
                <Text className={classes.taskDate}>{date}</Text>
              </Group>
            );
          })}
        </Stack>
      ),
    });
  }, []);

  return (
    <Stack className={classes.container}>
      <Group className={classes.wrapper}>
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
        <Group wrap="nowrap">
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
          {isSelf && (
            <AccordionTaskMenu
              redirectToCalendar={() => redirectToCalendar(key)}
              openTaskList={openSelectTasksModal}
            />
          )}
        </Group>
      </Group>
    </Stack>
  );
}
