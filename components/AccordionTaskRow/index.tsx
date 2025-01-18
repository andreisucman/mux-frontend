import React, { useCallback, useMemo } from "react";
import { IconBinoculars, IconCalendar, IconInfoCircle } from "@tabler/icons-react";
import { ActionIcon, Group, Stack, Text, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import IconWithColor from "@/app/tasks/TasksList/CreateTaskOverlay/IconWithColor";
import { AllTaskType, TypeEnum } from "@/types/global";
import StatsGroup from "../StatsGroup";
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
      size: "sm",
      innerProps: (
        <Stack>
          {ids.map((id) => (
            <Group key={id} className={classes.title} onClick={() => redirectToTask(id)}>
              <IconWithColor icon={icon} color={color} />
              <Text className={classes.name} lineClamp={2}>
                {name}
              </Text>
            </Group>
          ))}
        </Stack>
      ),
    });
  }, []);

  return (
    <Stack className={classes.container}>
      <Group className={classes.wrapper}>
        <Group className={classes.title}>
          {!isSelf && (
            <ActionIcon
              variant="default"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                if (openTaskDetails) openTaskDetails(data, routineId);
              }}
            >
              <IconBinoculars className={"icon icon__small"} />
            </ActionIcon>
          )}
          <IconWithColor icon={icon} color={color} />
          <Text className={classes.name} lineClamp={2}>
            {name}
          </Text>
        </Group>
        <StatsGroup
          completed={completed}
          completionRate={completionRate}
          total={total}
          isChild={true}
        />
        {isSelf && (
          <Group className={classes.iconButtons}>
            <ActionIcon variant="default" onClick={() => redirectToCalendar(key)}>
              <IconCalendar className="icon" />
            </ActionIcon>
            <ActionIcon variant="default" onClick={openSelectTasksModal}>
              <IconInfoCircle className="icon" />
            </ActionIcon>
          </Group>
        )}
      </Group>
    </Stack>
  );
}
