import React, { memo, useCallback, useMemo } from "react";
import {
  IconArrowBackUp,
  IconCamera,
  IconCheck,
  IconEye,
  IconSquareRoundedCheck,
  IconSun,
  IconSunrise,
  IconSunset,
} from "@tabler/icons-react";
import { Button, Group, rem, RingProgress, Text, ThemeIcon } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import callTheServer from "@/functions/callTheServer";
import { useRouter } from "@/helpers/custom-router";
import modifyQuery from "@/helpers/modifyQuery";
import { TaskType } from "@/types/global";
import classes from "./ProofStatus.module.css";

type Props = {
  name: string;
  submissionId: string;
  expiresAt: string | null;
  selectedTask: TaskType | null;
  notStarted: boolean;
  dayTime?: "morning" | "noon" | "evening";
  proofEnabled?: boolean;
  setTaskInfo: React.Dispatch<React.SetStateAction<TaskType | null>>;
};

function ProofStatus({
  name,
  expiresAt,
  submissionId,
  selectedTask,
  notStarted,
  dayTime,
  setTaskInfo,
}: Props) {
  const router = useRouter();

  const { requiredSubmissions, proofEnabled, _id: taskId } = selectedTask || {};

  const relevantSubmission = useMemo(
    () => requiredSubmissions?.find((s) => s.submissionId === submissionId),
    [selectedTask]
  );

  const { proofId, isSubmitted } = relevantSubmission || {};

  const ringLabel = useMemo(
    () =>
      isSubmitted ? (
        <ThemeIcon c="green.7" variant="transparent" radius="xl" size="sm">
          <IconCheck stroke={4} className={"icon icon__small"} />
        </ThemeIcon>
      ) : (
        <Text className={classes.title}>0%</Text>
      ),
    [selectedTask]
  );

  const sections = useMemo(
    () =>
      isSubmitted
        ? [{ value: 100, color: "green.7" }]
        : [
            {
              value: 0,
              color: "gray.3",
            },
          ],
    [selectedTask]
  );

  const dayTimeIcon = useMemo(
    () =>
      dayTime === "morning" ? (
        <IconSunrise />
      ) : dayTime === "noon" ? (
        <IconSun />
      ) : dayTime === "evening" ? (
        <IconSunset />
      ) : undefined,
    [selectedTask]
  );

  const taskExpired = new Date(expiresAt || 0) < new Date();

  const buttonData = useMemo(() => {
    let label = "";
    let icon = undefined;

    if (taskExpired) {
      label = "Expired";
      icon = <IconEye className="icon" style={{ marginRight: rem(6) }} />;
    } else {
      if (isSubmitted) {
        if (proofId) {
          label = "View";
          icon = <IconEye className="icon" style={{ marginRight: rem(6) }} />;
        } else {
          label = "Undo";
          icon = <IconArrowBackUp className="icon" style={{ marginRight: rem(6) }} />;
        }
      } else {
        if (proofEnabled) {
          label = "Upload proof";
          icon = <IconCamera className="icon" style={{ marginRight: rem(6) }} />;
        } else {
          label = "Mark done";
          icon = <IconSquareRoundedCheck className="icon" style={{ marginRight: rem(6) }} />;
        }
      }
    }

    return { label, icon };
  }, [selectedTask, relevantSubmission]);

  const updateRequiredSubmission = useCallback(async () => {
    if (!taskId) return;

    try {
      if (proofEnabled) {
        const queryPayload = [{ name: "submissionName", value: name, action: "replace" }];

        if (relevantSubmission) {
          queryPayload.push({
            name: "submissionId",
            value: submissionId,
            action: "replace",
          });
        }

        const query = modifyQuery({
          params: queryPayload,
        });

        router.push(`/upload-proof/${taskId}?${query}`);
      } else {
        const response = await callTheServer({
          endpoint: "updateRequiredSubmission",
          method: "POST",
          body: {
            taskId,
            submissionId,
            isSubmitted: !isSubmitted,
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
      console.log("Error in updateRequiredSubmission: ", err);
    }
  }, [taskId, submissionId, isSubmitted, proofEnabled]);

  return (
    <Group className={classes.container}>
      <RingProgress
        size={40}
        thickness={5}
        label={ringLabel}
        classNames={{ label: classes.ringLabel }}
        sections={sections}
      />

      <Group className={classes.nameGroup}>
        <Text lineClamp={1}>{upperFirst(name)}</Text> {dayTimeIcon}
      </Group>
      <Button
        variant={"default"}
        className={classes.ctaButton}
        disabled={notStarted || taskExpired}
        onClick={updateRequiredSubmission}
      >
        {buttonData.icon}
        {buttonData.label}
      </Button>
    </Group>
  );
}

export default memo(ProofStatus);
