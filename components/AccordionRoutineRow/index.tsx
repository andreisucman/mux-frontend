import React, { useCallback, useMemo, useState } from "react";
import cn from "classnames";
import { Accordion, Group, Skeleton } from "@mantine/core";
import { useFocusWithin } from "@mantine/hooks";
import callTheServer from "@/functions/callTheServer";
import { useRouter } from "next/navigation";
import getReadableDateInterval from "@/helpers/getReadableDateInterval";
import { partIcons } from "@/helpers/icons";
import openErrorModal from "@/helpers/openErrorModal";
import useShowSkeleton from "@/helpers/useShowSkeleton";
import { daysFrom } from "@/helpers/utils";
import { RoutineStatusEnum, RoutineType, TaskStatusEnum } from "@/types/global";
import AccordionTaskRow from "../AccordionTaskRow";
import AccordionRowMenu from "../AccordionTaskRow/AccordionRowMenu";
import InputWithCheckboxes from "../InputWithCheckboxes";
import OverlayWithText from "../OverlayWithText";
import StatsGroup from "../StatsGroup";
import classes from "./AccordionRoutineRow.module.css";

type Props = {
  routine: RoutineType;
  index: number;
  isSelf: boolean;
  selected: boolean;
  copyRoutine?: (routineId: string) => void;
  rescheduleRoutine?: (routineId: string) => void;
  updateRoutine?: (routineId: string, newStatus: string) => void;
  deleteRoutine?: (routineId: string) => void;
  setRoutines: React.Dispatch<React.SetStateAction<RoutineType[] | undefined>>;
  rescheduleTask?: (routineId: string, taskKey: string) => void;
  deleteTask?: (routineId: string, taskKey: string) => void;
  updateTask?: (routineId: string, taskKey: string, newStatus: string) => void;
  copyTask: (routineId: string, taskKey: string) => void;
  copyTaskInstance: (taskId: string) => void;
  addTaskInstance?: (taskId: string, lastDate: Date, selectedRoutineId: string) => void;
  rescheduleTaskInstance?: (taskId: string) => void;
};

export default function AccordionRoutineRow({
  routine,
  index,
  isSelf,
  selected,
  copyTask,
  deleteRoutine,
  updateRoutine,
  copyRoutine,
  rescheduleRoutine,
  deleteTask,
  updateTask,
  rescheduleTask,
  copyTaskInstance,
  setRoutines,
  addTaskInstance,
  rescheduleTaskInstance,
}: Props) {
  const { _id: routineId, concerns, part, startsAt, lastDate, allTasks } = routine;

  const router = useRouter();
  const { ref, focused } = useFocusWithin();
  const showSkeleton = useShowSkeleton();
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>(concerns);

  const rowLabel = useMemo(
    () => getReadableDateInterval(startsAt, lastDate),
    [part, startsAt, lastDate, routine]
  );

  const totalTotal = useMemo(
    () =>
      routine.allTasks.reduce(
        (a, c) =>
          a +
          c.ids.filter((obj) =>
            [TaskStatusEnum.ACTIVE, TaskStatusEnum.COMPLETED].includes(obj.status as TaskStatusEnum)
          ).length,
        0
      ),
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
    const activeTasks = allTasks.filter((at) => at.ids.some((idObj) => !idObj.deletedOn));
    return activeTasks;
  }, [selectedConcerns, routine]);

  const selectedTasks = useMemo(() => {
    return allActiveTasks.filter((at) => selectedConcerns.includes(at.concern));
  }, [allActiveTasks, selectedConcerns]);

  const redirectToTaskInstance = useCallback((taskId: string | null) => {
    if (!taskId) return;
    router.push(`/explain/${taskId}`);
  }, []);

  const handleSelectConcern = (chosenConcerns: string[]) => {
    if (chosenConcerns.length === 0) return;
    setSelectedConcerns(chosenConcerns);
  };

  const handleUpdateTaskInstance = useCallback(
    async (taskId: string, newStatus: string) => {
      const response = await callTheServer({
        endpoint: "updateStatusOfTaskInstance",
        method: "POST",
        body: { taskId, newStatus, returnRoutine: true },
      });

      if (response.status === 200) {
        const { message, error } = response;

        if (error) {
          openErrorModal({ description: error });
          return;
        }

        const { routine } = message;

        if (routine && setRoutines) {
          setRoutines((prev) => (prev || []).map((r) => (r._id === routine._id ? routine : r)));
        }
      }
    },
    [setRoutines]
  );

  const handleDeleteTaskInstance = useCallback(
    async (taskId: string) => {
      const response = await callTheServer({
        endpoint: "deleteTaskInstance",
        method: "POST",
        body: { taskId },
      });

      if (response.status === 200) {
        const { message, error } = response;

        if (error) {
          openErrorModal({ description: error });
          return;
        }

        if (message && setRoutines) {
          setRoutines((prev) =>
            prev?.filter(Boolean).map((obj) => (obj._id === message._id ? message : obj))
          );
        }
      }
    },
    [setRoutines]
  );

  const handleRescheduleTaskInstance = useCallback((taskId: string) => {
    if (!rescheduleTaskInstance) return;
    rescheduleTaskInstance(taskId);
  }, []);

  const redirectToTask = useCallback(
    ({ taskKey, page = "calendar" }: { taskKey?: string; page: "calendar" | "diary" }) => {
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

  const handleRescheduleTask = useCallback(
    (taskKey: string) => {
      if (!rescheduleTask) return;
      rescheduleTask(routine._id, taskKey);
    },
    [routine._id, typeof rescheduleTask]
  );

  const handleAddTaskInstance = useCallback(
    (taskId: string, lastDate: Date, selectedRoutineId: string) => {
      if (!addTaskInstance) return;
      addTaskInstance(taskId, lastDate, selectedRoutineId);
    },
    [typeof addTaskInstance]
  );

  const handleDeleteTask = useCallback(
    (taskKey: string) => {
      if (!deleteTask) return;
      deleteTask(routine._id, taskKey);
    },
    [routine._id, typeof deleteTask]
  );

  const handleUpdateTask = useCallback(
    (taskKey: string, newStatus: string) => {
      if (!updateTask) return;
      updateTask(routine._id, taskKey, newStatus);
    },
    [routine._id, typeof updateTask]
  );

  return (
    <Skeleton
      visible={showSkeleton}
      className={classes.skeleton}
      style={focused ? { zIndex: 2 } : {}}
      ref={ref}
    >
      <Accordion.Item
        key={routine._id}
        value={routine._id || `no_value-${index}`}
        className={cn(classes.item, {
          [classes.selected]: selected,
          [classes.canceled]: routine.status === RoutineStatusEnum.CANCELED,
        })}
      >
        <Accordion.Control className={classes.control}>
          <Group className={classes.row}>
            <Group className={classes.title}>
              {partIcons[part]}
              {rowLabel}
              <StatsGroup
                completed={totalCompleted}
                completionRate={completionRate}
                total={totalTotal}
              />
            </Group>

            <Group onClick={(e) => e.stopPropagation()} className={classes.selectWrapper}>
              {selectedConcerns.length > 0 && (
                <InputWithCheckboxes
                  data={selectedConcerns}
                  placeholder={`Filter tasks by concerns (${selectedConcerns.length})`}
                  defaultData={[...new Set(allActiveTasks.map((t) => t.concern))]}
                  setData={handleSelectConcern}
                  readOnly
                />
              )}
              <AccordionRowMenu
                routineId={routineId}
                routineStatus={routine.status}
                redirectToTask={redirectToTask}
                deleteRoutine={deleteRoutine}
                updateRoutine={updateRoutine}
                copyRoutine={copyRoutine}
                rescheduleRoutine={rescheduleRoutine}
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
                  redirectToTask={redirectToTask}
                  redirectToTaskInstance={redirectToTaskInstance}
                  copyTaskInstance={copyTaskInstance}
                  addTaskInstance={(taskId: string) =>
                    handleAddTaskInstance(
                      taskId,
                      daysFrom({ date: new Date(routine.lastDate), days: 7 }),
                      routine._id
                    )
                  }
                  deleteTaskInstance={handleDeleteTaskInstance}
                  updateTaskInstance={handleUpdateTaskInstance}
                  rescheduleTaskInstance={handleRescheduleTaskInstance}
                  rescheduleTask={handleRescheduleTask}
                  deleteTask={handleDeleteTask}
                  updateTask={handleUpdateTask}
                  copyTask={(taskKey: string) => copyTask(routine._id, taskKey)}
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
