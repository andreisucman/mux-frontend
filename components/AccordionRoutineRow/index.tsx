import React, { useCallback, useMemo } from "react";
import { IconCalendar, IconClipboardText, IconHandGrab } from "@tabler/icons-react";
import cn from "classnames";
import { Accordion, ActionIcon, Button, Group, Skeleton, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useRouter } from "@/helpers/custom-router";
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
  openTaskDetails?: (task: AllTaskType, routineId: string) => void;
  handleStealRoutine?: (routineId: string) => void;
};

export default function AccordionRoutineRow({
  type,
  routine,
  isSelf,
  openTaskDetails,
  handleStealRoutine,
}: Props) {
  const router = useRouter();
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

  const handleRedirectToCalendar = useCallback(
    (taskKey?: string) => {
      const dateFrom = new Date(routine.createdAt);
      const dateTo = new Date(routine.lastDate);

      let url = `/calendar?type=${type}&dateFrom=${dateFrom.toISOString()}&dateTo=${dateTo.toISOString()}`;
      if (taskKey) url += `key=${taskKey}`;

      router.push(url);
      modals.closeAll();
    },
    [type, routine]
  );

  const handleRedirectToTask = useCallback((taskId: string) => {
    router.push(`/explain/${taskId}`);
    modals.closeAll();
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
            <Group wrap="nowrap">
              <StatsGroup
                completed={totalCompleted}
                completionRate={completionRate}
                total={totalTotal}
              />
              {isSelf && (
                <ActionIcon
                  variant="default"
                  component="div"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRedirectToCalendar();
                  }}
                >
                  <IconCalendar className="icon icon__small" />
                </ActionIcon>
              )}
            </Group>
          </Group>
          {!isSelf && (
            <Button
              variant="default"
              size="compact-sm"
              component="div"
              disabled={isSelf}
              className={cn(classes.button, { [classes.disabled]: isSelf })}
              onClick={(e) => {
                e.stopPropagation();
                if (handleStealRoutine) handleStealRoutine(routine._id);
              }}
            >
              <IconHandGrab className="icon icon__small" />{" "}
              <Text className={classes.buttonText}>Steal this routine</Text>
            </Button>
          )}
        </Accordion.Control>
        <Accordion.Panel>
          {routine.allTasks.map((task, i) => (
            <AccordionTaskRow
              key={i}
              data={task}
              isSelf={isSelf}
              routineId={routine._id}
              type={type as TypeEnum}
              openTaskDetails={openTaskDetails}
              redirectToCalendar={handleRedirectToCalendar}
              redirectToTask={handleRedirectToTask}
            />
          ))}
        </Accordion.Panel>
      </Accordion.Item>
    </Skeleton>
  );
}
