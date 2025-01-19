"use client";

import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconActivity, IconClock, IconX, IconZzz } from "@tabler/icons-react";
import cn from "classnames";
import { ActionIcon, Button, Group, Loader, Stack } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useShallowEffect } from "@mantine/hooks";
import SkeletonWrapper from "@/app/SkeletonWrapper";
import DateSelector from "@/components/DateSelector";
import OverlayWithText from "@/components/OverlayWithText";
import { typeItems } from "@/components/PageHeader/data";
import PageHeaderWithReturn from "@/components/PageHeaderWithReturn";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import { convertUTCToLocal } from "@/helpers/convertUTCToLocal";
import { typeIcons } from "@/helpers/icons";
import { TaskType, UserDataType } from "@/types/global";
import CalendarRow from "./CalendarRow";
import DayRenderer from "./DayRenderer";
import classes from "./calendar.module.css";

export const runtime = "edge";

type LoadTasksProps = {
  dateFrom: string | null;
  dateTo: string | null;
  status: string | null;
  routineId?: string;
  type?: string;
  key?: string;
  mode: string;
  timeZone: string;
};

export default function Calendar() {
  const searchParams = useSearchParams();
  const { userDetails, setUserDetails } = useContext(UserContext);

  const type = searchParams.get("type") || "head";
  const givenTaskKey = searchParams.get("key");
  const givenMode = searchParams.get("mode");
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");

  const [displayComponent, setDisplayComponent] = useState<"loading" | "list" | "empty">("loading");
  const [selectedStatus, setSelectedStatus] = useState("active");
  const [tasksToUpdate, setTasksToUpdate] = useState<TaskType[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<TaskType[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [mode, setMode] = useState(givenMode || "all");
  const [tasks, setTasks] = useState<TaskType[]>();
  const [originalTasks, setOriginalTasks] = useState<TaskType[]>();
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
        if (!relevantRoutine || !originalTasks) return;
        setTasks(originalTasks);
        setSelectedTasks(originalTasks);
      }
    },
    [timeZone, tasks, originalTasks, relevantRoutine]
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
    [relevantRoutine?._id, timeZone, type, mode, selectedDate, dateFrom, dateTo]
  );

  const loadTasks = useCallback(
    async ({ dateFrom, dateTo, status, type, key, mode, timeZone, routineId }: LoadTasksProps) => {
      setDisplayComponent("loading");

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
      }
    },
    [isLoading, type]
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
    [type]
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
    [selectedStatus, selectedDate, tasks, type]
  );

  const handleResetMode = useCallback(() => {
    handleChangeMode("all");
    setSelectedTaskKey(undefined);
    setTasksToUpdate([]);
    setSelectedDate(null);
  }, [timeZone, originalTasks]);

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

  useShallowEffect(() => {
    if (!timeZone) return;
    if (!relevantRoutine) {
      setSelectedTasks([]);
      setTasks([]);
      setDisplayComponent("list");
      return;
    }
    setTasks(undefined);

    loadTasks({
      status: selectedStatus,
      key: selectedTaskKey,
      type: type as string,
      routineId: relevantRoutine._id,
      mode: mode as string,
      dateFrom,
      dateTo,
      timeZone,
    }).then((tasks) => {
      setTasks(tasks);
      setOriginalTasks(tasks);
      setSelectedTasks(tasks);
    });
  }, [relevantRoutine, timeZone, type, dateFrom, dateTo]);

  useEffect(() => {
    if (!givenTaskKey) return;
    handleChangeMode("individual", givenTaskKey as string);
  }, [givenTaskKey]);

  return (
    <Stack flex={1} className="smallPage">
      <PageHeaderWithReturn
        title="My calendar"
        isDisabled={mode === "individual"}
        filterData={typeItems}
        icons={typeIcons}
        selectedValue={type}
        children={<DateSelector />}
        showReturn
        nowrap
      />
      <SkeletonWrapper show={!selectedTasks}>
        <DatePicker
          level="month"
          m="auto"
          w="100%"
          date={new Date(dateFrom || new Date())}
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

        <Stack className={classes.content}>
          {displayComponent === "loading" && <Loader m="0 auto" pt="15%" />}
          {displayComponent === "list" && (
            <>
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
                      handleResetMode={handleResetMode}
                    />
                  );
                })}
              </Stack>
              {tasksToUpdate.length > 0 && (
                <Button
                  mt={16}
                  loading={isLoading}
                  disabled={disableButton || isLoading}
                  onClick={() => updateTasks(tasksToUpdate, selectedStatus)}
                >
                  {selectedStatus === "active" ? "Disable" : "Enable"} selected
                </Button>
              )}
            </>
          )}

          {displayComponent !== "loading" && selectedTasks.length === 0 && (
            <OverlayWithText icon={emptyIcon} text={emptyText} />
          )}
        </Stack>
      </SkeletonWrapper>
    </Stack>
  );
}
