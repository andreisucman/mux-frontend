"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { IconCircleOff } from "@tabler/icons-react";
import { Carousel } from "@mantine/carousel";
import { Loader, Stack } from "@mantine/core";
import OverlayWithText from "@/components/OverlayWithText";
import WaitComponent from "@/components/WaitComponent";
import CreateRoutineProvider from "@/context/CreateRoutineContext";
import { UserContext } from "@/context/UserContext";
import checkIfAnalysisRunning from "@/functions/checkIfAnalysisRunning";
import fetchUserData from "@/functions/fetchUserData";
import saveTaskFromDescription, { HandleSaveTaskProps } from "@/functions/saveTaskFromDescription";
import { TaskType, UserDataType } from "@/types/global";
import { TaskWithOnClickType } from "../page";
import CreateTaskOverlay from "./CreateTaskOverlay";
import TasksButtons from "./TasksButtons";
import TasksSlide from "./TasksSlide";
import classes from "./TasksList.module.css";
import useSWR from "swr";

type Props = {
  customStyles?: { [key: string]: any };
  todaysTasksGroups?: TaskWithOnClickType[][];
  tomorrowsTasksGroups?: TaskWithOnClickType[][];
  canAddDiary: boolean;
};

export default function TasksList({
  todaysTasksGroups,
  tomorrowsTasksGroups,
  canAddDiary,
  customStyles,
}: Props) {
  const { userDetails, setUserDetails } = useContext(UserContext);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [isAnalysisGoing, setIsAnalysisGoing] = useState(false);
  const [displayComponent, setDisplayComponent] = useState<
    "loading" | "wait" | "empty" | "createTaskOverlay" | "content"
  >("loading");

  const { _id: userId } = userDetails || {};

  const handleUpdateTasks = useCallback(
    (response: { tasks: TaskType[] }) => {
      setUserDetails((prev: UserDataType) => ({ ...prev, tasks: response.tasks }));
    },
    [setUserDetails]
  );

  const handleSaveTask = useCallback(
    (props: HandleSaveTaskProps) =>
      saveTaskFromDescription({ ...props, returnTasks: true, cb: handleUpdateTasks }),
    [handleUpdateTasks]
  );

  useEffect(() => {
    if (!pageLoaded || !todaysTasksGroups || !tomorrowsTasksGroups) return;

    const nearestTaskCount = todaysTasksGroups.flat().length + tomorrowsTasksGroups.flat().length;

    if (isAnalysisGoing) {
      setDisplayComponent("wait");
    } else if (nearestTaskCount === 0) {
      setDisplayComponent("createTaskOverlay");
    } else if (nearestTaskCount > 0) {
      setDisplayComponent("content");
    } else {
      setDisplayComponent("loading");
    }
  }, [isAnalysisGoing, todaysTasksGroups, tomorrowsTasksGroups, pageLoaded]);

  useEffect(() => {
    if (!userId) return;

    checkIfAnalysisRunning({
      userId,
      operationKey: "routine",
      setShowWaitComponent: setIsAnalysisGoing,
    }).then(() => setPageLoaded(true));
  }, [userId]);

  const fetcher = useCallback(() => fetchUserData({ setUserDetails }), [setUserDetails]);
  useSWR(userId, fetcher);

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
                  fetchUserData({ setUserDetails });
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
