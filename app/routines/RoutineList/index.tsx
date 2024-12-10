"use client";

import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import useSWR from "swr";
import { Group, Skeleton, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import UploadOverlay from "@/components/AnalysisCarousel/UploadOverlay";
import WaitComponent from "@/components/WaitComponent";
import CreateRoutineProvider from "@/context/CreateRoutineContext";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import { useRouter } from "@/helpers/custom-router";
import { getFromLocalStorage, saveToLocalStorage } from "@/helpers/localStorage";
import modifyQuery from "@/helpers/modifyQuery";
import { TaskType, TypeEnum, UserDataType } from "@/types/global";
import ButtonsGroup from "./ButtonsGroup";
import CreateTaskOverlay from "./CreateTaskOverlay";
import { HandleSaveTaskProps } from "./CreateTaskOverlay/AddATaskContainer/types";
import RoutineRow from "./RoutineRow";
import StreakStatus from "./StreakStatus";
import classes from "./RoutineList.module.css";

type Props = {
  serie?: number;
  type: string;
  disableAll?: boolean;
  customStyles?: { [key: string]: any };
};

interface TaskTypeWithClick extends TaskType {
  onClick: () => void;
}

export default function RoutineList({ type, serie, customStyles, disableAll }: Props) {
  const router = useRouter();
  const pathaname = usePathname();
  const [pageLoaded, setPageLoaded] = useState(false);
  const { userDetails, setUserDetails } = useContext(UserContext);

  const [displayComponent, setDisplayComponent] = useState<
    "loading" | "wait" | "scanOverlay" | "createTaskOverlay" | "tasks"
  >("loading");

  const { nextScan, tasks, _id: userId, timeZone, demographics } = userDetails || {};
  const { sex } = demographics || {};

  const finalNextScanType = type === "head" ? type : "body";

  const relevantTypeNextScan = useMemo(
    () => nextScan?.find((obj) => obj.type === finalNextScanType),
    [nextScan?.length, finalNextScanType]
  );

  const showOverlay =
    (relevantTypeNextScan && !relevantTypeNextScan.date) ||
    (relevantTypeNextScan && new Date() > new Date(relevantTypeNextScan.date || ""));

  const runningAnalyses: { [key: string]: any } | null = getFromLocalStorage("runningAnalyses");
  const isAnalysisGoing = runningAnalyses?.[type];

  const taskCompletionPercent = useMemo(() => {
    const relevantTasks = tasks?.filter((task) => task.type === type) || [];

    const completedRelevantTasks =
      tasks?.filter((task) => task.type === type && task.status === "completed") || [];

    return Math.round(completedRelevantTasks.length / relevantTasks.length);
  }, [tasks?.length]);

  const relevantTasks: TaskTypeWithClick[] | undefined = useMemo(
    () =>
      tasks
        ?.filter((task) => task.type === type)
        .map((fTask) => ({
          ...fTask,
          onClick: () => {
            const query = modifyQuery({
              params: [{ name: "taskId", value: fTask._id, action: "replace" }],
            });
            router.push(`/explain?${query}`);
          },
        })),
    [type, pathaname, tasks && tasks.length]
  );

  const fetchLatestRoutinesAndTasks = useCallback(async () => {
    if (!userId) return;

    try {
      const response = await callTheServer({
        endpoint: `getUserData`,
        method: "GET",
      });

      if (response.status === 200) {
        setUserDetails((prev: UserDataType) => ({
          ...prev,
          ...response.message,
        }));
      }
    } catch (err) {
      console.log("Error in fetchLatestRoutinesAndTasks: ", err);
    }
  }, [userId]);

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

  useSWR(userId, fetchLatestRoutinesAndTasks);

  useEffect(() => {
    if (!pageLoaded) return;

    if (isAnalysisGoing) {
      setDisplayComponent("wait");
    } else if (showOverlay) {
      setDisplayComponent("scanOverlay");
    } else if (relevantTasks && relevantTasks.length === 0) {
      setDisplayComponent("createTaskOverlay");
    } else if (relevantTasks && relevantTasks.length > 0) {
      setDisplayComponent("tasks");
    } else if (relevantTasks === undefined) {
      setDisplayComponent("loading");
    }
  }, [isAnalysisGoing, showOverlay, relevantTasks, pageLoaded]);

  useEffect(() => setPageLoaded(true), []);

  return (
    <Stack className={classes.container} style={customStyles ? customStyles : {}}>
      <Group className={classes.titleGroup}>
        <StreakStatus completionPercent={taskCompletionPercent} serie={serie || 0} />
        <ButtonsGroup
          type={type as TypeEnum}
          disableCalendar={disableAll}
          disableCreate={disableAll || displayComponent === "scanOverlay"}
          disableSuggestions={disableAll}
          disableHistory={disableAll}
          handleSaveTask={handleSaveTask}
        />
      </Group>
      <Skeleton visible={displayComponent === "loading"} className={"skeleton"}>
        <CreateRoutineProvider>
          <Stack className={classes.content}>
            {displayComponent === "scanOverlay" && <UploadOverlay type={type as TypeEnum} />}
            {displayComponent === "createTaskOverlay" && (
              <CreateTaskOverlay type={type as TypeEnum} timeZone={timeZone} handleSaveTask={handleSaveTask} />
            )}
            {displayComponent === "wait" && (
              <Stack className={classes.waitComponentWrapper}>
                <WaitComponent
                  operationKey={type}
                  description="Creating your task(s)"
                  onComplete={() => {
                    setDisplayComponent(relevantTasks ? "tasks" : "createTaskOverlay");
                    fetchLatestRoutinesAndTasks();
                  }}
                />
              </Stack>
            )}
            {displayComponent === "tasks" && (
              <Stack className={classes.scrollArea}>
                {relevantTasks && (
                  <Stack className={classes.listWrapper}>
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
                        requiredSubmissions={record.requiredSubmissions}
                      />
                    ))}
                  </Stack>
                )}
              </Stack>
            )}
          </Stack>
        </CreateRoutineProvider>
      </Skeleton>
    </Stack>
  );
}
