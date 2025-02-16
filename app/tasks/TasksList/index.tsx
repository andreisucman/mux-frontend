"use client";

import React, { useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { Button, Divider, Loader, Stack, Text } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import UploadOverlay from "@/components/AnalysisCarousel/UploadOverlay";
import WaitComponent from "@/components/WaitComponent";
import CreateRoutineProvider from "@/context/CreateRoutineContext";
import { UserContext } from "@/context/UserContext";
import fetchUserData from "@/functions/fetchUserData";
import saveTaskFromDescription, { HandleSaveTaskProps } from "@/functions/saveTaskFromDescription";
import { useRouter } from "@/helpers/custom-router";
import Link from "@/helpers/custom-router/patch-router/link";
import { deleteFromLocalStorage, getFromLocalStorage } from "@/helpers/localStorage";
import { TaskType } from "@/types/global";
import CreateTaskOverlay from "./CreateTaskOverlay";
import TaskRow from "./TaskRow";
import TasksButtons from "./TasksButtons";
import classes from "./TasksList.module.css";

type Props = {
  customStyles?: { [key: string]: any };
};

interface TaskTypeWithClick extends TaskType {
  onClick: () => void;
}

export default function TasksList({ customStyles }: Props) {
  const { userDetails, setUserDetails } = useContext(UserContext);

  const router = useRouter();
  const searchParams = useSearchParams();
  const [pageLoaded, setPageLoaded] = useState(false);
  const [showScanOverlay, setShowScanOverlay] = useState(false);
  const [scanOverlayButtonText, setScanOverlayButtonText] = useState("");
  const [scanOverlayMessage, setScanOverlayMessage] = useState("");

  const [displayComponent, setDisplayComponent] = useState<
    "loading" | "wait" | "empty" | "scanOverlay" | "createTaskOverlay" | "content"
  >("loading");

  const { nextScan, nextDiaryRecordAfter, tasks, _id: userId, timeZone } = userDetails || {};

  const runningAnalyses: { [key: string]: any } | null = getFromLocalStorage("runningAnalyses");
  const isAnalysisGoing = runningAnalyses?.routine;

  const canAddDiaryRecord = useMemo(() => {
    const activeTasks = tasks?.filter((task) => task.status === "active") || [];
    const datePassed =
      !nextDiaryRecordAfter ||
      (nextDiaryRecordAfter && new Date() > new Date(nextDiaryRecordAfter));

    return datePassed && tasks && tasks.length > 0 && activeTasks.length === 0;
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
    if (!nextScan) return;

    const neverScanned = nextScan.every((r) => !r.date);
    const allPassed = nextScan.every((r) => r.date && new Date() > new Date(r.date || 0));

    if (neverScanned) {
      setScanOverlayButtonText("Scan");
      setScanOverlayMessage("Scan yourself to view tasks");
    }

    if (allPassed) {
      setScanOverlayButtonText("Scan again");
      setScanOverlayMessage("It's been one week since your last scan");
    }

    setShowScanOverlay(neverScanned || allPassed);
  }, [userDetails]);

  useEffect(() => {
    if (!pageLoaded) return;
    if (!tasks) return;
    if (showScanOverlay === undefined) return;

    if (isAnalysisGoing) {
      setDisplayComponent("wait");
    } else if (showScanOverlay) {
      setDisplayComponent("scanOverlay");
    } else if (taskGroups && taskGroups.length === 0) {
      setDisplayComponent("createTaskOverlay");
    } else if (taskGroups && taskGroups.length > 0) {
      setDisplayComponent("content");
    } else if (taskGroups === undefined) {
      setDisplayComponent("loading");
    }
  }, [isAnalysisGoing, showScanOverlay, taskGroups, pageLoaded]);

  useEffect(() => setPageLoaded(true), []);

  return (
    <Stack className={classes.container} style={customStyles ? customStyles : {}}>
      <TasksButtons
        disableCreateTask={showScanOverlay}
        handleSaveTask={(props: HandleSaveTaskProps) =>
          saveTaskFromDescription({ ...props, setDisplayComponent })
        }
      />
      {displayComponent !== "loading" && (
        <CreateRoutineProvider>
          <Stack className={`${classes.content} scrollbar`}>
            {displayComponent === "scanOverlay" && (
              <UploadOverlay buttonText={scanOverlayButtonText} text={scanOverlayMessage} />
            )}
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
                customContainerStyles={{ margin: "unset", paddingTop: "15%" }}
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
