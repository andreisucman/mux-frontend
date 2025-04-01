"use client";

import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconCancel, IconClock, IconZzz } from "@tabler/icons-react";
import cn from "classnames";
import { Button, Group, Loader, Stack } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useShallowEffect } from "@mantine/hooks";
import SkeletonWrapper from "@/app/SkeletonWrapper";
import DateSelector from "@/components/DateSelector";
import OverlayWithText from "@/components/OverlayWithText";
import PageHeader from "@/components/PageHeader";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import { convertUTCToLocal } from "@/helpers/convertUTCToLocal";
import { useRouter } from "@/helpers/custom-router";
import { TaskStatusEnum, TaskType, UserDataType } from "@/types/global";
import BulkUpdateButtons from "./BulkUpdateButtons";
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
  timeZone: string;
};

export default function Calendar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userDetails, setUserDetails } = useContext(UserContext);

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
  const [loadingType, setLoadingType] = useState<"deleted" | "active" | "canceled" | string>();
  const [selectedTaskKey, setSelectedTaskKey] = useState<string | undefined>(
    givenTaskKey as string
  );

  const { timeZone } = userDetails || {};

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

  const changeMode = useCallback(
    (mode: string, taskKey?: string) => {
      if (!timeZone) return;
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
    [timeZone, tasks, originalTasks]
  );

  const handleChangeStatus = useCallback(
    (status: TaskStatusEnum, taskKey?: string) => {
      if (!timeZone) return;

      setSelectedStatus(status);

      loadTasks({
        status,
        key: taskKey,
        mode: mode as string,
        dateFrom,
        dateTo,
        timeZone,
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
    [timeZone, mode, selectedDate, dateFrom, dateTo]
  );

  const loadTasks = useCallback(
    async ({ dateFrom, dateTo, status, key, mode, timeZone }: LoadTasksProps) => {
      setDisplayComponent("loading");

      try {
        let endpoint = "getCalendarTasks";

        const parts = [];
        const finalStatus = status || selectedStatus;

        if (key) parts.push(`key=${key}`);
        if (mode) parts.push(`mode=${mode}`);
        if (finalStatus) parts.push(`status=${finalStatus}`);
        if (timeZone) parts.push(`timeZone=${timeZone}`);
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
    },
    []
  );

  const updateTasks = useCallback(
    async (tasksToUpdate: TaskType[], currentStatus: TaskStatusEnum, newStatus: TaskStatusEnum) => {
      if (loadingType) return;

      setLoadingType(newStatus as string);

      const response = await callTheServer({
        endpoint: "updateStatusOfTasks",
        method: "POST",
        body: { taskIds: tasksToUpdate.map((t) => t._id), timeZone, newStatus },
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
        setLoadingType(undefined);
      }
    },
    [loadingType, timeZone, tasks]
  );

  const deleteTasks = useCallback(
    async (tasksToDelete: TaskType[]) => {
      if (loadingType) return;

      setLoadingType("deleted");

      const response = await callTheServer({
        endpoint: "deleteTasks",
        method: "POST",
        body: { taskIds: tasksToDelete.map((t) => t._id), timeZone },
      });

      if (response.status === 200) {
        const newTasks = (tasks || []).filter((t) => {
          const taIds = tasksToDelete.map((ta) => ta._id);
          return !taIds.includes(t._id);
        });

        setTasks(newTasks);
        setTasksToUpdate([]);
        setLoadingType(undefined);
      }
    },
    [loadingType, timeZone, tasks]
  );

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
  }, [timeZone, originalTasks]);

  const handleShowByStatus = useCallback(
    (status: TaskStatusEnum) => {
      handleChangeStatus(status, selectedTaskKey);
      if (mode === "all") {
        setSelectedTaskKey(undefined);
        setTasksToUpdate([]);
      }
    },
    [mode, selectedTaskKey, timeZone]
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
    if (!timeZone) return;
    setTasks(undefined);

    loadTasks({
      status: selectedStatus,
      key: selectedTaskKey,
      mode: mode as string,
      dateFrom,
      dateTo,
      timeZone,
    }).then((tasks) => {
      setTasks(tasks);
      setOriginalTasks(tasks);
      setSelectedTasks(tasks);
    });
  }, [timeZone, dateFrom, dateTo, selectedStatus, mode]);

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
        isDisabled={mode === "individual"}
        children={<DateSelector />}
        nowrapTitle
        nowrapContainer
      />
      <SkeletonWrapper show={!selectedTasks}>
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

        <Group>
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
          {displayComponent === "loading" && <Loader m="0 auto" pt="15%" />}
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
                        tasksToUpdate={tasksToUpdate}
                        redirectToTask={redirectToTask}
                        selectTask={selectTask}
                        changeMode={changeMode}
                        resetMode={resetMode}
                      />
                    );
                  })}
                <div className={classes.emptyRow} />
              </Stack>
              {tasksToUpdate.length > 0 && (
                <BulkUpdateButtons
                  loadingType={loadingType}
                  selectedStatus={selectedStatus}
                  tasksToUpdate={tasksToUpdate}
                  updateTasks={updateTasks}
                  deleteTasks={deleteTasks}
                />
              )}
            </>
          )}

          {displayComponent !== "loading" && selectedTasks && selectedTasks.length === 0 && (
            <OverlayWithText icon={emptyIcon} text={`No ${selectedStatus} tasks`} />
          )}
        </Stack>
      </SkeletonWrapper>
    </Stack>
  );
}
