"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconCircleOff } from "@tabler/icons-react";
import { Carousel } from "@mantine/carousel";
import { Loader, Stack } from "@mantine/core";
import OverlayWithText from "@/components/OverlayWithText";
import WaitComponent from "@/components/WaitComponent";
import CreateRoutineProvider from "@/context/CreateRoutineContext";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import checkIfAnalysisRunning from "@/functions/checkIfAnalysisRunning";
import saveTaskFromDescription, { HandleSaveTaskProps } from "@/functions/saveTaskFromDescription";
import { useRouter } from "@/helpers/custom-router";
import { daysFrom } from "@/helpers/utils";
import { TaskType } from "@/types/global";
import { TaskWithOnClickType } from "../page";
import CreateTaskOverlay from "./CreateTaskOverlay";
import TasksButtons from "./TasksButtons";
import TasksSlide from "./TasksSlide";
import classes from "./TasksList.module.css";

type Props = {
  customStyles?: { [key: string]: any };
};

export default function TasksList({ customStyles }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userDetails } = useContext(UserContext);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [isAnalysisGoing, setIsAnalysisGoing] = useState(false);
  const [displayComponent, setDisplayComponent] = useState<
    "loading" | "wait" | "empty" | "createTaskOverlay" | "content"
  >("loading");

  const [tasks, setTasks] = useState<TaskType[]>();
  const [todaysTasksGroups, setTodaysTasksGroups] = useState<TaskWithOnClickType[][]>();
  const [tomorrowsTasksGroups, setTomorrowsTasksGroups] = useState<TaskWithOnClickType[][]>();
  const [canAddDiary, setCanAddDiary] = useState<boolean>();

  const { _id: userId } = userDetails || {};

  const getTaskClickHandler = useCallback(
    (taskId: string) => () => {
      const paramsString = searchParams.toString();
      router.push(`/explain/${taskId}${paramsString ? `?${paramsString}` : ""}`);
    },
    [router, searchParams]
  );

  const processTasks = useCallback((tasks: TaskType[]) => {
    const todayStart = tasks[0].startsAt;
    const tomorrowStart = daysFrom({ date: new Date(tasks[0].startsAt), days: 1 });

    const todayEnd = new Date(todayStart);
    todayEnd.setHours(23, 59, 59, 0);

    const tomorrowEnd = daysFrom({ date: new Date(tomorrowStart), days: 1 });
    tomorrowEnd.setHours(23, 59, 59, 0);

    const todaysTasksWithOnClick = tasks
      .filter((t) => new Date(t.startsAt) < todayEnd)
      .map((fTask) => ({
        ...fTask,
        onClick: getTaskClickHandler(fTask._id),
      }));

    const tomorrowsTasksWithOnClick = tasks
      .filter((t) => new Date(t.startsAt) >= tomorrowStart && new Date(t.startsAt) < tomorrowEnd)
      .map((fTask) => ({
        ...fTask,
        onClick: getTaskClickHandler(fTask._id),
      }));

    const todaysConcerns = [...new Set(todaysTasksWithOnClick.map((t) => t.concern))];
    const tomorrowsConcerns = [...new Set(tomorrowsTasksWithOnClick.map((t) => t.concern))];

    const todaysTasks = todaysConcerns
      .map((concern) => todaysTasksWithOnClick.filter((t) => t.concern === concern))
      .filter((gr) => gr.length);

    const tomorrowsTasks = tomorrowsConcerns
      .map((concern) => tomorrowsTasksWithOnClick.filter((t) => t.concern === concern))
      .filter((gr) => gr.length);

    const todayTasksCompleted =
      todaysTasksWithOnClick?.filter((task) => task.status === "completed").map((r) => r.part) ||
      [];

    const canAddDiary = tasks && tasks.length > 0 && todayTasksCompleted.length > 1;

    return { todaysTasks, tomorrowsTasks, canAddDiary };
  }, []);

  const fetchTasks = useCallback(async () => {
    let reply;

    try {
      const response = await callTheServer({ endpoint: "getTasks", method: "GET" });

      if (response.status === 200) {
        const tasks: TaskType[] = response.message;

        if (tasks && tasks.length > 0) {
          setTasks(tasks);
          reply = processTasks(tasks);
          setTodaysTasksGroups(reply.todaysTasks);
          setTomorrowsTasksGroups(reply.tomorrowsTasks);
          setCanAddDiary(reply.canAddDiary);
        }
      }
    } catch (err) {}
  }, []);

  const handleUpdateTasks = useCallback((response: { tasks: TaskType[] }) => {
    processTasks(response.tasks);
  }, []);

  const handleSaveTask = useCallback(
    (props: HandleSaveTaskProps) =>
      saveTaskFromDescription({ ...props, returnTasks: true, cb: handleUpdateTasks }),
    [handleUpdateTasks]
  );

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (!pageLoaded || !tasks) return;

    if (isAnalysisGoing) {
      setDisplayComponent("wait");
    } else if (tasks.length === 0) {
      setDisplayComponent("createTaskOverlay");
    } else if (tasks.length > 0) {
      setDisplayComponent("content");
    } else {
      setDisplayComponent("loading");
    }
  }, [isAnalysisGoing, todaysTasksGroups, tomorrowsTasksGroups, tasks, pageLoaded]);

  useEffect(() => {
    if (!userId) return;

    checkIfAnalysisRunning({
      userId,
      operationKey: "routine",
      setShowWaitComponent: setIsAnalysisGoing,
    }).then(() => setPageLoaded(true));
  }, [userId]);

  return (
    <Stack className={classes.container} style={customStyles ?? {}}>
      <TasksButtons
        disableCreateTask={displayComponent === "wait"}
        handleSaveTask={handleSaveTask}
      />
      {displayComponent !== "loading" && (
        <CreateRoutineProvider>
          <Stack className={`${classes.content} scrollbar`}>
            {displayComponent === "createTaskOverlay" && (
              <CreateTaskOverlay handleSaveTask={handleSaveTask} />
            )}
            {displayComponent === "wait" && (
              <WaitComponent
                operationKey="routine"
                description="Creating your task(s)"
                onComplete={() => {
                  fetchTasks();
                  setIsAnalysisGoing(false);
                }}
                onError={() => setIsAnalysisGoing(false)}
                customContainerStyles={{ margin: "unset", paddingTop: "20%" }}
              />
            )}
            {displayComponent === "content" && (
              <Carousel
                align="start"
                slideGap={16}
                slidesToScroll={1}
                classNames={{
                  root: classes.root,
                  controls: classes.controls,
                  control: `carouselControl`,
                  viewport: classes.viewport,
                  container: classes.container,
                }}
              >
                <Carousel.Slide>
                  {todaysTasksGroups && todaysTasksGroups?.length > 0 ? (
                    <TasksSlide taskGroups={todaysTasksGroups} canAddDiary={!!canAddDiary} />
                  ) : (
                    <OverlayWithText text="No tasks" icon={<IconCircleOff className="icon" />} />
                  )}
                </Carousel.Slide>
                {tomorrowsTasksGroups && tomorrowsTasksGroups?.length > 0 ? (
                  <Carousel.Slide>
                    <TasksSlide taskGroups={tomorrowsTasksGroups} />
                  </Carousel.Slide>
                ) : (
                  <></>
                )}
              </Carousel>
            )}
          </Stack>
        </CreateRoutineProvider>
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
