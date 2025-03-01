import React, { useCallback, useMemo } from "react";
import { IconCalendar, IconHandGrab, IconRefresh } from "@tabler/icons-react";
import cn from "classnames";
import { Accordion, ActionIcon, Button, Group, Skeleton, Text, Title } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import RecreateDateModalContent from "@/app/explain/[taskId]/SelectDateModalContent";
import callTheServer from "@/functions/callTheServer";
import cloneTask from "@/functions/cloneTask";
import askConfirmation from "@/helpers/askConfirmation";
import { useRouter } from "@/helpers/custom-router";
import { formatDate } from "@/helpers/formatDate";
import { partIcons } from "@/helpers/icons";
import openErrorModal from "@/helpers/openErrorModal";
import useShowSkeleton from "@/helpers/useShowSkeleton";
import { AllTaskType, RoutineStatusEnum, RoutineType, TaskStatusEnum } from "@/types/global";
import AccordionTaskRow from "../AccordionTaskRow";
import Indicator from "../Indicator";
import StatsGroup from "../StatsGroup";
import classes from "./AccordionRoutineRow.module.css";

type Props = {
  routine: RoutineType;
  isSelf: boolean;
  openTaskDetails?: (task: AllTaskType, routineId: string) => void;
  handleStealRoutine?: (routineId: string) => void;
  setRoutines?: React.Dispatch<React.SetStateAction<RoutineType[] | undefined>>;
};

export default function AccordionRoutineRow({
  routine,
  isSelf,
  setRoutines,
  openTaskDetails,
  handleStealRoutine,
}: Props) {
  const { part, startsAt, status: routineStatus, lastDate, allTasks } = routine;
  const router = useRouter();

  const rowLabel = useMemo(() => {
    const sameMonth = new Date(startsAt).getMonth() === new Date(lastDate).getMonth();
    const dateFrom = formatDate({ date: startsAt, hideYear: true, hideMonth: sameMonth });
    const dateTo = formatDate({ date: lastDate, hideYear: true });
    let label = `${upperFirst(part)}`;

    if (dateFrom) {
      const areSame = dateTo.slice(0, 2) === dateFrom.slice(0, 2);
      const parts = [` - ${dateTo}`];

      if (!areSame) {
        parts.unshift(` - ${dateFrom}`);
      }

      label += parts.join("");
    }

    return label;
  }, [part, startsAt, lastDate]);

  const totalTotal = useMemo(
    () => routine.allTasks.reduce((a, c) => a + c.total, 0),
    [routine.allTasks]
  );

  const totalCompleted = useMemo(
    () => routine.allTasks.reduce((a, c) => a + c.completed, 0),
    [routine.allTasks]
  );

  const completionRate = useMemo(
    () => Math.round((totalCompleted / totalTotal) * 100),
    [totalTotal, totalCompleted]
  );

  const routineCanBeReactivated = useMemo(() => {
    const lastDatePassed = new Date() > new Date(lastDate);
    const hasExpiredTasks = allTasks.filter((at) =>
      at.ids.some((idObj) => idObj.status === TaskStatusEnum.EXPIRED)
    );
    return (
      isSelf && !lastDatePassed && routineStatus !== RoutineStatusEnum.ACTIVE && hasExpiredTasks
    );
  }, [isSelf, routineStatus, allTasks]);

  const allActiveTasks = useMemo(() => {
    return allTasks.filter((at) =>
      at.ids.some((idObj) => idObj.status === "active" || idObj.status === "canceled")
    );
  }, [allTasks]);

  const redirectToCalendar = useCallback(
    (taskKey?: string) => {
      const dateFrom = new Date(routine.startsAt);
      dateFrom.setUTCHours(0, 0, 0, 0);
      const dateTo = new Date(routine.lastDate);
      dateTo.setDate(dateTo.getDate() + 1);
      dateTo.setUTCHours(0, 0, 0, 0);

      const parts = [`dateFrom=${dateFrom.toISOString()}`, `dateTo=${dateTo.toISOString()}`];

      if (taskKey) {
        parts.push(`key=${taskKey}`);
      }

      const query = parts.join("&");

      const url = `/calendar${query ? `?${query}` : ""}`;

      router.push(url);
    },
    [routine]
  );

  const redirectToTask = useCallback((taskId: string) => {
    router.push(`/explain/${taskId}`);
  }, []);

  const updateTaskStatus = useCallback(
    async (taskId: string, newStatus: string) => {
      const response = await callTheServer({
        endpoint: "updateStatusOfTasks",
        method: "POST",
        body: { taskIds: [taskId], newStatus, routineStatus, returnOnlyRoutines: true },
      });

      if (response.status === 200) {
        const { message, error } = response;

        if (error) {
          openErrorModal({ description: error });
          return;
        }

        const { routines } = message;
        if (setRoutines) setRoutines(routines);
      }
    },
    [setRoutines, status]
  );

  const handleCloneTask = useCallback((taskId: string) => {
    modals.openContextModal({
      title: (
        <Title order={5} component={"p"}>
          Choose new date
        </Title>
      ),
      size: "sm",
      innerProps: (
        <RecreateDateModalContent
          buttonText="Clone task"
          onSubmit={async ({ startDate }) => cloneTask({ setRoutines, startDate, taskId })}
        />
      ),
      modal: "general",
      centered: true,
    });
  }, []);

  const handleActivateRoutine = useCallback(async (routineId: string) => {
    const response = await callTheServer({
      endpoint: "activateRoutine",
      method: "POST",
      body: { routineId },
    });

    if (response.status === 200) {
      if (response.error) {
        openErrorModal({ description: response.error });
        return;
      }

      if (setRoutines) {
        setRoutines((prev) => {
          const newRoutines = prev?.map((r) =>
            r._id === routineId
              ? { ...r, status: RoutineStatusEnum.ACTIVE }
              : { ...r, status: RoutineStatusEnum.INACTIVE }
          );

          return newRoutines?.sort((a, b) => a.status.localeCompare(b.status));
        });
      }
    }
  }, []);

  const showSkeleton = useShowSkeleton();

  return (
    <Skeleton visible={showSkeleton} className={classes.skeleton}>
      <Accordion.Item key={routine._id} value={routine._id} className={classes.item}>
        <Accordion.Control className={classes.control}>
          <Group className={classes.row}>
            <Group className={classes.title}>
              <Indicator status={routine.status} />
              {partIcons[part]}
              {rowLabel}
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
                    redirectToCalendar();
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
          {routineCanBeReactivated && (
            <Button
              variant="default"
              size="compact-sm"
              component="div"
              disabled={!routineCanBeReactivated}
              className={cn(classes.button, { [classes.disabled]: !routineCanBeReactivated })}
              onClick={(e) => {
                e.stopPropagation();
                askConfirmation({
                  title: "Confirm action",
                  body: "This will deactivate your currently active routine. Continue?",
                  onConfirm: () => handleActivateRoutine(routine._id),
                });
              }}
            >
              <IconRefresh className="icon icon__small" />{" "}
              <Text className={classes.buttonText}>Reactivate</Text>
            </Button>
          )}
        </Accordion.Control>
        <Accordion.Panel>
          {allActiveTasks.map((task, i) => (
            <AccordionTaskRow
              key={i}
              data={task}
              isSelf={isSelf}
              routineId={routine._id}
              handleCloneTask={handleCloneTask}
              openTaskDetails={openTaskDetails}
              redirectToCalendar={redirectToCalendar}
              redirectToTask={redirectToTask}
              updateTaskStatus={updateTaskStatus}
            />
          ))}
        </Accordion.Panel>
      </Accordion.Item>
    </Skeleton>
  );
}
