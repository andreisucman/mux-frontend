import React from "react";
import { Button, Group } from "@mantine/core";
import { TaskStatusEnum, TaskType } from "@/types/global";
import classes from "./BulkUpdateButtons.module.css";

type Props = {
  selectedStatus: TaskStatusEnum;
  loadingType?: TaskStatusEnum;
  tasksToUpdate: TaskType[];
  updateTasks: (
    tasksToUpdate: TaskType[],
    currentStatus: TaskStatusEnum,
    newStatus: TaskStatusEnum
  ) => void;
};

export default function BulkUpdateButtons({
  selectedStatus,
  tasksToUpdate,
  loadingType,
  updateTasks,
}: Props) {
  const disableDelete =
    tasksToUpdate.length === 0 ||
    loadingType === TaskStatusEnum.DELETED ||
    loadingType === TaskStatusEnum.ACTIVE;

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
            loading={loadingType === TaskStatusEnum.DELETED}
            disabled={disableDelete}
            className={classes.button}
            onClick={() =>
              updateTasks(tasksToUpdate, TaskStatusEnum.CANCELED, TaskStatusEnum.DELETED)
            }
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
