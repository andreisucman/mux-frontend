"use client";

import React, { use, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import cn from "classnames";
import { Badge, Button, Group, rem, Stack, Switch, Text, Title } from "@mantine/core";
import { upperFirst, useShallowEffect } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { ChatCategoryEnum } from "@/app/diary/type";
import SkeletonWrapper from "@/app/SkeletonWrapper";
import ChatWithModal from "@/components/ChatWithModal";
import ExampleContainer from "@/components/ExampleContainer";
import ExplanationContainer from "@/components/ExplanationContainer";
import PageHeaderWithReturn from "@/components/PageHeaderWithReturn";
import SuggestionContainer from "@/components/SuggestionContainer";
import WaitComponent from "@/components/WaitComponent";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import fetchTaskInfo from "@/functions/fetchTaskInfo";
import { useRouter } from "@/helpers/custom-router";
import { formatDate } from "@/helpers/formatDate";
import { getFromLocalStorage } from "@/helpers/localStorage";
import setUtcMidnight from "@/helpers/setUtcMidnight";
import { daysFrom } from "@/helpers/utils";
import { TaskStatusEnum, TaskType } from "@/types/global";
import CreateRecipeBox from "../CreateRecipeBox";
import EditTaskModal, { UpdateTaskProps } from "../EditTaskModal";
import ProofStatus from "../ProofStatus";
import classes from "./explain.module.css";

export const runtime = "edge";

type Props = {
  params: Promise<{ taskId: string }>;
};

export default function Explain(props: Props) {
  const { taskId } = use(props.params);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { userDetails } = useContext(UserContext);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [taskInfo, setTaskInfo] = useState<TaskType | null>(null);
  const [showWaitComponent, setShowWaitComponent] = useState(false);

  const { timeZone } = userDetails || {};
  const { isRecipe, startsAt, example, proofEnabled, suggestions, completedAt, expiresAt, status } =
    taskInfo || {};

  const futureStartDate = useMemo(() => {
    if (startsAt) {
      if (new Date() < new Date(startsAt || 0)) {
        return formatDate({ date: startsAt });
      }
    }
    return null;
  }, [startsAt]);

  const statusNote = useMemo(() => {
    if (status === TaskStatusEnum.EXPIRED) {
      const statusString = `${upperFirst(status)} on ${formatDate({ date: expiresAt || new Date() })}`;
      return statusString;
    } else if (status === TaskStatusEnum.CANCELED) {
      return "Canceled";
    } else if (status === TaskStatusEnum.COMPLETED) {
      return `Completed at ${formatDate({ date: completedAt || new Date() })}`;
    }
  }, [status, completedAt, expiresAt]);

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

  const switchProofUpload = useCallback(
    async (proofEnabled: boolean, taskId?: string | null) => {
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
      } catch (err) {}
    },
    [taskInfo]
  );

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
            const startsAt = new Date(date || new Date());
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
          Edit {taskName?.toLowerCase()}
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

  const updateTaskStatus = useCallback(async () => {
    const allowedTaskStatuses = [TaskStatusEnum.ACTIVE, TaskStatusEnum.CANCELED];
    if (taskInfo && taskInfo.status && !allowedTaskStatuses.includes(taskInfo.status)) return;

    const newStatus =
      taskInfo && taskInfo.status === TaskStatusEnum.ACTIVE
        ? TaskStatusEnum.CANCELED
        : TaskStatusEnum.ACTIVE;

    const response = await callTheServer({
      endpoint: "updateStatusOfTasks",
      method: "POST",
      body: { taskIds: [taskId], newStatus, isVoid: true },
    });

    if (response.status === 200) {
      setTaskInfo((prev: TaskType | null) => ({
        ...(prev as TaskType),
        status: newStatus,
      }));
    }
  }, [taskInfo]);

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
    if (!taskId) router.push(`/tasks?${searchParams.toString()}`);
  }, [searchParams.toString(), pageLoaded]);

  useEffect(() => {
    setPageLoaded(true);
  }, []);

  const showBanner = futureStartDate || status !== TaskStatusEnum.ACTIVE;

  return (
    <Stack className={`${classes.container} smallPage`}>
      <SkeletonWrapper show={!name || !taskInfo}>
        <PageHeaderWithReturn
          title={
            <>
              <span style={{ marginRight: rem(8) }}>{name}</span>
              {showBanner && (
                <Badge mt={-8} color={status !== TaskStatusEnum.ACTIVE ? "red.7" : "green.7"}>
                  {status === TaskStatusEnum.ACTIVE ? futureStartDate : statusNote}
                </Badge>
              )}
            </>
          }
          showReturn
        />
        <Stack flex={1} style={pageLoaded ? {} : { visibility: "hidden" }}>
          {showWaitComponent ? (
            <WaitComponent
              operationKey={`createRecipe-${taskId}`}
              description={"Creating a recipe"}
              onComplete={() => handleFetchTaskInfo(taskId || "")}
            />
          ) : (
            <>
              <Group className={classes.buttonsGroup}>
                <Switch
                  label={"Proof upload"}
                  disabled={taskStatus === "completed"}
                  checked={proofEnabled || false}
                  onChange={() => switchProofUpload(!proofEnabled, taskId)}
                />
                <Button
                  size="compact-sm"
                  variant="default"
                  disabled={taskStatus !== TaskStatusEnum.ACTIVE}
                  className={classes.actionButton}
                  onClick={openEditTaskModal}
                >
                  Edit
                </Button>
                <Button
                  size="compact-sm"
                  variant="default"
                  disabled={taskStatus === "deleted"}
                  className={classes.actionButton}
                  onClick={updateTaskStatus}
                >
                  {taskStatus === TaskStatusEnum.ACTIVE ? "Cancel" : "Activate"}
                </Button>
              </Group>
              <ProofStatus
                selectedTask={taskInfo}
                setTaskInfo={setTaskInfo}
                notStarted={!!futureStartDate}
                expiresAt={taskInfo && taskInfo.expiresAt}
              />
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
              {suggestions && suggestions.length > 0 && (
                <SuggestionContainer
                  title="Products:"
                  items={suggestions}
                  chatContentId={taskId}
                  disableLocalChat
                />
              )}
              <ChatWithModal
                chatCategory={ChatCategoryEnum.TASK}
                openChatKey={taskId}
                chatContentId={taskId}
                defaultVisibility="open"
                modalTitle={
                  <Title order={5} component={"p"} lineClamp={2}>
                    {name}
                  </Title>
                }
                dividerLabel={"Discuss the task"}
              />
            </>
          )}
        </Stack>
      </SkeletonWrapper>
    </Stack>
  );
}
