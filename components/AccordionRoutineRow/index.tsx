import React, { useCallback, useMemo } from "react";
import { Accordion, Checkbox, Group, Skeleton, Title } from "@mantine/core";
import { useFocusWithin } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import RecreateDateModalContent from "@/app/explain/[taskId]/SelectDateModalContent";
import callTheServer from "@/functions/callTheServer";
import cloneTask from "@/functions/cloneTask";
import { useRouter } from "@/helpers/custom-router";
import { formatDate } from "@/helpers/formatDate";
import { partIcons } from "@/helpers/icons";
import openErrorModal from "@/helpers/openErrorModal";
import useShowSkeleton from "@/helpers/useShowSkeleton";
import { daysFrom } from "@/helpers/utils";
import { AllTaskType, RoutineType, TaskStatusEnum } from "@/types/global";
import AccordionTaskRow from "../AccordionTaskRow";
import AccordionRowMenu from "../AccordionTaskRow/AccordionRowMenu";
import Indicator from "../Indicator";
import InputWithCheckboxes from "../InputWithCheckboxes";
import OverlayWithText from "../OverlayWithText";
import StatsGroup from "../StatsGroup";
import classes from "./AccordionRoutineRow.module.css";

type Props = {
  routine: RoutineType;
  isSelf: boolean;
  timeZone?: string;
  index: number;
  selectedRoutineIds?: string[];
  selectedConcerns: { [key: string]: string[] };
  cloneOrRescheduleRoutines?: (routineIds: string[], isReschedule?: boolean) => void;
  updateRoutineStatuses?: (routineIds: string[], newStatus: string) => void;
  handleCancelRoutine?: (routineId: string, isDelete?: boolean) => void;
  setSelectedConcerns: React.Dispatch<React.SetStateAction<{ [key: string]: string[] }>>;
  setSelectedRoutineIds?: React.Dispatch<React.SetStateAction<string[]>>;
  openTaskDetails?: (task: AllTaskType, routineId: string) => void;
  setRoutines?: React.Dispatch<React.SetStateAction<RoutineType[] | undefined>>;
};

export type RedirectWithDateProps = {
  taskKey?: string;
  page: "calendar" | "diary";
};

export default function AccordionRoutineRow({
  routine,
  index,
  timeZone,
  isSelf,
  selectedConcerns,
  selectedRoutineIds,
  setRoutines,
  openTaskDetails,
  cloneOrRescheduleRoutines,
  setSelectedConcerns,
  setSelectedRoutineIds,
  updateRoutineStatuses,
}: Props) {
  const { ref, focused } = useFocusWithin();
  const { _id: routineId, part, startsAt, status: routineStatus, lastDate, allTasks } = routine;

  const router = useRouter();

  const isSelected = useMemo(() => {
    if (!selectedRoutineIds) return false;
    return selectedRoutineIds.includes(routine._id);
  }, [selectedRoutineIds, routine]);

  const handleSelectConcern = (chosenConcerns: string[]) => {
    setSelectedConcerns((prev) => ({ ...prev, [routineId]: chosenConcerns }));
  };

  const handleSelectRoutine = (isSelected: boolean) => {
    if (!setSelectedRoutineIds) return;
    if (isSelected) {
      setSelectedRoutineIds((prev) => prev.filter((_id) => _id !== routine._id));
    } else {
      setSelectedRoutineIds((prev) => [...prev, routine._id]);
    }
  };

  const rowLabel = useMemo(() => {
    const areSame = new Date(startsAt).toDateString() === new Date(lastDate).toDateString();

    const sameMonth = new Date(startsAt).getMonth() === new Date(lastDate).getMonth();
    const dateFrom = formatDate({
      date: startsAt,
      hideYear: true,
      hideMonth: sameMonth && !areSame,
    });
    const dateTo = formatDate({ date: lastDate, hideYear: true });

    const parts = [dateFrom];

    if (!areSame) {
      parts.push(dateTo);
    }

    return parts.join(" - ");
  }, [part, startsAt, lastDate]);

  const totalTotal = useMemo(
    () => routine.allTasks.reduce((a, c) => a + c.ids.length, 0),
    [routine.allTasks]
  );

  const totalCompleted = useMemo(
    () =>
      routine.allTasks.reduce(
        (a, c) => a + c.ids.filter((io) => io.status === TaskStatusEnum.COMPLETED).length,
        0
      ),
    [routine.allTasks]
  );

  const completionRate = useMemo(
    () => Math.round((totalCompleted / totalTotal) * 100),
    [totalTotal, totalCompleted]
  );

  const allActiveTasks = useMemo(() => {
    const activeTasks = allTasks.filter((at) =>
      at.ids.some(
        (idObj) =>
          idObj.status === "active" || idObj.status === "canceled" || idObj.status === "expired"
      )
    );
    return activeTasks;
  }, [selectedConcerns, routine]);

  const selectedTasks = useMemo(() => {
    if (!selectedConcerns[routineId]) return [];

    const chosenConcerns = selectedConcerns[routineId].map((o) => o);
    return allActiveTasks.filter((at) => chosenConcerns.includes(at.concern));
  }, [allActiveTasks, selectedConcerns]);

  const redirectWithDate = useCallback(
    ({ taskKey, page = "calendar" }: RedirectWithDateProps) => {
      const dateFrom = new Date(routine.startsAt);
      dateFrom.setHours(0, 0, 0, 0);

      const dateTo = new Date(routine.lastDate);
      dateTo.setDate(dateTo.getDate() + 1);
      dateTo.setHours(0, 0, 0, 0);

      const parts = [`dateFrom=${dateFrom.toISOString()}`, `dateTo=${dateTo.toISOString()}`];

      if (taskKey) {
        parts.push(`key=${taskKey}`);
      }

      const query = parts.join("&");

      const url = `/${page}${query ? `?${query}` : ""}`;

      router.push(url);
    },
    [routine]
  );

  const redirectToTask = useCallback((taskId: string | null) => {
    if (!taskId) return;
    router.push(`/explain/${taskId}`);
  }, []);

  const updateTaskStatus = useCallback(
    async (taskId: string, newStatus: string) => {
      const response = await callTheServer({
        endpoint: "updateStatusOfTasks",
        method: "POST",
        body: { taskIds: [taskId], newStatus, routineStatus, returnRoutines: true },
      });

      if (response.status === 200) {
        const { message, error } = response;

        if (error) {
          openErrorModal({ description: error });
          return;
        }

        const { routines } = message;
        console.log("routines", routines);
        if (setRoutines) setRoutines(routines);
      }
    },
    [setRoutines, status]
  );

  const handleCloneTask = (taskId: string) => {
    if (!timeZone) return;

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
          lastDate={daysFrom({ date: new Date(routine.lastDate), days: 7 })}
          onSubmit={async ({ startDate }) =>
            cloneTask({ setRoutines, startDate, taskId, timeZone })
          }
        />
      ),
      modal: "general",
      centered: true,
    });
  };

  const showSkeleton = useShowSkeleton();

  const indicatorStyles = useMemo(
    () => ({
      borderRadius: "1rem 0.25rem 0.25rem 1rem",
    }),
    []
  );

  return (
    <Skeleton
      visible={showSkeleton}
      className={classes.skeleton}
      style={focused ? { zIndex: 100 } : {}}
      ref={ref}
    >
      <Accordion.Item
        key={routine._id}
        value={routine._id || `no_value-${index}`}
        className={classes.item}
      >
        <Accordion.Control className={classes.control}>
          <Group className={classes.row}>
            <Group className={classes.title}>
              {selectedRoutineIds && (
                <Checkbox
                  readOnly
                  checked={isSelected}
                  onClickCapture={(e) => {
                    e.stopPropagation();
                    if (handleSelectRoutine) handleSelectRoutine(isSelected);
                  }}
                />
              )}
              <Indicator status={routine.status} customStyles={indicatorStyles} />
              {partIcons[part]}
              {rowLabel}
              <StatsGroup
                completed={totalCompleted}
                completionRate={completionRate}
                total={totalTotal}
              />
            </Group>

            <Group onClick={(e) => e.stopPropagation()} className={classes.selectWrapper}>
              {selectedConcerns[routineId] && (
                <InputWithCheckboxes
                  data={selectedConcerns[routineId]}
                  placeholder={`Filter tasks by concerns (${selectedConcerns[routineId].length})`}
                  defaultData={[...new Set(allActiveTasks.map((t) => t.concern))]}
                  setData={handleSelectConcern}
                  readOnly
                />
              )}
              <AccordionRowMenu
                routineId={routineId}
                routineStatus={routine.status}
                redirectWithDate={redirectWithDate}
                updateRoutineStatuses={updateRoutineStatuses}
                cloneOrRescheduleRoutines={cloneOrRescheduleRoutines}
                isSelf={isSelf}
              />
            </Group>
          </Group>
        </Accordion.Control>
        <Accordion.Panel>
          {selectedTasks.length > 0 ? (
            <>
              {selectedTasks.map((task, i) => (
                <AccordionTaskRow
                  key={i}
                  data={task}
                  isSelf={isSelf}
                  routineId={routine._id}
                  handleCloneTask={handleCloneTask}
                  openTaskDetails={openTaskDetails}
                  redirectWithDate={redirectWithDate}
                  redirectToTask={redirectToTask}
                  updateTaskStatus={updateTaskStatus}
                />
              ))}
            </>
          ) : (
            <OverlayWithText text="Nothing found" />
          )}
        </Accordion.Panel>
      </Accordion.Item>
    </Skeleton>
  );
}
