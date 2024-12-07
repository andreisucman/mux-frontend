"use client";

import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  IconActivity,
  IconArrowBack,
  IconCheck,
  IconClock,
  IconX,
  IconZzz,
} from "@tabler/icons-react";
import cn from "classnames";
import { ActionIcon, Button, Group, rem, Stack } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import SkeletonWrapper from "@/app/SkeletonWrapper";
import OverlayWithText from "@/components/OverlayWithText";
import PageHeader from "@/components/PageHeader";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import { convertUTCToLocal } from "@/helpers/convertUTCToLocal";
import { TaskType, UserDataType } from "@/types/global";
import CalendarRow from "./CalendarRow";
import DayRenderer from "./DayRenderer";
import classes from "./calendar.module.css";

export const runtime = "edge";

type LoadTasksProps = {
  date?: Date;
  status?: string;
  routineId?: string;
  type?: string;
  key?: string;
  mode: string;
  timeZone: string;
};

export default function Calendar() {
  const searchParams = useSearchParams();
  const { userDetails, setUserDetails } = useContext(UserContext);

  const type = searchParams.get("type");
  const givenTaskKey = searchParams.get("key");
  const givenMode = searchParams.get("mode");

  const [selectedStatus, setSelectedStatus] = useState("active");
  const [tasksToUpdate, setTasksToUpdate] = useState<TaskType[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<TaskType[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [mode, setMode] = useState(givenMode || "all");
  const [tasks, setTasks] = useState<TaskType[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTaskKey, setSelectedTaskKey] = useState<string | undefined>(
    givenTaskKey as string
  );

  const { routines, timeZone } = userDetails || {};

  const relevantRoutine = useMemo(
    () => routines?.find((routine) => routine.type === type),
    [type, routines?.length]
  );

  const keysToBeDeleted = useMemo(
    () =>
      tasksToUpdate?.map((t) => {
        const day = new Date(t.startsAt).getDate();
        const month = new Date(t.startsAt).getMonth();
        return `${month}-${day}`;
      }),
    [tasksToUpdate.length]
  );

  const disableButton = tasksToUpdate.length === 0 || selectedStatus === "expired";

  const dates = useMemo(() => {
    const taskList = mode === "individual" ? selectedTasks : tasks;
    if (!taskList) return [];

    return taskList
      .map((task) => {
        const date = new Date(task.startsAt);
        return `${date.getMonth()}-${date.getDate()}`;
      })
      .filter(Boolean);
  }, [mode, selectedTasks.length, tasks?.length]);

  const selectTask = useCallback(
    (task: TaskType) => {
      const exists = tasksToUpdate.map((t) => t._id).includes(task._id);
      if (exists) {
        setTasksToUpdate(tasksToUpdate.filter((t) => t._id !== task._id));
      } else {
        setTasksToUpdate([...tasksToUpdate, task]);
      }
    },
    [tasksToUpdate.length]
  );

  const handleChangeMode = useCallback(
    (mode: string, taskKey?: string) => {
      if (!timeZone) return;

      setMode(mode);
      if (mode === "individual" && taskKey) {
        setSelectedTaskKey(taskKey);
        const newTasks = tasks?.filter((t) => t.key === taskKey) || [];
        setSelectedTasks(newTasks);
      } else if (mode === "all") {
        if (!relevantRoutine) return;

        loadTasks({
          status: selectedStatus,
          key: selectedTaskKey,
          type: type as string,
          routineId: relevantRoutine._id,
          mode: mode as string,
          timeZone,
        }).then((tasks) => {
          const date = new Date(selectedDate || new Date());
          const newTasks = getTasksOfThisDate(tasks, date, selectedStatus);
          setSelectedTasks(newTasks);
        });
      }
    },
    [
      timeZone,
      tasks?.length,
      relevantRoutine?._id,
      selectedStatus,
      selectedDate,
      selectedTaskKey,
      type,
    ]
  );

  const handleChangeStatus = useCallback(
    (status: string, taskKey?: string) => {
      if (!relevantRoutine) return;
      if (!timeZone) return;

      setSelectedStatus(status);

      loadTasks({
        status,
        key: taskKey,
        type: type as string,
        routineId: relevantRoutine._id,
        mode: mode as string,
        timeZone,
      }).then((tasks) => {
        setTasks(tasks);

        if (mode === "all") {
          const date = new Date(selectedDate || new Date());
          const newTasks = getTasksOfThisDate(tasks, date, status);
          setSelectedTasks(newTasks);
        } else {
          setSelectedTaskKey(taskKey);
          const newTasks = tasks?.filter((t: TaskType) => t.key === taskKey) || [];
          setSelectedTasks(newTasks);
        }
      });
    },
    [relevantRoutine?._id, timeZone, type, mode, selectedDate]
  );

  const loadTasks = useCallback(
    async ({ date, status, type, key, mode, timeZone, routineId }: LoadTasksProps) => {
      try {
        let endpoint = "getCalendarTasks";

        const parts = [];
        const finalStatus = status || selectedStatus;

        if (key) parts.push(`key=${key}`);
        if (type) parts.push(`type=${type}`);
        if (mode) parts.push(`mode=${mode}`);
        if (finalStatus) parts.push(`status=${finalStatus}`);
        if (routineId) parts.push(`routineId=${routineId}`);
        if (timeZone) parts.push(`timeZone=${timeZone}`);
        if (date) parts.push(`date=${date}`);

        const query = parts.join("&");

        if (query) endpoint += `?${query}`;

        const response = await callTheServer({
          endpoint,
          method: "GET",
        });

        if (response.status === 200) {
          const updated = response.message.map((record: TaskType) => {
            const { startsAt, expiresAt, ...rest } = record;
            return {
              ...rest,
              startsAt: convertUTCToLocal({
                utcDate: new Date(startsAt),
                timeZone,
              }),
              expiresAt: convertUTCToLocal({
                utcDate: new Date(expiresAt),
                timeZone,
              }),
            };
          });
          return updated;
        }
      } catch (err) {
        console.log("Error in loadTasks:", err);
      }
    },
    [selectedStatus]
  );

  const updateTasks = useCallback(
    async (tasksToUpdate: TaskType[], currentStatus: string) => {
      if (isLoading) return;

      try {
        setIsLoading(true);
        const newStatus = currentStatus === "active" ? "disabled" : "active";

        const response = await callTheServer({
          endpoint: "updateStatusOfTasks",
          method: "POST",
          body: { taskIds: tasksToUpdate.map((t) => t._id), newStatus },
        });

        if (response.status === 200) {
          const newTasks = (tasks || []).filter((t) => {
            const taIds = tasksToUpdate.map((ta) => ta._id);
            return !taIds.includes(t._id);
          });

          setTasks(newTasks);

          const date = new Date(selectedDate || new Date());
          const tasksOfDate = getTasksOfThisDate(newTasks, date, currentStatus);
          setSelectedTasks(tasksOfDate);
          setTasksToUpdate([]);

          setUserDetails((prev: UserDataType) => ({ ...prev, ...response.message }));
          setIsLoading(false);
        }
      } catch (err) {
        setIsLoading(false);

        console.log("Error in updateTasks:", err);
      }
    },
    [isLoading]
  );

  const getTasksOfThisDate = useCallback(
    (tasks: TaskType[] | undefined, date: Date, status: string) => {
      const dateMidnight = new Date(date).setHours(0, 0, 0, 0);

      const filteredTasks =
        tasks?.filter((t) => {
          const taskDate = new Date(t.startsAt);

          const dateCoincides = taskDate.toISOString() === new Date(dateMidnight).toISOString();
          const statusCoincides = status === t.status;

          return dateCoincides && statusCoincides;
        }) || [];

      return filteredTasks;
    },
    []
  );

  const handleSelectDate = useCallback(
    (date: Date | null) => {
      if (!date) return;
      setTasksToUpdate([]);
      const selectedDate = new Date(date) || new Date();
      const newTasks = getTasksOfThisDate(tasks, selectedDate, selectedStatus);
      setSelectedDate(selectedDate);
      setSelectedTasks(newTasks);
    },
    [selectedStatus, tasks?.length]
  );

  const emptyIcon = useMemo(
    () =>
      selectedStatus === "disabled" ? (
        <IconX className="icon" />
      ) : selectedStatus === "expired" ? (
        <IconClock className="icon" />
      ) : (
        <IconZzz className="icon" />
      ),
    [selectedStatus]
  );

  const emptyText = selectedStatus !== "active" ? `No ${selectedStatus} tasks` : "Rest day";

  const handleResetMode = useCallback(() => {
    handleChangeMode("all");
    setSelectedTaskKey(undefined);
    setTasksToUpdate([]);
  }, []);

  const handleShowByStatus = useCallback(
    (status: "active" | "expired" | "disabled") => {
      handleChangeStatus(status, selectedTaskKey);
      if (mode === "all") {
        setSelectedTaskKey(undefined);
        setTasksToUpdate([]);
      }
    },
    [mode, selectedTaskKey, timeZone, relevantRoutine?._id]
  );

  useEffect(() => {
    if (!timeZone) return;
    if (!relevantRoutine) {
      return setSelectedTasks([]);
    }

    loadTasks({
      status: selectedStatus,
      key: selectedTaskKey,
      type: type as string,
      routineId: relevantRoutine._id,
      mode: mode as string,
      timeZone,
    }).then((tasks) => {
      setTasks(tasks);

      const date = new Date(selectedDate || new Date());
      const newTasks = getTasksOfThisDate(tasks, date, "active");

      if (!givenTaskKey) {
        setSelectedTasks(newTasks);
      }
    });
  }, [relevantRoutine?._id, timeZone, type]);

  useEffect(() => {
    if (!givenTaskKey) return;

    handleChangeMode("individual", givenTaskKey as string);
  }, [givenTaskKey]);

  return (
    <Stack flex={1} className="smallPage">
      <SkeletonWrapper>
        <PageHeader
          title="Tasks calendar"
          isDisabled={mode === "individual"}
          showReturn
          hidePartDropdown
        />
        <DatePicker
          level="month"
          m="auto"
          w="100%"
          value={mode === "all" ? selectedDate : null}
          onChange={mode === "all" ? (date) => handleSelectDate(date) : undefined}
          renderDay={(date) => (
            <DayRenderer
              date={date}
              status={selectedStatus}
              mode={mode as string}
              dates={dates}
              keysToBeDeleted={keysToBeDeleted}
            />
          )}
          minDate={new Date()}
          classNames={{ calendarHeader: classes.calendarHeader, month: classes.calendarMonth }}
        />

        <Group>
          {!givenMode && mode !== "all" && (
            <ActionIcon
              variant="default"
              onClick={handleResetMode}
              className={classes.taskStatusButton}
            >
              <IconArrowBack className={"icon"} />
            </ActionIcon>
          )}
          <ActionIcon
            variant="default"
            className={cn(classes.taskStatusButton, {
              [classes.selectedButton]: selectedStatus === "active" && !!relevantRoutine,
            })}
            onClick={() => handleShowByStatus("active")}
            disabled={!relevantRoutine}
          >
            <IconActivity className={"icon"} />
          </ActionIcon>
          <ActionIcon
            variant="default"
            className={cn(classes.taskStatusButton, {
              [classes.selectedButton]: selectedStatus === "disabled" && !!relevantRoutine,
            })}
            onClick={() => handleShowByStatus("disabled")}
            disabled={!relevantRoutine}
          >
            <IconX className={"icon"} />
          </ActionIcon>
          <ActionIcon
            variant="default"
            className={cn(classes.taskStatusButton, {
              [classes.selectedButton]: selectedStatus === "expired" && !!relevantRoutine,
            })}
            onClick={() => handleShowByStatus("expired")}
            disabled={!relevantRoutine}
          >
            <IconClock className={"icon"} />
          </ActionIcon>
        </Group>

        {selectedTasks.length > 0 ? (
          <Stack className={classes.content}>
            {selectedTasks && (
              <Stack className={classes.list}>
                {selectedTasks.map((record, index) => {
                  return (
                    <CalendarRow
                      key={index}
                      mode={mode as string}
                      task={record}
                      tasksToUpdate={tasksToUpdate}
                      selectTask={selectTask}
                      handleChangeMode={handleChangeMode}
                    />
                  );
                })}
              </Stack>
            )}
          </Stack>
        ) : (
          <OverlayWithText icon={emptyIcon} text={emptyText} />
        )}

        {tasksToUpdate.length > 0 && (
          <Button
            loading={isLoading}
            disabled={disableButton || isLoading}
            onClick={() => updateTasks(tasksToUpdate, selectedStatus)}
          >
            {selectedStatus === "active" ? (
              <IconX className="icon" style={{ marginRight: rem(8) }} />
            ) : (
              <IconCheck className="icon" style={{ marginRight: rem(8) }} />
            )}
            {selectedStatus === "active" ? "Disable" : "Enable"} selected
          </Button>
        )}
      </SkeletonWrapper>
    </Stack>
  );
}
