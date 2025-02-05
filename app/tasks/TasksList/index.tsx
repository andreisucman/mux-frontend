"use client";

import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { Button, Group, Loader, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import UploadOverlay from "@/components/AnalysisCarousel/UploadOverlay";
import WaitComponent from "@/components/WaitComponent";
import CreateRoutineProvider from "@/context/CreateRoutineContext";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import fetchUserData from "@/functions/fetchUserData";
import { useRouter } from "@/helpers/custom-router";
import Link from "@/helpers/custom-router/patch-router/link";
import {
  deleteFromLocalStorage,
  getFromLocalStorage,
  saveToLocalStorage,
} from "@/helpers/localStorage";
import { TaskType, TypeEnum } from "@/types/global";
import CreateTaskOverlay from "./CreateTaskOverlay";
import { HandleSaveTaskProps } from "./CreateTaskOverlay/AddATaskContainer/types";
import StreakStatus from "./StreakStatus";
import RoutineRow from "./TaskRow";
import TasksButtons from "./TasksButtons";
import classes from "./TasksList.module.css";

type Props = {
  serie?: number;
  type: string;
  disableAll?: boolean;
  customStyles?: { [key: string]: any };
};

interface TaskTypeWithClick extends TaskType {
  onClick: () => void;
}

export default function TasksList({ type, customStyles, disableAll }: Props) {
  const { userDetails, setUserDetails } = useContext(UserContext);

  const router = useRouter();
  const pathaname = usePathname();
  const searchParams = useSearchParams();
  const [pageLoaded, setPageLoaded] = useState(false);
  const [showScanOverlay, setShowScanOverlay] = useState(false);
  const [scanOverlayButtonText, setScanOverlayButtonText] = useState("");
  const [scanOverlayMessage, setScanOverlayMessage] = useState("");
  const [relevantTasks, setRelevantTasks] = useState<TaskTypeWithClick[]>();

  const [displayComponent, setDisplayComponent] = useState<
    "loading" | "wait" | "scanOverlay" | "createTaskOverlay" | "tasks"
  >("loading");

  const {
    nextScan,
    nextDiaryRecordAfter,
    tasks,
    _id: userId,
    timeZone,
    demographics,
  } = userDetails || {};
  const { sex } = demographics || {};

  const finalNextScanType = type === "head" ? type : "body";

  const relevantTypeNextScan = useMemo(
    () => nextScan?.find((obj) => obj.type === finalNextScanType),
    [nextScan?.length, finalNextScanType]
  );

  const runningAnalyses: { [key: string]: any } | null = getFromLocalStorage("runningAnalyses");
  const isAnalysisGoing = runningAnalyses?.[type];

  const taskCompletionPercent = useMemo(() => {
    if (!relevantTasks) return 0;

    const completedRelevantTasks =
      tasks?.filter((task) => task.type === type && task.status === "completed") || [];

    return Math.round((completedRelevantTasks.length / relevantTasks.length) * 100);
  }, [tasks, type]);

  const canAddDiaryRecord = useMemo(() => {
    const activeTasks =
      tasks?.filter((task) => task.type === type && task.status === "active") || [];
    const datePassed =
      !nextDiaryRecordAfter ||
      (nextDiaryRecordAfter && new Date() > new Date(nextDiaryRecordAfter));

    return datePassed && tasks && tasks.length > 0 && activeTasks.length === 0;
  }, [nextDiaryRecordAfter, tasks, type]);

  const handleSaveTask = useCallback(
    async ({
      date,
      rawTask,
      isLoading,
      frequency,
      setError,
      setIsLoading,
    }: HandleSaveTaskProps) => {
      if (isLoading) return;
      if (!rawTask) return;
      if (!userId) return;

      try {
        setIsLoading(true);
        setError("");

        const { description, instruction } = rawTask;

        const response = await callTheServer({
          endpoint: "saveTaskFromDescription",
          method: "POST",
          body: {
            sex,
            type,
            frequency,
            description,
            instruction,
            startDate: date,
            timeZone,
          },
        });

        if (response.status === 200) {
          if (response.error) {
            setError(response.error);
            setIsLoading(false);
            return;
          }

          saveToLocalStorage("runningAnalyses", { [type]: true }, "add");
          setDisplayComponent("wait");
          modals.closeAll();
        }
      } catch (err) {
        setIsLoading(false);
      }
    },
    [userId, type]
  );

  useSWR(userId, () => fetchUserData({ setUserDetails }));

  useEffect(() => {
    const relevant = tasks
      ?.filter((task) => task.type === type)
      .map((fTask) => ({
        ...fTask,
        onClick: () => {
          router.push(`/explain/${fTask._id}?${searchParams.toString()}`);
        },
      }));
    setRelevantTasks(relevant);
  }, [type, tasks, pathaname, userDetails]);

  useEffect(() => {
    if (!relevantTypeNextScan) return;

    const neverScanned = !relevantTypeNextScan.date;
    const scanDatePassed = new Date() > new Date(relevantTypeNextScan.date || 0);

    if (neverScanned) {
      setScanOverlayButtonText(`Scan ${type}`);
      setScanOverlayMessage("Scan yourself to view tasks");
    } else {
      setScanOverlayButtonText(`Scan ${type} again`);
      setScanOverlayMessage("It's been one week since your last scan");
    }

    setShowScanOverlay(neverScanned || scanDatePassed);
  }, [userDetails, type]);

  useEffect(() => {
    if (!pageLoaded) return;
    if (!tasks) return;
    if (showScanOverlay === undefined) return;

    if (isAnalysisGoing) {
      setDisplayComponent("wait");
    } else if (showScanOverlay) {
      setDisplayComponent("scanOverlay");
    } else if (relevantTasks && relevantTasks.length === 0) {
      setDisplayComponent("createTaskOverlay");
    } else if (relevantTasks && relevantTasks.length > 0) {
      setDisplayComponent("tasks");
    } else if (relevantTasks === undefined) {
      setDisplayComponent("loading");
    }
  }, [isAnalysisGoing, showScanOverlay, relevantTasks, pageLoaded]);

  useEffect(() => setPageLoaded(true), []);

  return (
    <Stack className={classes.container} style={customStyles ? customStyles : {}}>
      <Group className={classes.titleGroup}>
        <StreakStatus completionPercent={taskCompletionPercent} />
        <TasksButtons
          type={type as TypeEnum}
          disableCalendar={disableAll}
          disableCreate={
            disableAll || displayComponent === "scanOverlay" || displayComponent === "wait"
          }
          disableSuggestions={disableAll}
          disableHistory={disableAll}
          handleSaveTask={handleSaveTask}
        />
      </Group>
      {displayComponent !== "loading" && (
        <CreateRoutineProvider>
          <Stack className={classes.content}>
            {displayComponent === "scanOverlay" && (
              <UploadOverlay
                type={type as TypeEnum}
                buttonText={scanOverlayButtonText}
                text={scanOverlayMessage}
              />
            )}
            {displayComponent === "createTaskOverlay" && (
              <CreateTaskOverlay
                type={type as TypeEnum}
                timeZone={timeZone}
                handleSaveTask={handleSaveTask}
              />
            )}
            {displayComponent === "wait" && (
              <WaitComponent
                operationKey={type}
                description="Creating your task(s)"
                onComplete={() => {
                  setRelevantTasks(undefined);
                  fetchUserData({ setUserDetails });
                }}
                onError={() => {
                  setDisplayComponent("loading");
                  deleteFromLocalStorage("runningAnalyses", type || "");
                }}
                customContainerStyles={{ margin: "unset", paddingTop: "20%" }}
              />
            )}
            {displayComponent === "tasks" && (
              <Stack className={classes.scrollArea}>
                {relevantTasks && (
                  <Stack className={classes.listWrapper}>
                    {canAddDiaryRecord && (
                      <Button component={Link} href={"/diary"} c="white">
                        Add a diary note for today
                      </Button>
                    )}
                    {relevantTasks.map((record, index: number) => (
                      <RoutineRow
                        key={index}
                        icon={record.icon}
                        onClick={record.onClick}
                        description={record.description}
                        color={record.color}
                        name={record.name}
                        startsAt={record.startsAt}
                        expiresAt={record.expiresAt}
                        status={record.status}
                      />
                    ))}
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
