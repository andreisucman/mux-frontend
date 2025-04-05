"use client";

import React, { useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { IconCircleOff } from "@tabler/icons-react";
import useSWR from "swr";
import { Carousel } from "@mantine/carousel";
import { Loader, Stack } from "@mantine/core";
import OverlayWithText from "@/components/OverlayWithText";
import WaitComponent from "@/components/WaitComponent";
import CreateRoutineProvider from "@/context/CreateRoutineContext";
import { UserContext } from "@/context/UserContext";
import checkIfAnalysisRunning from "@/functions/checkIfAnalysisRunning";
import fetchUserData from "@/functions/fetchUserData";
import saveTaskFromDescription, { HandleSaveTaskProps } from "@/functions/saveTaskFromDescription";
import { useRouter } from "@/helpers/custom-router";
import { daysFrom } from "@/helpers/utils";
import CreateTaskOverlay from "./CreateTaskOverlay";
import TasksButtons from "./TasksButtons";
import TasksSlide from "./TasksSlide";
import classes from "./TasksList.module.css";

type Props = {
  customStyles?: { [key: string]: any };
};

export default function TasksList({ customStyles }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { userDetails, setUserDetails } = useContext(UserContext);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [isAnalysisGoing, setIsAnalysisGoing] = useState(false);
  const [displayComponent, setDisplayComponent] = useState<
    "loading" | "wait" | "empty" | "createTaskOverlay" | "content"
  >("loading");

  const { tasks, _id: userId } = userDetails || {};

  const todaysTasks = useMemo(() => {
    if (!tasks || !tasks.length) return;

    const earliestStartDate = tasks[0].startsAt;

    const endOfDay = new Date(earliestStartDate);
    endOfDay.setHours(23, 59, 59, 0);

    const tasksWithOnClick = tasks
      .filter((t) => new Date(t.startsAt) < endOfDay)
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

    const activeTasks =
      tasksWithOnClick?.filter((task) => task.status === "active").map((r) => r.part) || [];

    return {
      tasks: data,
      canAddDiary: tasks && tasks.length > 0 && activeTasks.length > 0,
    };
  }, [tasks]);

  const tomorrowsTasks = useMemo(() => {
    if (!tasks || !tasks.length) return;

    const earliestStartDate = daysFrom({ date: new Date(tasks[0].startsAt), days: 1 });

    const endOfPeriod = daysFrom({ date: new Date(earliestStartDate), days: 1 });
    endOfPeriod.setHours(23, 59, 59, 0);

    const tasksWithOnClick = tasks
      .filter(
        (t) => new Date(t.startsAt) >= earliestStartDate && new Date(t.startsAt) < endOfPeriod
      )
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
  }, [tasks, todaysTasks]);

  useEffect(() => {
    if (!pageLoaded) return;
    if (!tasks) return;

    const nearestTasksCount = (todaysTasks?.tasks?.length || 0) + (tomorrowsTasks?.length || 0);

    if (isAnalysisGoing) {
      setDisplayComponent("wait");
    } else if (nearestTasksCount === 0) {
      setDisplayComponent("createTaskOverlay");
    } else if (nearestTasksCount > 0) {
      setDisplayComponent("content");
    } else if (todaysTasks?.tasks === undefined) {
      setDisplayComponent("loading");
    }
  }, [isAnalysisGoing, tasks, todaysTasks, pageLoaded]);

  useEffect(() => {
    if (!userId) return;

    checkIfAnalysisRunning({
      userId,
      operationKey: "routine",
      setShowWaitComponent: setIsAnalysisGoing,
    }).then((res) => {
      setPageLoaded(true);
    });
  }, [userId, pathname]);

  useSWR(userId, () => fetchUserData({ setUserDetails }));

  return (
    <Stack className={classes.container} style={customStyles ? customStyles : {}}>
      <TasksButtons
        disableCreateTask={displayComponent === "wait"}
        handleSaveTask={(props: HandleSaveTaskProps) =>
          saveTaskFromDescription({ ...props, setIsAnalysisGoing })
        }
      />
      {displayComponent !== "loading" && (
        <CreateRoutineProvider>
          <Stack className={`${classes.content} scrollbar`}>
            {displayComponent === "createTaskOverlay" && (
              <CreateTaskOverlay
                handleSaveTask={(props: HandleSaveTaskProps) =>
                  saveTaskFromDescription({ ...props, setIsAnalysisGoing })
                }
              />
            )}
            {displayComponent === "wait" && (
              <WaitComponent
                operationKey={"routine"}
                description="Creating your task(s)"
                onComplete={() => {
                  fetchUserData({ setUserDetails });
                  setIsAnalysisGoing(false);
                }}
                onError={() => {
                  setIsAnalysisGoing(false);
                }}
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
                  control: `carouselControl ${classes.carouselControl}`,
                  viewport: classes.viewport,
                  container: classes.container,
                }}
              >
                {todaysTasks?.tasks && (
                  <Carousel.Slide>
                    {todaysTasks.tasks && todaysTasks.tasks.length > 0 ? (
                      <TasksSlide
                        taskGroups={todaysTasks.tasks}
                        canAddDiary={!!todaysTasks.canAddDiary}
                      />
                    ) : (
                      <OverlayWithText
                        text="No tasks for today"
                        icon={<IconCircleOff className="icon" />}
                      />
                    )}
                  </Carousel.Slide>
                )}
                <Carousel.Slide>
                  {tomorrowsTasks && tomorrowsTasks.length > 0 ? (
                    <TasksSlide taskGroups={tomorrowsTasks} />
                  ) : (
                    <OverlayWithText
                      text="No tasks for tomorrow"
                      icon={<IconCircleOff className="icon" />}
                    />
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
