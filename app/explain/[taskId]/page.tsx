"use client";

import React, { use, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Badge, Button, Group, rem, Stack, Switch, Title } from "@mantine/core";
import { upperFirst, useShallowEffect } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import SkeletonWrapper from "@/app/SkeletonWrapper";
import ExampleContainer from "@/components/ExampleContainer";
import ExplanationContainer from "@/components/ExplanationContainer";
import PageHeader from "@/components/PageHeader";
import WaitComponent from "@/components/WaitComponent";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import checkIfAnalysisRunning from "@/functions/checkIfAnalysisRunning";
import copyTaskInstance from "@/functions/copyTaskInstance";
import fetchTaskInfo from "@/functions/fetchTaskInfo";
import updateTaskInstance, { UpdateTaskInstanceProps } from "@/functions/updateTaskInstance";
import { useRouter } from "@/helpers/custom-router";
import { formatDate } from "@/helpers/formatDate";
import { daysFrom } from "@/helpers/utils";
import { TaskStatusEnum, TaskType } from "@/types/global";
import CreateRecipeBox from "../CreateRecipeBox";
import EditTaskModal from "../EditTaskModal";
import ProofStatus from "../ProofStatus";
import SelectDateModalContent from "./SelectDateModalContent";
import classes from "./explain.module.css";

export const runtime = "edge";

type Props = {
  params: Promise<{ taskId: string }>;
};

const allowedTaskStatuses = [
  TaskStatusEnum.ACTIVE,
  TaskStatusEnum.CANCELED,
  TaskStatusEnum.COMPLETED,
];

type UpdateTaskStatusProps = {
  newStatus: TaskStatusEnum;
};

export interface HandleUpdateTaskinstanceProps extends UpdateTaskInstanceProps {
  isReschedule?: boolean;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

export default function Explain(props: Props) {
  const { taskId } = use(props.params);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { userDetails } = useContext(UserContext);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [taskInfo, setTaskInfo] = useState<TaskType | null>(null);
  const [showWaitComponent, setShowWaitComponent] = useState(false);

  const { _id: userId } = userDetails || {};
  const {
    isDish,
    startsAt,
    productTypes,
    examples,
    proofEnabled,
    completedAt,
    expiresAt,
    status,
    previousRecipe,
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
    } else if (status === TaskStatusEnum.COMPLETED) {
      return "Completed";
    }
  }, [status, completedAt, startsAt, timeExpired]);

  const productsNeeded = useMemo(
    () => (productTypes ? productTypes.map((name) => upperFirst(name)).join(", ") : ""),
    [productTypes]
  );
  const showBanner = futureStartDate || status !== TaskStatusEnum.ACTIVE;

  const switchProofUpload = async (proofEnabled: boolean, taskId?: string | null) => {
    if (!taskId) return;

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
  };

  const handleFetchTaskInfo = async (taskId: string) => {
    const newTaskInfo = await fetchTaskInfo(taskId);
    if (newTaskInfo) setTaskInfo(newTaskInfo);
  };

  const handleCloneTaskInstance = useCallback(() => {
    modals.openContextModal({
      title: (
        <Title order={5} component={"p"}>
          Choose new date
        </Title>
      ),
      size: "sm",
      classNames: { overlay: "overlay" },
      innerProps: (
        <SelectDateModalContent
          buttonText="Copy task"
          onSubmit={async ({ startDate }) =>
            copyTaskInstance({
              setTaskInfo,
              startDate,
              taskId,
              resetNewTask: true,
              returnTask: true,
            })
          }
        />
      ),
      modal: "general",
      centered: true,
    });
  }, [taskId]);

  const handleRescheduleTask = useCallback(
    async (taskId: string, startDate: Date) => {
      const body: { [key: string]: any } = {
        taskId,
        startDate,
        isVoid: true,
      };

      try {
        const response = await callTheServer({
          endpoint: "rescheduleTaskInstance",
          method: "POST",
          body,
        });

        if (response.status === 200) {
          setTaskInfo((prev: any) => ({ ...(prev || {}), startsAt: startDate }));
        }
      } catch (err) {}
    },
    [taskInfo]
  );

  const handleUpdateTaskInstance = useCallback(
    async ({
      date,
      taskId,
      isReschedule,
      isLoading,
      applyToAll,
      description,
      instruction,
      setStep,
      setIsLoading,
    }: HandleUpdateTaskinstanceProps) => {
      if (isReschedule && date) {
        await handleRescheduleTask(taskId, date);
        setStep(2);
        return;
      }
      const success = await updateTaskInstance({
        isLoading,
        setIsLoading,
        taskId,
        applyToAll,
        date,
        description,
        instruction,
      });

      if (success) {
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
    },
    []
  );

  const openEditTaskModal = useCallback(() => {
    modals.openContextModal({
      centered: true,
      modal: "general",
      size: "auto",
      classNames: { overlay: "overlay", content: classes.editModalContent },
      title: (
        <Title order={5} component={"p"}>
          Edit {taskName?.toLowerCase()}
        </Title>
      ),
      innerProps: (
        <EditTaskModal
          taskId={taskId || ""}
          taskDate={startsAt || ""}
          description={taskDescription || ""}
          instruction={taskInstruction || ""}
          updateTask={handleUpdateTaskInstance}
        />
      ),
    });
  }, [taskName, taskId, taskDescription, taskInstruction, startsAt]);

  const updateTaskStatus = async ({ newStatus }: UpdateTaskStatusProps) => {
    if (!allowedTaskStatuses.includes(newStatus)) return;

    const response = await callTheServer({
      endpoint: "updateStatusOfTaskInstance",
      method: "POST",
      body: { taskId, newStatus, returnTask: true },
    });

    if (response.status === 200) {
      setTaskInfo((prev: TaskType | null) => ({
        ...(prev as TaskType),
        status: newStatus,
      }));
    }
  };

  useEffect(() => {
    if (!taskId || !userId) return;
    handleFetchTaskInfo(taskId);

    checkIfAnalysisRunning({
      userId,
      operationKey: `createRecipe-${taskId}`,
      setShowWaitComponent,
    }).then((res) => {
      setPageLoaded(true);
    });
  }, [taskId, userId]);

  useShallowEffect(() => {
    if (!pageLoaded) return;
    if (!taskId) router.push(`/tasks?${searchParams.toString()}`);
  }, [searchParams.toString(), pageLoaded]);

  return (
    <Stack className={`${classes.container} smallPage`}>
      <SkeletonWrapper show={!taskName || !taskInfo}>
        <PageHeader
          title={
            <>
              <Title order={1} lineClamp={3}>
                <span style={{ marginRight: rem(8) }}>{taskName}</span>
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
              onError={() => {
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
                      onClick={() =>
                        updateTaskStatus({
                          newStatus:
                            taskStatus === TaskStatusEnum.ACTIVE
                              ? TaskStatusEnum.CANCELED
                              : TaskStatusEnum.ACTIVE,
                        })
                      }
                    >
                      {taskStatus === TaskStatusEnum.ACTIVE ? "Cancel" : "Activate"}
                    </Button>
                  </>
                )}
                <Button
                  size="compact-sm"
                  variant="default"
                  className={classes.actionButton}
                  onClick={handleCloneTaskInstance}
                >
                  Copy
                </Button>
              </Group>
              <ProofStatus
                selectedTask={taskInfo}
                updateTaskStatus={(newStatus: TaskStatusEnum) => {
                  updateTaskStatus({
                    newStatus,
                  });
                }}
                notStarted={!!futureStartDate}
                expiresAt={taskInfo && taskInfo.expiresAt}
              />
              <ExplanationContainer title="Description:" text={taskDescription} />
              {productsNeeded.length > 0 && (
                <ExplanationContainer title="Products needed:" text={productsNeeded} />
              )}
              {isDish && (
                <CreateRecipeBox
                  taskId={taskId}
                  recipe={previousRecipe}
                  isDisabled={status !== TaskStatusEnum.ACTIVE || timeExpired}
                  setShowWaitComponent={setShowWaitComponent}
                />
              )}
              <Stack className={classes.exampleWrapper}>
                {examples && examples.length > 0 && (
                  <ExampleContainer title="Example:" examples={examples} />
                )}
                <ExplanationContainer
                  title="Steps:"
                  text={taskInstruction}
                  customStyles={{ borderRadius: "0 0 1rem 1rem" }}
                />
              </Stack>
            </>
          )}
        </Stack>
      </SkeletonWrapper>
    </Stack>
  );
}
