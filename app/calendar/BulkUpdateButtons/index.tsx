import React from "react";
import { Button, Group } from "@mantine/core";
import { TaskStatusEnum, TaskType } from "@/types/global";
import classes from "./BulkUpdateButtons.module.css";

type Props = {
  selectedStatus: TaskStatusEnum;
  loadingType?: "deleted" | "active" | "canceled" | string;
  tasksToUpdate: TaskType[];
  updateTasks: (
    tasksToUpdate: TaskType[],
    currentStatus: TaskStatusEnum,
    newStatus: TaskStatusEnum
  ) => void;
  deleteTasks: (tasksToDelete: TaskType[]) => void;
};

export default function BulkUpdateButtons({
  selectedStatus,
  tasksToUpdate,
  loadingType,
  updateTasks,
  deleteTasks,
}: Props) {
  const disableDelete =
    tasksToUpdate.length === 0 || loadingType === "deleted" || loadingType === "active";

  return (
    <Group className={classes.container}>
      {selectedStatus === TaskStatusEnum.CANCELED && (
        <>
          <Button
            loading={loadingType === TaskStatusEnum.ACTIVE}
            disabled={disableDelete}
            className={classes.button}
            variant="default"
            onClick={() =>
              updateTasks(tasksToUpdate, TaskStatusEnum.CANCELED, TaskStatusEnum.ACTIVE)
            }
          >
            Activate
          </Button>
          <Button
            loading={loadingType === "deleted"}
            disabled={disableDelete}
            className={classes.button}
            onClick={() => deleteTasks(tasksToUpdate)}
          >
            Delete
          </Button>
        </>
      )}
      {selectedStatus === TaskStatusEnum.ACTIVE && (
        <Button
          className={classes.button}
          loading={loadingType === TaskStatusEnum.CANCELED}
          disabled={tasksToUpdate.length === 0 || loadingType === TaskStatusEnum.CANCELED}
          onClick={() => updateTasks(tasksToUpdate, TaskStatusEnum.ACTIVE, TaskStatusEnum.CANCELED)}
        >
          Cancel
        </Button>
      )}
    </Group>
  );
}
