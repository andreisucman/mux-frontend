"use client";

import React, { use, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Badge, Button, Group, rem, Stack, Switch, Title } from "@mantine/core";
import { upperFirst, useShallowEffect } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { ChatCategoryEnum } from "@/app/diary/type";
import SkeletonWrapper from "@/app/SkeletonWrapper";
import ChatWithModal from "@/components/ChatWithModal";
import ExampleContainer from "@/components/ExampleContainer";
import ExplanationContainer from "@/components/ExplanationContainer";
import PageHeader from "@/components/PageHeader";
import SuggestionContainer from "@/components/SuggestionContainer";
import WaitComponent from "@/components/WaitComponent";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import cloneTask from "@/functions/cloneTask";
import fetchTaskInfo from "@/functions/fetchTaskInfo";
import { useRouter } from "@/helpers/custom-router";
import { formatDate } from "@/helpers/formatDate";
import { getFromLocalStorage } from "@/helpers/localStorage";
import { daysFrom } from "@/helpers/utils";
import { TaskStatusEnum, TaskType } from "@/types/global";
import CreateRecipeBox from "../CreateRecipeBox";
import EditTaskModal, { UpdateTaskProps } from "../EditTaskModal";
import ProofStatus from "../ProofStatus";
import SelectDateModalContent from "./SelectDateModalContent";
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
  const {
    isDish,
    startsAt,
    productTypes,
    example,
    proofEnabled,
    suggestions,
    completedAt,
    expiresAt,
    status,
    recipe,
    status: taskStatus,
    name: taskName,
    instruction: taskInstruction,
    description: taskDescription,
  } = taskInfo || {};

  const timeExpired = new Date() > new Date(expiresAt || 0);

  const futureStartDate = useMemo(() => {
    if (startsAt) {
      if (new Date() < new Date(startsAt || 0)) {
        return formatDate({ date: startsAt });
      }
    }
    return null;
  }, [startsAt]);

  const statusNote = useMemo(() => {
    if (!status) return;

    if (status === TaskStatusEnum.EXPIRED || timeExpired) {
      const statusString = `${upperFirst(status)} on ${formatDate({ date: startsAt || new Date() })}`;
      return statusString;
    } else if (status === TaskStatusEnum.CANCELED) {
      return "Canceled";
    } else if (status === TaskStatusEnum.INACTIVE) {
      return "Inactive";
    } else if (status === TaskStatusEnum.COMPLETED) {
      return "Completed";
    }
  }, [status, completedAt, startsAt, timeExpired]);

  const {
    name: recipeName,
    description: recipeDescription,
    instruction: recipeInstruction,
  } = recipe || {};

  const name = taskName || recipeName;
  const instruction = taskInstruction || recipeInstruction;
  const description = taskDescription || recipeDescription;

  const productsNeeded = useMemo(
    () => (productTypes ? productTypes.map((name) => upperFirst(name)).join(", ") : ""),
    [productTypes]
  );
  const showBanner = futureStartDate || status !== TaskStatusEnum.ACTIVE;
  const exampleType = recipe ? "image" : example?.type;
  const exampleUrl = recipe ? recipe.image : example?.url;

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
      applyToAll,
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
            applyToAll,
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

  const handleCloneTask = useCallback(() => {
    modals.openContextModal({
      title: (
        <Title order={5} component={"p"}>
          Choose new date
        </Title>
      ),
      size: "sm",
      innerProps: (
        <SelectDateModalContent
          buttonText="Clone task"
          onSubmit={async ({ startDate }) =>
            cloneTask({
              setTaskInfo,
              startDate,
              taskId,
              resetNewTask: true,
              returnTask: true,
              timeZone,
            })
          }
        />
      ),
      modal: "general",
      centered: true,
    });
  }, [taskId, timeZone]);

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
      body: { taskIds: [taskId], timeZone, newStatus, isVoid: true },
    });

    if (response.status === 200) {
      setTaskInfo((prev: TaskType | null) => ({
        ...(prev as TaskType),
        status: newStatus,
      }));
    }
  }, [taskInfo, timeZone]);

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

  return (
    <Stack className={`${classes.container} smallPage`}>
      <SkeletonWrapper show={!name || !taskInfo}>
        <PageHeader
          title={
            <>
              <Title order={1} lineClamp={3}>
                <span style={{ marginRight: rem(8) }}>{recipe?.name || name}</span>
                {showBanner && (
                  <Badge
                    style={{ transform: "translateY(-2px)" }}
                    color={
                      status === TaskStatusEnum.ACTIVE || status === TaskStatusEnum.COMPLETED
                        ? "green.7"
                        : "red.7"
                    }
                  >
                    {status === TaskStatusEnum.ACTIVE ? futureStartDate : statusNote}
                  </Badge>
                )}
              </Title>
            </>
          }
          nowrapContainer
          showReturn
        />
        <Stack flex={1} style={pageLoaded ? {} : { visibility: "hidden" }}>
          {showWaitComponent ? (
            <WaitComponent
              operationKey={`createRecipe-${taskId}`}
              description={"Creating a recipe"}
              onComplete={() => {
                handleFetchTaskInfo(taskId || "");
                setShowWaitComponent(false);
              }}
              customContainerStyles={{ margin: "unset", paddingTop: "25%" }}
            />
          ) : (
            <>
              <Group className={classes.buttonsGroup}>
                <Switch
                  label={"Enable proof"}
                  disabled={taskStatus === TaskStatusEnum.COMPLETED}
                  checked={proofEnabled || false}
                  onChange={() => switchProofUpload(!proofEnabled, taskId)}
                />
                {(taskStatus === TaskStatusEnum.ACTIVE ||
                  taskStatus === TaskStatusEnum.CANCELED) && (
                  <>
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
                      disabled={timeExpired}
                      className={classes.actionButton}
                      onClick={updateTaskStatus}
                    >
                      {taskStatus === TaskStatusEnum.ACTIVE ? "Cancel" : "Activate"}
                    </Button>
                  </>
                )}
                <Button
                  size="compact-sm"
                  variant="default"
                  className={classes.actionButton}
                  onClick={handleCloneTask}
                >
                  Clone
                </Button>
              </Group>
              <ProofStatus
                selectedTask={taskInfo}
                setTaskInfo={setTaskInfo}
                notStarted={!!futureStartDate}
                expiresAt={taskInfo && taskInfo.expiresAt}
              />
              <ExplanationContainer
                title="Description:"
                text={recipe?.description || description}
              />
              {productsNeeded.length > 0 && (
                <ExplanationContainer title="Products needed:" text={productsNeeded} />
              )}
              {isDish && (
                <CreateRecipeBox
                  taskId={taskId}
                  recipe={recipe}
                  isDisabled={status !== TaskStatusEnum.ACTIVE || timeExpired}
                  setShowWaitComponent={setShowWaitComponent}
                />
              )}
              <Stack className={classes.exampleWrapper}>
                {exampleType && exampleUrl && (
                  <ExampleContainer title="Example:" type={exampleType} url={exampleUrl} />
                )}
                <ExplanationContainer
                  title="Steps:"
                  text={recipe?.instruction || instruction}
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
                openChatKey={ChatCategoryEnum.TASK}
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
