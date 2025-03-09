import React from "react";
import { IconBolt, IconCancel, IconDots, IconInfoCircle, IconTrash } from "@tabler/icons-react";
import { ActionIcon, Menu, rem } from "@mantine/core";
import { TaskStatusEnum } from "@/types/global";

type Props = {
  taskId: string;
  taskStatus: string;
  redirectToTask: (taskId: string) => void;
  updateTaskStatus: (taskId: string, newStatus: string) => void;
};

export default function AccordionTaskMenu({
  taskId,
  taskStatus,
  redirectToTask,
  updateTaskStatus,
}: Props) {
  return (
    <Menu
      withArrow
      styles={{
        itemLabel: {
          display: "flex",
          alignItems: "center",
          gap: 0,
        },
      }}
    >
      <Menu.Target>
        <ActionIcon component="div" variant="default" size="sm" onClick={(e) => e.stopPropagation()}>
          <IconDots className="icon icon__small" />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown onClick={(e) => e.stopPropagation()}>
        <Menu.Item onClick={() => redirectToTask(taskId)}>
          <IconInfoCircle className={`icon icon__small`} style={{ marginRight: rem(6) }} />
          See task
        </Menu.Item>
        {taskStatus === TaskStatusEnum.ACTIVE && (
          <Menu.Item onClick={() => updateTaskStatus(taskId, TaskStatusEnum.CANCELED)}>
            <IconCancel className={`icon icon__small`} style={{ marginRight: rem(6) }} />
            Cancel task
          </Menu.Item>
        )}
        {taskStatus === TaskStatusEnum.CANCELED && (
          <Menu.Item onClick={() => updateTaskStatus(taskId, TaskStatusEnum.ACTIVE)}>
            <IconBolt className={`icon icon__small`} style={{ marginRight: rem(6) }} />
            Activate task
          </Menu.Item>
        )}
        {taskStatus === TaskStatusEnum.CANCELED && (
          <Menu.Item onClick={() => updateTaskStatus(taskId, TaskStatusEnum.DELETED)}>
            <IconTrash className={`icon icon__small`} style={{ marginRight: rem(6) }} />
            Delete task
          </Menu.Item>
        )}
      </Menu.Dropdown>
    </Menu>
  );
}
