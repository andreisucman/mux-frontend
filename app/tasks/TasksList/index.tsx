"use client";

import React, { useContext, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { Button, Divider, Loader, Stack, Text } from "@mantine/core";
import { upperFirst, useMediaQuery } from "@mantine/hooks";
import WaitComponent from "@/components/WaitComponent";
import CreateRoutineProvider from "@/context/CreateRoutineContext";
import { UserContext } from "@/context/UserContext";
import fetchUserData from "@/functions/fetchUserData";
import saveTaskFromDescription, { HandleSaveTaskProps } from "@/functions/saveTaskFromDescription";
import { useRouter } from "@/helpers/custom-router";
import Link from "@/helpers/custom-router/patch-router/link";
import { deleteFromLocalStorage, getFromLocalStorage } from "@/helpers/localStorage";
import CreateTaskOverlay from "./CreateTaskOverlay";
import TaskRow from "./TaskRow";
import TasksButtons from "./TasksButtons";
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

  useSWR(userId, () => fetchUserData({ setUserDetails }));

  const taskGroups = useMemo(() => {
    if (!tasks) return;

    const tasksWithOnClick = tasks.map((fTask) => ({
      ...fTask,
      onClick: () => {
        router.push(`/explain/${fTask._id}?${searchParams.toString()}`);
      },
    }));
    const parts = [...new Set(tasks.map((t) => t.part))];

    return parts.map((part) => tasksWithOnClick.filter((t) => t.part === part));
  }, [tasks]);

  useEffect(() => {
    if (!pageLoaded) return;
    if (!tasks) return;

    if (isAnalysisGoing) {
      setDisplayComponent("wait");
    } else if (taskGroups && taskGroups.length === 0) {
      setDisplayComponent("createTaskOverlay");
    } else if (taskGroups && taskGroups.length > 0) {
      setDisplayComponent("content");
    } else if (taskGroups === undefined) {
      setDisplayComponent("loading");
    }
  }, [isAnalysisGoing, taskGroups, pageLoaded]);

  useEffect(() => setPageLoaded(true), []);

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
                customContainerStyles={{ margin: "unset", paddingTop: isMobile ? "17.5%" : "20%" }}
              />
            )}
            {displayComponent === "content" && (
              <Stack className={classes.scrollArea}>
                {taskGroups && (
                  <Stack className={classes.listWrapper}>
                    {canAddDiaryRecord && (
                      <Button size="compact-sm" component={Link} href="/diary" c="white">
                        Add a diary note for today
                      </Button>
                    )}
                    {taskGroups.map((group, index) => {
                      const name = group[0].part;
                      return (
                        <Stack key={index}>
                          <Divider
                            label={
                              <Text c="dimmed" size="sm">
                                {upperFirst(name)}
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
                    })}
                  </Stack>
                )}
              </Stack>
            )}
          </Stack>
        </CreateRoutineProvider>
      )}
      {displayComponent === "loading" && <Loader m="0 auto" pt="15%" />}
    </Stack>
  );
}
