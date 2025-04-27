"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IconCancel, IconClock, IconZzz } from "@tabler/icons-react";
import cn from "classnames";
import { Button, Group, Loader, Stack } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useShallowEffect } from "@mantine/hooks";
import DateSelector from "@/components/DateSelector";
import OverlayWithText from "@/components/OverlayWithText";
import PageHeader from "@/components/PageHeader";
import callTheServer from "@/functions/callTheServer";
import { convertUTCToLocal } from "@/helpers/convertUTCToLocal";
import { TaskStatusEnum, TaskType } from "@/types/global";
import CalendarRow from "./CalendarRow";
import DayRenderer from "./DayRenderer";
import classes from "./calendar.module.css";

export const runtime = "edge";

type LoadTasksProps = {
  dateFrom: string | null;
  dateTo: string | null;
  status: string | null;
  key?: string;
  mode: string;
};

export default function Calendar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const givenTaskKey = searchParams.get("key");
  const givenMode = searchParams.get("mode");
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");

  const [displayComponent, setDisplayComponent] = useState<"loading" | "list" | "empty">("loading");
  const [selectedStatus, setSelectedStatus] = useState(TaskStatusEnum.ACTIVE);
  const [tasksToUpdate, setTasksToUpdate] = useState<TaskType[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<TaskType[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [mode, setMode] = useState(givenMode || "all");
  const [tasks, setTasks] = useState<TaskType[]>();
  const [originalTasks, setOriginalTasks] = useState<TaskType[]>();
  const [selectedTaskKey, setSelectedTaskKey] = useState<string | undefined>(
    givenTaskKey as string
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

  const dates = useMemo(() => {
    const taskList = mode === "individual" ? selectedTasks : tasks;
    if (!taskList) return [];

    return taskList
      .map((task) => {
        const date = new Date(task.startsAt);
        return `${date.getMonth()}-${date.getDate()}`;
      })
      .filter(Boolean);
  }, [mode, selectedTasks && selectedTasks.length, tasks?.length]);

  const changeMode = useCallback(
    (mode: string, taskKey?: string) => {
      setMode(mode);
      if (mode === "individual" && taskKey) {
        setSelectedTaskKey(taskKey);
        const newTasks = tasks?.filter((t) => t.key === taskKey) || [];
        setSelectedTasks(newTasks);
      } else if (mode === "all") {
        if (!originalTasks) return;
        setTasks(originalTasks);
        setSelectedTasks(originalTasks);
      }
    },
    [tasks, originalTasks]
  );

  const handleChangeStatus = useCallback(
    (status: TaskStatusEnum, taskKey?: string) => {
      setSelectedStatus(status);

      loadTasks({
        status,
        key: taskKey,
        mode: mode as string,
        dateFrom,
        dateTo,
      }).then((tasks) => {
        setTasks(tasks);
        setOriginalTasks(tasks);

        if (mode === "all") {
          let newTasks: TaskType[] = [];

          if (selectedDate) {
            const date = new Date(selectedDate || new Date());
            newTasks = getTasksOfThisDate(tasks, date, status);
          } else {
            newTasks = tasks;
          }

          setSelectedTasks(newTasks);
        } else {
          setSelectedTaskKey(taskKey);
          const newTasks = tasks?.filter((t: TaskType) => t.key === taskKey) || [];
          setSelectedTasks(newTasks);
        }
      });
    },
    [mode, selectedDate, dateFrom, dateTo]
  );

  const loadTasks = useCallback(async ({ dateFrom, dateTo, status, key, mode }: LoadTasksProps) => {
    setDisplayComponent("loading");

    try {
      let endpoint = "getCalendarTasks";

      const parts = [];
      const finalStatus = status || selectedStatus;

      if (key) parts.push(`key=${key}`);
      if (mode) parts.push(`mode=${mode}`);
      if (finalStatus) parts.push(`status=${finalStatus}`);
      if (dateFrom) parts.push(`dateFrom=${dateFrom}`);
      if (dateTo) parts.push(`dateTo=${dateTo}`);

      const query = parts.join("&");

      if (query) endpoint += `?${query}`;

      const response = await callTheServer({
        endpoint,
        method: "GET",
      });

      if (response.status === 200) {
        const updated = response.message.map((record: TaskType) => {
          const { startsAt, expiresAt, ...rest } = record;
          const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
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
        setDisplayComponent("list");

        return updated;
      }
    } catch (err) {}
  }, []);

  const getTasksOfThisDate = useCallback(
    (tasks: TaskType[] | undefined, date: Date, status: string) => {
      if (!tasks) return [];

      const dateMidnight = new Date(date).setHours(0, 0, 0, 0);

      const filteredTasks = tasks.filter((t) => {
        const taskDate = new Date(t.startsAt);

        const dateCoincides = taskDate.toISOString() === new Date(dateMidnight).toISOString();
        const statusCoincides = status === t.status;

        return dateCoincides && statusCoincides;
      });

      return filteredTasks;
    },
    []
  );

  const handleSelectDate = useCallback(
    (date: Date | null) => {
      if (!date) return;
      setTasksToUpdate([]);

      const isSameDate = date.toDateString() === selectedDate?.toDateString();

      const newDate = date ? new Date(date) : new Date();

      let newTasks: TaskType[] = [];

      if (isSameDate) {
        if (tasks) {
          newTasks = tasks;
        }
      } else {
        newTasks = getTasksOfThisDate(tasks, newDate, selectedStatus);
      }

      setSelectedDate(isSameDate ? null : newDate);
      setSelectedTasks(newTasks);
    },
    [selectedStatus, selectedDate, tasks]
  );

  const resetMode = useCallback(() => {
    changeMode("all");
    setSelectedTaskKey(undefined);
    setTasksToUpdate([]);
    setSelectedDate(null);
  }, [originalTasks]);

  const handleShowByStatus = useCallback(
    (status: TaskStatusEnum) => {
      handleChangeStatus(status, selectedTaskKey);
      if (mode === "all") {
        setSelectedTaskKey(undefined);
        setTasksToUpdate([]);
      }
    },
    [mode, selectedTaskKey]
  );

  const redirectToTask = useCallback((taskId: string) => {
    router.push(`/explain/${taskId}`);
  }, []);

  const emptyIcon = useMemo(
    () =>
      selectedStatus === TaskStatusEnum.CANCELED ? (
        <IconCancel className="icon" />
      ) : selectedStatus === TaskStatusEnum.EXPIRED ? (
        <IconClock className="icon" />
      ) : (
        <IconZzz className="icon" />
      ),
    [selectedStatus]
  );

  useShallowEffect(() => {
    setTasks(undefined);

    loadTasks({
      status: selectedStatus,
      key: selectedTaskKey,
      mode: mode as string,
      dateFrom,
      dateTo,
    }).then((tasks) => {
      setTasks(tasks);
      setOriginalTasks(tasks);
      setSelectedTasks(tasks);
    });
  }, [dateFrom, dateTo, selectedStatus, mode]);

  useEffect(() => {
    if (!givenTaskKey) return;
    changeMode("individual", givenTaskKey as string);
  }, [givenTaskKey]);

  const calendarMonth = useMemo(() => {
    if (!dateFrom) return new Date();
    const date = new Date().getDate() > 1 ? new Date() : new Date(dateFrom);
    return date;
  }, [dateFrom]);

  return (
    <Stack flex={1} className="smallPage">
      <PageHeader
        title="My calendar"
        disableFilter={mode === "individual"}
        children={<DateSelector />}
        nowrapTitle
        nowrapContainer
      />
      <DatePicker
        level="month"
        m="auto"
        w="100%"
        defaultDate={calendarMonth}
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
        classNames={{ calendarHeader: classes.calendarHeader, month: classes.calendarMonth }}
      />

      <Group className={classes.buttons}>
        <Button
          size="compact-sm"
          variant="default"
          className={cn(classes.taskStatusButton, {
            [classes.selectedButton]: selectedStatus === TaskStatusEnum.ACTIVE,
          })}
          onClick={() => handleShowByStatus(TaskStatusEnum.ACTIVE)}
        >
          Active
        </Button>
        <Button
          size="compact-sm"
          variant="default"
          className={cn(classes.taskStatusButton, {
            [classes.selectedButton]: selectedStatus === TaskStatusEnum.CANCELED,
          })}
          onClick={() => handleShowByStatus(TaskStatusEnum.CANCELED)}
        >
          Canceled
        </Button>
        <Button
          size="compact-sm"
          variant="default"
          className={cn(classes.taskStatusButton, {
            [classes.selectedButton]: selectedStatus === TaskStatusEnum.EXPIRED,
          })}
          onClick={() => handleShowByStatus(TaskStatusEnum.EXPIRED)}
        >
          Expired
        </Button>
      </Group>

      <Stack className={`${classes.content} scrollbar`}>
        {displayComponent === "loading" && (
          <Loader
            m="30% auto 0"
            color="light-dark(var(--mantine-color-gray-4), var(--mantine-color-dark-4))"
          />
        )}
        {displayComponent === "list" && (
          <>
            <Stack className={classes.list}>
              {selectedTasks &&
                selectedTasks.map((record, index) => {
                  return (
                    <CalendarRow
                      key={index}
                      mode={mode as string}
                      task={record}
                      redirectToTask={redirectToTask}
                      changeMode={changeMode}
                      resetMode={resetMode}
                    />
                  );
                })}
            </Stack>
          </>
        )}

        {displayComponent !== "loading" && selectedTasks && selectedTasks.length === 0 && (
          <OverlayWithText icon={emptyIcon} text={`No ${selectedStatus} tasks`} />
        )}
      </Stack>
    </Stack>
  );
}
