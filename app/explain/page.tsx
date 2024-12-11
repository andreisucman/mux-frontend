"use client";

import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconPencil, IconX } from "@tabler/icons-react";
import { Button, Group, rem, Skeleton, Stack, Switch, Title } from "@mantine/core";
import { useShallowEffect } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import ExampleContainer from "@/components/ExampleContainer";
import ExplanationContainer from "@/components/ExplanationContainer";
import PageHeaderWithReturn from "@/components/PageHeaderWithReturn";
import SuggestionContainer from "@/components/SuggestionContainer";
import WaitComponent from "@/components/WaitComponent";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import fetchTaskInfo from "@/functions/fetchTaskInfo";
import { useRouter } from "@/helpers/custom-router";
import getSuggestions from "@/helpers/getSuggestions";
import { getFromLocalStorage } from "@/helpers/localStorage";
import modifyQuery from "@/helpers/modifyQuery";
import setUtcMidnight from "@/helpers/setUtcMidnight";
import { daysFrom } from "@/helpers/utils";
import { RequiredSubmissionType, TaskType } from "@/types/global";
import SkeletonWrapper from "../SkeletonWrapper";
import CreateRecipeBox from "./CreateRecipeBox";
import EditTaskModal, { UpdateTaskProps } from "./EditTaskModal";
import ProofStatus from "./ProofStatus";
import classes from "./explain.module.css";

export const runtime = "edge";

export default function Explain() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userDetails } = useContext(UserContext);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [taskInfo, setTaskInfo] = useState<TaskType | null>(null);
  const [showWaitComponent, setShowWaitComponent] = useState(false);

  const taskId = searchParams.get("taskId");
  const type = searchParams.get("type") || "";

  const { timeZone } = userDetails || {};
  const {
    requiredSubmissions,
    isRecipe,
    startsAt,
    example,
    proofEnabled,
    defaultSuggestions,
    suggestions,
    key: taskKey,
    productsPersonalized,
  } = taskInfo || {};

  const required: RequiredSubmissionType[] = requiredSubmissions || [];

  const notStarted = useMemo(() => new Date() < new Date(startsAt || 0), [startsAt]);

  const finalSuggestions = useMemo(
    () => getSuggestions(suggestions, defaultSuggestions),
    [typeof suggestions, typeof defaultSuggestions]
  );

  const proofSwitchLabel = proofEnabled
    ? "Click to disable proof upload"
    : "Click to enable proof upload";

  const {
    recipe,
    status: taskStatus,
    name: taskName,
    instruction: taskInstruction,
    description: taskDescription,
  } = taskInfo || {};
  const {
    name: recipeName,
    description: recipeDescription,
    instruction: recipeInstruction,
  } = recipe || {};

  const name = taskName || recipeName;
  const instruction = taskInstruction || recipeInstruction;
  const description = taskDescription || recipeDescription;

  const switchProofUpload = useCallback(async (proofEnabled: boolean, taskId?: string | null) => {
    if (!taskId) return;

    try {
      const response = await callTheServer({
        endpoint: "updateProofUpload",
        method: "POST",
        body: {
          taskId,
          proofEnabled,
        },
      });

      if (response.status === 200) {
        const updatedTask = {
          ...taskInfo,
          proofEnabled,
        } as TaskType;

        setTaskInfo(updatedTask);
      }
    } catch (err) {
      console.log(`Error: ${err}`);
    }
  }, [taskInfo]);

  const handleFetchTaskProducts = useCallback(async (taskId: string) => {
    try {
      if (!taskId) return;
      const response = await callTheServer({
        endpoint: "getTaskProducts",
        method: "POST",
        body: { taskId },
      });

      const updatedTask = { ...taskInfo, ...response.message };
      setTaskInfo(updatedTask);
    } catch (err) {
      console.log(`Error in handleFetchTaskProducts: `, err);
    }
  }, [taskInfo]);

  const handleFetchTaskInfo = useCallback(async (taskId: string) => {
    const newTaskInfo = await fetchTaskInfo(taskId);
    if (newTaskInfo) setTaskInfo(newTaskInfo);
  }, []);

  const updateTask = useCallback(
    async ({
      date,
      taskId,
      description,
      instruction,
      isLoading,
      setIsLoading,
      setError,
      setStep,
    }: UpdateTaskProps) => {
      if (!taskId || !description || !instruction) return;
      if (!timeZone) return;
      if (isLoading) return;

      try {
        setIsLoading(true);
        setError("");

        const response = await callTheServer({
          endpoint: "editTask",
          method: "POST",
          body: {
            taskId,
            startDate: date,
            updatedDescription: description,
            updatedInstruction: instruction,
            timeZone,
          },
        });

        if (response.status === 200) {
          if (response.error) {
            setError(response.error);
          } else {
            const startsAt = setUtcMidnight({
              date: date ? date : new Date(),
              timeZone,
            });
            const expiresAt = daysFrom({ date: startsAt, days: 1 });

            const updatedTask = {
              ...taskInfo,
              description,
              instruction,
              startsAt: startsAt.toISOString(),
              expiresAt: expiresAt.toISOString(),
            } as TaskType;
            setTaskInfo(updatedTask);
            setStep(2);
          }
        }
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
      }
    },
    [timeZone, taskInfo]
  );

  const openEditTaskModal = useCallback(() => {
    modals.openContextModal({
      centered: true,
      modal: "general",
      size: "auto",
      title: (
        <Title order={5} component={"p"}>
          Edit {taskName}
        </Title>
      ),
      innerProps: (
        <EditTaskModal
          taskId={taskId || ""}
          description={taskDescription || ""}
          instruction={taskInstruction || ""}
          startsAt={startsAt || ""}
          updateTask={updateTask}
        />
      ),
      classNames: {
        content: classes.editModalContent,
      },
    });
  }, [taskName, taskId, taskDescription, taskInstruction, startsAt]);

  const handleRedirectToCalendar = useCallback(() => {
    const query = modifyQuery({
      params: [
        { name: "type", value: type, action: "replace" },
        {
          name: "key",
          value: taskKey,
          action: "replace",
        },
        {
          name: "mode",
          value: "individual",
          action: "replace",
        },
      ],
    });
    router.push(`/routines/calendar?${query}`);
  }, [type, taskKey]);

  useEffect(() => {
    if (!taskId) return;

    handleFetchTaskInfo(taskId);

    const runningAnalyses: { [key: string]: any } | null = getFromLocalStorage("runningAnalyses");

    if (runningAnalyses) {
      const isAnlysisRunning = runningAnalyses[`createRecipe-${taskId}`];
      setShowWaitComponent(isAnlysisRunning);
    }
  }, [taskId]);

  useShallowEffect(() => {
    if (!pageLoaded) return;
    if (!taskId) router.push(`/routines?${searchParams.toString()}`);
  }, [searchParams.toString(), pageLoaded]);

  useEffect(() => {
    setPageLoaded(true);
  }, []);

  return (
    <Stack className={`${classes.container} smallPage`}>
      <SkeletonWrapper>
        <PageHeaderWithReturn title={name || ""} showReturn />

        <Skeleton className="skeleton" visible={!taskInfo}>
          <Stack flex={1} style={pageLoaded ? {} : { visibility: "hidden" }}>
            {showWaitComponent ? (
              <WaitComponent
                operationKey={`createRecipe-${taskId}`}
                description={"Creating a recipe"}
                onComplete={() => handleFetchTaskInfo(taskId || "")}
              />
            ) : (
              <>
                <Switch
                  label={proofSwitchLabel}
                  disabled={taskStatus === "completed"}
                  checked={proofEnabled || false}
                  onChange={() => switchProofUpload(!proofEnabled, taskId)}
                />

                {required.map((r: RequiredSubmissionType, index) => {
                  return (
                    <ProofStatus
                      key={index}
                      name={r.name}
                      dayTime={r.dayTime}
                      submissionId={r.submissionId}
                      selectedTask={taskInfo}
                      setTaskInfo={setTaskInfo}
                      notStarted={notStarted}
                      expiresAt={taskInfo && taskInfo.expiresAt}
                    />
                  );
                })}

                <ExplanationContainer title="Description:" text={description} />
                {isRecipe && (
                  <CreateRecipeBox
                    taskId={taskId}
                    recipe={recipe}
                    setShowWaitComponent={setShowWaitComponent}
                  />
                )}
                <Stack className={classes.exampleWrapper}>
                  {example && <ExampleContainer title="Example:" example={example} />}
                  <ExplanationContainer
                    title="Steps:"
                    text={instruction}
                    customStyles={{ borderRadius: "0 0 1rem 1rem" }}
                  />
                </Stack>

                {finalSuggestions && finalSuggestions.length > 0 && (
                  <SuggestionContainer
                    title="Products:"
                    items={finalSuggestions}
                    taskKey={taskKey || ""}
                    productsPersonalized={productsPersonalized}
                    refetchTask={handleFetchTaskProducts}
                  />
                )}
                <Group className={classes.buttonsGroup}>
                  <Button
                    variant="default"
                    disabled={taskStatus === "completed"}
                    className={classes.disableButton}
                    onClick={handleRedirectToCalendar}
                  >
                    <IconX className="icon" style={{ marginRight: rem(6) }} />
                    Disable task
                  </Button>
                  <Button
                    variant="default"
                    disabled={taskStatus === "completed"}
                    className={classes.disableButton}
                    onClick={openEditTaskModal}
                  >
                    <IconPencil className="icon" style={{ marginRight: rem(6) }} />
                    Edit task
                  </Button>
                </Group>
              </>
            )}
          </Stack>
        </Skeleton>
      </SkeletonWrapper>
    </Stack>
  );
}
