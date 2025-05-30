"use client";

import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/helpers/custom-router";
import { IconCircleOff } from "@tabler/icons-react";
import cn from "classnames";
import { Button, Divider, Loader, Stack, Text } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import OverlayWithText from "@/components/OverlayWithText";
import WaitComponent from "@/components/WaitComponent";
import CreateRoutineContextProvider from "@/context/CreateRoutineContext";
import CreateRoutineSuggestionProvider from "@/context/CreateRoutineSuggestionContext";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import checkIfAnalysisRunning from "@/functions/checkIfAnalysisRunning";
import saveTaskFromDescription, { HandleSaveTaskProps } from "@/functions/saveTaskFromDescription";
import { getFromLocalStorage, saveToLocalStorage } from "@/helpers/localStorage";
import { TaskStatusEnum, TaskType } from "@/types/global";
import CreateTaskOverlay from "./CreateTaskOverlay";
import TaskFlters from "./TaskFilters";
import TaskRow from "./TaskRow";
import TasksButtons from "./TasksButtons";
import classes from "./TasksList.module.css";

type Props = {
  customStyles?: { [key: string]: any };
};

export default function TasksList({ customStyles }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const { userDetails } = useContext(UserContext);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [isAnalysisGoing, setIsAnalysisGoing] = useState(false);
  const [displayComponent, setDisplayComponent] = useState<
    "loading" | "wait" | "createTaskOverlay" | "content" | "resetFilters"
  >("loading");

  const [tasks, setTasks] = useState<TaskType[]>();
  const [taskList, setTaskList] = useState<TaskType[]>();
  const [hideCompletedTasks, setHideCompletedTasks] = useState<boolean>(false);
  const [hideFutureTasks, setHideFutureTasks] = useState<boolean>(false);
  const [groupTasksByConcerns, setGroupTasksByConcerns] = useState<boolean>(false);

  const savedHideFutureTasks = getFromLocalStorage("hideFutureTasks");
  const savedHideCompletedTasks = getFromLocalStorage("hideCompletedTasks");
  const savedGroupTasksByConcern = getFromLocalStorage("groupTasksByConcern");

  const { _id: userId } = userDetails || {};

  const handleResetFilters = useCallback(() => {
    setHideCompletedTasks(false);
    setHideFutureTasks(false);
    saveToLocalStorage("hideFutureTasks", false);
    saveToLocalStorage("hideCompletedTasks", false);
  }, []);

  const getTaskClickHandler = useCallback(
    (taskId: string) => () => {
      const paramsString = searchParams.toString();
      router.push(`/explain/${taskId}${paramsString ? `?${paramsString}` : ""}`);
    },
    [router, searchParams]
  );

  const getTasksAsGroups = useCallback(
    (tasks: TaskType[]) => {
      let tasksWithOnClick = tasks.map((fTask) => ({
        ...fTask,
        onClick: getTaskClickHandler(fTask._id),
      }));

      const concerns = [...new Set(tasksWithOnClick.map((t) => t.concern))];
      const taskGroups = concerns
        .map((concern) => tasksWithOnClick.filter((t) => t.concern === concern))
        .filter((gr) => gr.length);

      return taskGroups.map((group, index) => {
        const name = group?.[0]?.concern;
        const label = name.split("_").join(" ");
        return (
          <Stack key={index}>
            <Divider
              label={
                <Text c="dimmed" size="sm">
                  {upperFirst(label)}
                </Text>
              }
            />
            {group.map((t, i) => (
              <TaskRow
                key={i}
                icon={t.icon}
                onClick={t.onClick}
                description={t.description}
                color={t.color}
                name={t.name}
                startsAt={t.startsAt}
                expiresAt={t.expiresAt}
                status={t.status}
              />
            ))}
          </Stack>
        );
      });
    },
    [getTaskClickHandler]
  );

  const getTasksWthoutGroups = useCallback((tasks: TaskType[]) => {
    let tasksWithOnClick = tasks.map((fTask) => ({
      ...fTask,
      onClick: getTaskClickHandler(fTask._id),
    }));

    return tasksWithOnClick.map((t, i) => (
      <TaskRow
        key={i}
        icon={t.icon}
        onClick={t.onClick}
        description={t.description}
        color={t.color}
        name={t.name}
        startsAt={t.startsAt}
        expiresAt={t.expiresAt}
        status={t.status}
      />
    ));
  }, []);

  const canAddDiary = useMemo(() => {
    if (!tasks || tasks.length === 0) return false;

    const todayStart = tasks[0].startsAt;
    const todayEnd = new Date(todayStart);
    todayEnd.setHours(23, 59, 59, 59);

    const todayTasksCompleted = tasks.filter(
      (task) => new Date(task.startsAt) < todayEnd && task.status === TaskStatusEnum.COMPLETED
    );

    return todayTasksCompleted.length >= 1;
  }, [tasks]);

  const fetchTasks = useCallback(async (hideCompletedTasks: boolean, hideFutureTasks: boolean) => {
    try {
      const response = await callTheServer({ endpoint: "getTasks", method: "GET" });
      if (response.status === 200) {
        const tasks: TaskType[] = response.message;
        setTasks(tasks);
        handleUpdateTasks({ tasks }, hideCompletedTasks, hideFutureTasks);
      }
    } catch (err) {}
  }, []);

  const handleUpdateTasks = useCallback(
    (response: { tasks: TaskType[] }, hideCompletedTasks: boolean, hideFutureTasks: boolean) => {
      let tasks = response.tasks;
      if (hideFutureTasks) {
        const todayStart = new Date(tasks[0].startsAt);
        const todayEnd = new Date(todayStart);
        todayEnd.setHours(23, 59, 59, 59);

        tasks = tasks.filter((t) => new Date(t.startsAt) < todayEnd);
      }

      if (hideCompletedTasks) {
        tasks = tasks.filter((t) => t.status !== TaskStatusEnum.COMPLETED);
      }

      setTaskList(tasks);
    },
    []
  );

  const handleSaveTask = useCallback(
    (props: HandleSaveTaskProps) =>
      saveTaskFromDescription({
        ...props,
        returnTasks: true,
        cb: ({ tasks }) => handleUpdateTasks({ tasks }, hideCompletedTasks, hideFutureTasks),
      }),
    [handleUpdateTasks, hideCompletedTasks, hideFutureTasks, groupTasksByConcerns]
  );

  const taskItems = useMemo(() => {
    if (!taskList) return <></>;
    if (groupTasksByConcerns) {
      return getTasksAsGroups(taskList);
    } else {
      return getTasksWthoutGroups(taskList);
    }
  }, [taskList, groupTasksByConcerns]);

  useEffect(() => {
    if (code) return;
    const savedHideFutureTasks = getFromLocalStorage("hideFutureTasks");
    const savedHideCompletedTasks = getFromLocalStorage("hideCompletedTasks");
    fetchTasks(!!savedHideFutureTasks, !!savedHideCompletedTasks);
  }, [code]);

  useEffect(() => {
    setHideFutureTasks(!!savedHideFutureTasks);
    setHideCompletedTasks(!!savedHideCompletedTasks);
    setGroupTasksByConcerns(!!savedGroupTasksByConcern);
  }, []);

  useEffect(() => {
    if (!tasks) return;
    if (tasks.length === 0) {
      handleResetFilters();
      return;
    }
    handleUpdateTasks({ tasks }, hideCompletedTasks, hideFutureTasks);
  }, [tasks, hideCompletedTasks, hideFutureTasks, groupTasksByConcerns]);

  useEffect(() => {
    if (!pageLoaded || !taskList) return;

    const hasFilters = hideCompletedTasks || hideFutureTasks;

    if (isAnalysisGoing) {
      setDisplayComponent("wait");
    } else if (taskList.length === 0 && hasFilters) {
      setDisplayComponent("resetFilters");
    } else if (taskList.length === 0) {
      setDisplayComponent("createTaskOverlay");
    } else if (taskList.length > 0) {
      setDisplayComponent("content");
    } else {
      setDisplayComponent("loading");
    }
  }, [isAnalysisGoing, taskList, pageLoaded]);

  useEffect(() => {
    if (!userId) return;

    checkIfAnalysisRunning({
      userId,
      operationKey: "routine",
      setShowWaitComponent: (verdict?: boolean) => setIsAnalysisGoing(!!verdict),
    });
  }, [userId]);

  useEffect(() => {
    setPageLoaded(true);
  }, []);

  return (
    <Stack className={classes.container} style={customStyles ?? {}}>
      <TasksButtons
        disableCreateTask={displayComponent === "wait"}
        handleSaveTask={handleSaveTask}
      />
      <TaskFlters
        isDisabled={!tasks || tasks.length === 0}
        canAddDiary={canAddDiary}
        hideCompletedTasks={hideCompletedTasks}
        groupTasksByConcerns={groupTasksByConcerns}
        hideFutureTasks={hideFutureTasks}
        setGroupTasksByConcerns={setGroupTasksByConcerns}
        setHideCompletedTasks={setHideCompletedTasks}
        setHideFutureTasks={setHideFutureTasks}
      />
      {displayComponent !== "loading" && (
        <CreateRoutineSuggestionProvider>
          <Stack className={cn(classes.content, "scrollbar")}>
            {displayComponent === "resetFilters" && (
              <OverlayWithText
                text="Nothing found"
                icon={<IconCircleOff size={18} />}
                button={
                  <Button variant="default" onClick={handleResetFilters}>
                    Reset filters
                  </Button>
                }
              />
            )}
            {displayComponent === "createTaskOverlay" && (
              <CreateRoutineContextProvider>
                <CreateTaskOverlay handleSaveTask={handleSaveTask} />
              </CreateRoutineContextProvider>
            )}
            {displayComponent === "wait" && (
              <WaitComponent
                operationKey="routine"
                description="Creating your task(s)"
                onComplete={() => {
                  fetchTasks(hideCompletedTasks, hideFutureTasks);
                  setIsAnalysisGoing(false);
                }}
              />
            )}
            {displayComponent === "content" && (
              <Stack className={classes.listWrapper} mb="20%">
                {taskItems}
              </Stack>
            )}
          </Stack>
        </CreateRoutineSuggestionProvider>
      )}
      {displayComponent === "loading" && (
        <Loader
          m="0 auto"
          pt="20%"
          color="light-dark(var(--mantine-color-gray-4), var(--mantine-color-dark-4))"
        />
      )}
    </Stack>
  );
}
