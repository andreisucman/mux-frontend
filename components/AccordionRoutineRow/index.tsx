import React, { useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { IconCalendar, IconHandGrab } from "@tabler/icons-react";
import cn from "classnames";
import { Accordion, ActionIcon, Button, Group, Skeleton, Text, Title } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import RecreateDateModalContent from "@/app/explain/[taskId]/SelectDateModalContent";
import callTheServer from "@/functions/callTheServer";
import cloneTask from "@/functions/cloneTask";
import { useRouter } from "@/helpers/custom-router";
import { formatDate } from "@/helpers/formatDate";
import { partIcons } from "@/helpers/icons";
import openErrorModal from "@/helpers/openErrorModal";
import useShowSkeleton from "@/helpers/useShowSkeleton";
import { AllTaskType, RoutineType } from "@/types/global";
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
  const { part, startsAt, lastDate } = routine;
  const router = useRouter();
  const searchParams = useSearchParams();

  const status = searchParams.get("status") || "active"; // segment status of overall page

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
        body: { taskIds: [taskId], newStatus, routineStatus: status, returnOnlyRoutines: true },
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
         onSubmit={async ({ startDate }) => cloneTask({ setRoutines, startDate, taskId })}
        />
      ),
      modal: "general",
      centered: true,
    });
  }, []);

  const showSkeleton = useShowSkeleton();

  const allActiveTasks = useMemo(() => {
    return routine.allTasks.filter((at) =>
      at.ids.some((idObj) => idObj.status === "active" || idObj.status === "canceled")
    );
  }, [routine.allTasks]);

  return (
    <Skeleton visible={showSkeleton} className={`${classes.skeleton} skeleton`}>
      <Accordion.Item key={routine._id} value={routine._id} className={classes.item}>
        <Accordion.Control>
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
