"use client";

import React, { useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { Button, Loader, Stack } from "@mantine/core";
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
import RoutineRow from "./TaskRow";
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
  const pathaname = usePathname();
  const searchParams = useSearchParams();
  const [pageLoaded, setPageLoaded] = useState(false);
  const [showScanOverlay, setShowScanOverlay] = useState(false);
  const [scanOverlayButtonText, setScanOverlayButtonText] = useState("");
  const [scanOverlayMessage, setScanOverlayMessage] = useState("");
  const [relevantTasks, setRelevantTasks] = useState<TaskTypeWithClick[]>();

  const [displayComponent, setDisplayComponent] = useState<
    "loading" | "wait" | "scanOverlay" | "createTaskOverlay" | "content"
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

  useEffect(() => {
    const relevant = tasks?.map((fTask) => ({
      ...fTask,
      onClick: () => {
        router.push(`/explain/${fTask._id}?${searchParams.toString()}`);
      },
    }));
    setRelevantTasks(relevant);
  }, [tasks, pathaname, userDetails]);

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
    } else if (relevantTasks && relevantTasks.length === 0) {
      setDisplayComponent("createTaskOverlay");
    } else if (relevantTasks && relevantTasks.length > 0) {
      setDisplayComponent("content");
    } else if (relevantTasks === undefined) {
      setDisplayComponent("loading");
    }
  }, [isAnalysisGoing, showScanOverlay, relevantTasks, pageLoaded]);

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
                  setRelevantTasks(undefined);
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
