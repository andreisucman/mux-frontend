import React, { useCallback, useMemo } from "react";
import { IconClipboardText, IconHandGrab } from "@tabler/icons-react";
import cn from "classnames";
import { Accordion, Button, Group, Skeleton, Text } from "@mantine/core";
import { formatDate } from "@/helpers/formatDate";
import useShowSkeleton from "@/helpers/useShowSkeleton";
import { AllTaskType, RoutineType, TypeEnum } from "@/types/global";
import AccordionTaskRow from "../AccordionTaskRow";
import StatsGroup from "../StatsGroup";
import classes from "./AccordionRoutineRow.module.css";

type Props = {
  routine: RoutineType;
  type: TypeEnum;
  isSelf: boolean;
  openTaskDetails: (task: AllTaskType, routineId: string) => void;
  handleReplaceRoutine: (routineId: string) => void;
};

export default function AccordionRoutineRow({
  type,
  routine,
  isSelf,
  openTaskDetails,
  handleReplaceRoutine,
}: Props) {
  const date = useMemo(() => formatDate({ date: routine.createdAt }), [routine.createdAt]);

  const totalTotal = useMemo(
    () => routine.allTasks.reduce((a, c) => a + c.total, 0),
    [routine.allTasks.length]
  );

  const totalCompleted = useMemo(
    () => routine.allTasks.reduce((a, c) => a + c.completed, 0),
    [routine.allTasks.length]
  );

  const completionRate = useMemo(
    () => Math.round((totalCompleted / totalTotal) * 100),
    [totalTotal, totalCompleted]
  );

  const handleStealClick = useCallback((e: any, routineId: string) => {
    e.stopPropagation();
    handleReplaceRoutine(routineId);
  }, []);

  const showSkeleton = useShowSkeleton();

  return (
    <Skeleton visible={showSkeleton} className={`${classes.skeleton} skeleton`}>
      <Accordion.Item key={routine._id} value={routine._id} className={classes.item}>
        <Accordion.Control>
          <Group className={classes.row}>
            <Group className={classes.title}>
              <div
                className={cn(classes.indicator, {
                  [classes.active]: routine.status === "active",
                })}
              />
              <Group className={classes.name}>
                <IconClipboardText className="icon icon__small" />
                {date}
              </Group>
            </Group>
            <StatsGroup
              completed={totalCompleted}
              completionRate={completionRate}
              total={totalTotal}
            />
          </Group>
          <Button
            variant="default"
            size="compact-sm"
            component="div"
            disabled={isSelf}
            className={cn(classes.button, { [classes.disabled]: isSelf })}
            onClick={(e) => handleStealClick(e, routine._id)}
          >
            <IconHandGrab className="icon icon__small" />{" "}
            <Text className={classes.buttonText}>Steal this routine</Text>
          </Button>
        </Accordion.Control>
        <Accordion.Panel>
          {routine.allTasks.map((task) => (
            <AccordionTaskRow
              key={task.key}
              routineId={routine._id}
              type={type as TypeEnum}
              data={task}
              onClick={openTaskDetails}
            />
          ))}
        </Accordion.Panel>
      </Accordion.Item>
    </Skeleton>
  );
}
