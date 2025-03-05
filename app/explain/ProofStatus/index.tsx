import React, { memo, useCallback, useMemo } from "react";
import {
  IconArrowBackUp,
  IconCamera,
  IconCheck,
  IconEye,
  IconSquareRoundedCheck,
} from "@tabler/icons-react";
import { Button, Group, rem, RingProgress, Text, ThemeIcon } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import callTheServer from "@/functions/callTheServer";
import { useRouter } from "@/helpers/custom-router";
import modifyQuery from "@/helpers/modifyQuery";
import { TaskStatusEnum, TaskType } from "@/types/global";
import classes from "./ProofStatus.module.css";

type Props = {
  expiresAt: string | null;
  selectedTask: TaskType | null;
  notStarted: boolean;
  proofEnabled?: boolean;
  setTaskInfo: React.Dispatch<React.SetStateAction<TaskType | null>>;
};

function ProofStatus({ expiresAt, selectedTask, notStarted, setTaskInfo }: Props) {
  const router = useRouter();

  const { proofEnabled, status, proofId, name, _id: taskId } = selectedTask || {};

  const ringLabel = useMemo(
    () =>
      status === TaskStatusEnum.COMPLETED ? (
        <ThemeIcon c="green.7" variant="transparent" radius="xl" size="sm">
          <IconCheck stroke={4} className={"icon icon__small"} />
        </ThemeIcon>
      ) : (
        <></>
      ),
    [status]
  );

  const sections = useMemo(
    () =>
      status === TaskStatusEnum.COMPLETED
        ? [{ value: 100, color: "green.7" }]
        : [
            {
              value: 0,
              color: "gray.3",
            },
          ],
    [status]
  );

  const taskExpired = new Date(expiresAt || 0) < new Date();

  const buttonData = useMemo(() => {
    let label = "";
    let icon = undefined;

    if (status === TaskStatusEnum.COMPLETED) {
      if (proofId) {
        label = "View";
        icon = <IconEye className="icon" style={{ marginRight: rem(6) }} />;
      } else {
        label = "Undo";
        icon = <IconArrowBackUp className="icon" style={{ marginRight: rem(6) }} />;
      }
    } else if (taskExpired) {
      label = "Expired";
      icon = <IconEye className="icon" style={{ marginRight: rem(6) }} />;
    } else {
      if (proofEnabled) {
        label = "Upload proof";
        icon = <IconCamera className="icon" style={{ marginRight: rem(6) }} />;
      } else {
        label = "Mark done";
        icon = <IconSquareRoundedCheck className="icon" style={{ marginRight: rem(6) }} />;
      }
    }

    return { label, icon };
  }, [proofId, proofEnabled, status, taskExpired]);

  const updateSubmissionStatus = useCallback(async () => {
    if (!taskId) return;

    try {
      if (proofEnabled) {
        const queryPayload = [{ name: "submissionName", value: name, action: "replace" }];

        const query = modifyQuery({
          params: queryPayload,
        });

        router.push(`/upload-proof/${taskId}?${query}`);
      } else {
        const response = await callTheServer({
          endpoint: "updateSubmissionStatus",
          method: "POST",
          body: {
            taskId,
            status,
          },
        });

        if (response.status === 200) {
          const updatedTask = {
            ...selectedTask,
            ...response.message,
          };
          setTaskInfo(updatedTask);
        }
      }
    } catch (err) {
      console.log("Error in updateSubmissionStatus: ", err);
    }
  }, [taskId, status, proofEnabled]);

  return (
    <Group className={classes.container}>
      <RingProgress
        size={40}
        thickness={status === TaskStatusEnum.COMPLETED ? 5 : 6}
        label={ringLabel}
        classNames={{ label: classes.ringLabel }}
        sections={sections}
      />

      <Group className={classes.nameGroup}>
        <Text lineClamp={1}>{upperFirst(name || "")}</Text>
      </Group>
      <Button
        variant={"default"}
        className={classes.ctaButton}
        disabled={notStarted || taskExpired && status !== TaskStatusEnum.COMPLETED}
        onClick={updateSubmissionStatus}
      >
        {buttonData.label}
      </Button>
    </Group>
  );
}

export default memo(ProofStatus);
