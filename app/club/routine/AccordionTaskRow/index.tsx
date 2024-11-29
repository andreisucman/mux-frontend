import React, { useCallback, useMemo, useState } from "react";
import { IconBinoculars } from "@tabler/icons-react";
import { ActionIcon, Collapse, Group, Stack, Text } from "@mantine/core";
import IconWithColor from "@/app/routines/RoutineList/CreateTaskOverlay/IconWithColor";
import { AllTaskType, TypeEnum } from "@/types/global";
import StatsGroup from "../StatsGroup";
import AccordionRoutineVideoRow from "./AccordionRoutineVideoRow";
import classes from "./AccordionTaskRow.module.css";

type Props = {
  type: TypeEnum;
  data: AllTaskType;
  isSelf: boolean;
  routineId: string;
  onClick: (task: AllTaskType, routineId: string) => void;
};

export default function AccordionTaskRow({ routineId, isSelf, data, onClick }: Props) {
  const [openCollapse, setOpenCollapse] = useState(false);
  const { icon, color, name, total, completed } = data;

  const handleGroupClick = useCallback(() => {
    if (data.completed > 0) {
      setOpenCollapse((prev) => !prev);
    }
  }, [data.completed]);

  const handleIconClick = useCallback((e: any, data: AllTaskType, routineId: string) => {
    e.stopPropagation();
    onClick(data, routineId);
  }, []);

  const completionRate = useMemo(() => Math.round((completed / total) * 100), [total, completed]);

  return (
    <Stack className={classes.container}>
      <Group className={classes.wrapper} onClick={handleGroupClick}>
        <Group className={classes.title}>
          <ActionIcon
            variant="default"
            size="sm"
            onClick={(e) => handleIconClick(e, data, routineId)}
          >
            <IconBinoculars className={"icon icon__small"} />
          </ActionIcon>
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
      </Group>
      <Collapse in={openCollapse}>
        <AccordionRoutineVideoRow routineId={routineId} taskKey={data.key} isSelf={isSelf} />
      </Collapse>
    </Stack>
  );
}
