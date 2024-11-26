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
import ActivateCoachButton from "./ActivateCoachButton";
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

const fakeTasks = [
  {
    _id: "673ca0e00371638611b2f06e",
    name: "Apply yogurt mask",
    concern: "dehydration",
    nearestConcerns: [
      "dehydration",
      "dry_skin",
      "uneven_texture",
      "dullness",
      "wrinkles",
      "hyperpigmentation",
      "large_pores",
    ],
    requisite: "Record how you're applying a yogurt mask.",
    restDays: 2,
    part: "face",
    userId: "6739751208956e398509eafd",
    routineId: "673c2956735094d0b405cc72",
    example: {
      type: "image",
      url: "https://myo-data.nyc3.digitaloceanspaces.com/Ms12Cg6cZdC9pc0pPIqth.jpg",
    },
    productsPersonalized: false,
    proofEnabled: true,
    status: "completed",
    key: "apply_yogurt_mask",
    description:
      "A yogurt mask can help hydrate your skin and provide a gentle exfoliation, leaving your face feeling soft and refreshed. Yogurt contains lactic acid, which helps to brighten the skin and reduce the appearance of fine lines.",
    instruction:
      "1. In a bowl, mix 2 tablespoons of plain yogurt with 1 tablespoon of honey. \n2. Apply the mixture to your clean face, avoiding the eye area. \n3. Leave it on for 15-20 minutes. \n4. Rinse off with lukewarm water and pat your face dry.",
    isCreated: true,
    color: "#bbddcf",
    type: "head",
    revisionDate: "2024-12-19T14:29:50.606Z",
    productTypes: ["yogurt mask"],
    suggestions: [],
    defaultSuggestions: [],
    icon: "🟫",
    startsAt: "2024-11-18T21:00:00.000Z",
    expiresAt: "2024-11-19T21:00:00.000Z",
    completedAt: "2024-11-18T21:00:00.000Z",
    requiredSubmissions: [
      {
        submissionId: "673ca0e00371638611b2f06d",
        name: "apply yogurt mask",
        proofId: "673cc696ff6147c5d39782ee",
        isSubmitted: true,
      },
    ],
    isRecipe: false,
    recipe: null,
    nextCanStartDate: "2024-11-21T17:10:46.795Z",
  },
  {
    _id: "673d585176ddcf40d4cac6e8",
    name: "Moisturize lips with olive oil",
    concern: "chapped_lips",
    nearestConcerns: ["chapped_lips", "dry_skin"],
    requisite: "Record how you're moisturizing your lips with olive oil.",
    restDays: 0,
    part: "mouth",
    userId: "6739751208956e398509eafd",
    routineId: "673c2956735094d0b405cc72",
    example: {
      type: "image",
      url: "https://myo-data.nyc3.digitaloceanspaces.com/4-LF1Nn7q0jWGKpPKtRlt.jpg",
    },
    productsPersonalized: false,
    proofEnabled: true,
    status: "completed",
    key: "moisturize_lips_with_olive_oil",
    description:
      "Moisturizing your lips with olive oil helps to keep them soft and hydrated, preventing dryness and chapping. Olive oil is rich in antioxidants and healthy fats, providing a protective barrier that locks in moisture and gives your lips a natural, healthy shine.",
    instruction:
      "1. Take a small amount of olive oil and apply it to your fingertips. \n2. Gently massage the oil into your lips. \n3. Allow it to absorb for a few minutes before applying any lip products.",
    isCreated: true,
    color: "#e0d9be",
    type: "head",
    revisionDate: "2024-12-20T03:32:31.273Z",
    productTypes: ["lip oil"],
    suggestions: [],
    defaultSuggestions: [],
    icon: "💋",
    startsAt: "2024-11-19T21:00:00.000Z",
    expiresAt: "2024-11-20T21:00:00.000Z",
    completedAt: "2024-11-19T21:00:00.000Z",
    requiredSubmissions: [
      {
        submissionId: "673d585176ddcf40d4cac6e7",
        name: "moisturize lips with olive oil",
        proofId: {
          $oid: "673d79a4b3651680098ef035",
        },
        isSubmitted: true,
      },
    ],
    isRecipe: false,
    recipe: null,
    nextCanStartDate: "2024-11-20T05:54:44.406Z",
  },
];

export default function RoutineList({ type, serie, customStyles, disableAll }: Props) {
  const router = useRouter();
  const pathaname = usePathname();
  const [pageLoaded, setPageLoaded] = useState(false);
  const { userDetails, setUserDetails } = useContext(UserContext);

  const [displayComponent, setDisplayComponent] = useState<
    "loading" | "wait" | "scanOverlay" | "createTaskOverlay" | "tasks"
  >("tasks");

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

  //@ts-ignore
  const relevantTasks: TaskTypeWithClick[] | undefined = useMemo(
    () =>
      fakeTasks
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
    [type, pathaname]
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

  // useEffect(() => {
  //   if (!pageLoaded) return;

  //   if (isAnalysisGoing) {
  //     setDisplayComponent("wait");
  //   } else if (showOverlay) {
  //     setDisplayComponent("scanOverlay");
  //   } else if (relevantTasks && relevantTasks.length === 0) {
  //     setDisplayComponent("createTaskOverlay");
  //   } else if (relevantTasks && relevantTasks.length > 0) {
  //     setDisplayComponent("tasks");
  //   } else if (relevantTasks === undefined) {
  //     setDisplayComponent("loading");
  //   }
  // }, [isAnalysisGoing, showOverlay, relevantTasks, pageLoaded]);

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
              <CreateTaskOverlay type={type as TypeEnum} handleSaveTask={handleSaveTask} />
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
