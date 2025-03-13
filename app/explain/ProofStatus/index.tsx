import React, { memo, useMemo } from "react";
import {
  IconArrowBackUp,
  IconCamera,
  IconCheck,
  IconEye,
  IconSquareRoundedCheck,
} from "@tabler/icons-react";
import { Button, Group, rem, RingProgress, Text, ThemeIcon } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import { TaskStatusEnum, TaskType } from "@/types/global";
import classes from "./ProofStatus.module.css";

type Props = {
  expiresAt: string | null;
  selectedTask: TaskType | null;
  notStarted: boolean;
  proofEnabled?: boolean;
  updateTaskStatus: (newTaskStatus: TaskStatusEnum) => void;
};

function ProofStatus({ expiresAt, selectedTask, notStarted, updateTaskStatus }: Props) {
  const { proofEnabled, status, proofId, name } = selectedTask || {};

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
        disabled={notStarted || (taskExpired && status !== TaskStatusEnum.COMPLETED)}
        onClick={() =>
          updateTaskStatus(
            status === TaskStatusEnum.COMPLETED ? TaskStatusEnum.ACTIVE : TaskStatusEnum.COMPLETED
          )
        }
      >
        {buttonData.label}
      </Button>
    </Group>
  );
}

export default memo(ProofStatus);
