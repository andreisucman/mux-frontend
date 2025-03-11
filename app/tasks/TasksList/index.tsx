"use client";

import React, { useContext, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconCircleOff } from "@tabler/icons-react";
import useSWR from "swr";
import { Carousel } from "@mantine/carousel";
import { Loader, Stack } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import OverlayWithText from "@/components/OverlayWithText";
import WaitComponent from "@/components/WaitComponent";
import CreateRoutineProvider from "@/context/CreateRoutineContext";
import { UserContext } from "@/context/UserContext";
import fetchUserData from "@/functions/fetchUserData";
import saveTaskFromDescription, { HandleSaveTaskProps } from "@/functions/saveTaskFromDescription";
import { useRouter } from "@/helpers/custom-router";
import { deleteFromLocalStorage, getFromLocalStorage } from "@/helpers/localStorage";
import CreateTaskOverlay from "./CreateTaskOverlay";
import TasksButtons from "./TasksButtons";
import TasksSlide from "./TasksSlide";
import classes from "./TasksList.module.css";

type Props = {
  customStyles?: { [key: string]: any };
};

export default function TasksList({ customStyles }: Props) {
  const { userDetails, setUserDetails } = useContext(UserContext);
  const isMobile = useMediaQuery("(max-width: 36em)");

  const router = useRouter();
  const searchParams = useSearchParams();
  const [pageLoaded, setPageLoaded] = useState(false);

  const [displayComponent, setDisplayComponent] = useState<
    "loading" | "wait" | "empty" | "createTaskOverlay" | "content"
  >("loading");

  const { nextDiaryRecordAfter, tasks, _id: userId, timeZone } = userDetails || {};

  const runningAnalyses: { [key: string]: any } | null = getFromLocalStorage("runningAnalyses");
  const isAnalysisGoing = runningAnalyses?.routine;

  const canAddDiaryRecord = useMemo(() => {
    const completedTasks = tasks?.filter((task) => task.status === "completed") || [];
    const datePassed =
      !nextDiaryRecordAfter ||
      (nextDiaryRecordAfter && new Date() > new Date(nextDiaryRecordAfter));

    return datePassed && tasks && tasks.length > 0 && completedTasks.length > 0;
  }, [nextDiaryRecordAfter, tasks]);

  const todaysTasks = useMemo(() => {
    if (!tasks) return;

    const nextDay = new Date();
    nextDay.setHours(23, 59, 59, 0);

    const tasksWithOnClick = tasks
      .filter((t) => new Date(t.startsAt) < nextDay)
      .map((fTask) => ({
        ...fTask,
        onClick: () => {
          router.push(`/explain/${fTask._id}?${searchParams.toString()}`);
        },
      }));

    const concerns = [...new Set(tasks.map((t) => t.concern))];

    const data = concerns
      .map((concern) => tasksWithOnClick.filter((t) => t.concern === concern))
      .filter((gr) => gr.length);

    return data;
  }, [tasks, canAddDiaryRecord]);

  const tomorrowsTasks = useMemo(() => {
    if (!tasks) return;

    const nextDay = new Date();
    nextDay.setHours(23, 59, 59, 0);

    const tasksWithOnClick = tasks
      .filter((t) => new Date(t.startsAt) > nextDay)
      .map((fTask) => ({
        ...fTask,
        onClick: () => {
          router.push(`/explain/${fTask._id}?${searchParams.toString()}`);
        },
      }));

    const concerns = [...new Set(tasks.map((t) => t.concern))];

    const data = concerns
      .map((concern) => tasksWithOnClick.filter((t) => t.concern === concern))
      .filter((gr) => gr.length);

    return data;
  }, [tasks]);

  useEffect(() => {
    if (!pageLoaded) return;
    if (!tasks) return;

    if (isAnalysisGoing) {
      setDisplayComponent("wait");
    } else if (todaysTasks && todaysTasks.length === 0) {
      setDisplayComponent("createTaskOverlay");
    } else if (todaysTasks && todaysTasks.length > 0) {
      setDisplayComponent("content");
    } else if (todaysTasks === undefined) {
      setDisplayComponent("loading");
    }
  }, [isAnalysisGoing, todaysTasks, pageLoaded]);

  useEffect(() => setPageLoaded(true), []);
  useSWR(userId, () => fetchUserData({ setUserDetails }));

  return (
    <Stack className={classes.container} style={customStyles ? customStyles : {}}>
      <TasksButtons
        disableCreateTask={displayComponent === "wait"}
        handleSaveTask={(props: HandleSaveTaskProps) =>
          saveTaskFromDescription({ ...props, setDisplayComponent })
        }
      />
      {displayComponent !== "loading" && (
        <CreateRoutineProvider>
          <Stack className={`${classes.content} scrollbar`}>
            {displayComponent === "createTaskOverlay" && (
              <CreateTaskOverlay
                timeZone={timeZone}
                handleSaveTask={(props: HandleSaveTaskProps) =>
                  saveTaskFromDescription({ ...props, setDisplayComponent })
                }
              />
            )}
            {displayComponent === "wait" && (
              <WaitComponent
                operationKey={"routine"}
                description="Creating your task(s)"
                onComplete={() => {
                  fetchUserData({ setUserDetails });
                }}
                onError={() => {
                  setDisplayComponent("loading");
                  deleteFromLocalStorage("runningAnalyses", "routine");
                }}
                customContainerStyles={{ margin: "unset", paddingTop: isMobile ? "15%" : "20%" }}
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
                  control: `carouselControl ${classes.carouselControl}`,
                  viewport: classes.viewport,
                  container: classes.container,
                }}
              >
                {todaysTasks && (
                  <Carousel.Slide>
                    <TasksSlide taskGroups={todaysTasks} canAddDiaryRecord={!!canAddDiaryRecord} />
                  </Carousel.Slide>
                )}
                <Carousel.Slide>
                  {tomorrowsTasks && tomorrowsTasks.length > 0 ? (
                    <TasksSlide taskGroups={tomorrowsTasks} />
                  ) : (
                    <OverlayWithText text="No tasks for tomorrow" icon={<IconCircleOff className="icon" />} />
                  )}
                </Carousel.Slide>
              </Carousel>
            )}
          </Stack>
        </CreateRoutineProvider>
      )}
      {displayComponent === "loading" && <Loader m="0 auto" pt="15%" />}
    </Stack>
  );
}
