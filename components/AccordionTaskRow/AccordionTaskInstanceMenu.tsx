import React, { useMemo } from "react";
import {
  IconBolt,
  IconCalendarClock,
  IconCopy,
  IconDots,
  IconForbid,
  IconInfoCircle,
  IconTrash,
} from "@tabler/icons-react";
import { ActionIcon, Menu, rem } from "@mantine/core";
import { TaskStatusEnum } from "@/types/global";

type Props = {
  isSelf: boolean;
  taskId: string;
  taskStatus: string;
  copyTaskInstance: (taskId: string) => void;
  rescheduleTaskInstance?: (taskId: string) => void;
  redirectToTaskInstance?: (taskId: string) => void;
  updateTaskInstance?: (taskId: string, newStatus: string) => void;
  deleteTaskInstance?: (taskId: string) => void;
};

export default function AccordionTaskInstanceMenu({
  isSelf,
  taskId,
  taskStatus,
  copyTaskInstance,
  rescheduleTaskInstance,
  deleteTaskInstance,
  redirectToTaskInstance,
  updateTaskInstance,
}: Props) {
  return (
    <Menu
      withArrow
      disabled={!taskId}
      styles={{
        itemLabel: {
          display: "flex",
          alignItems: "center",
          gap: 0,
        },
      }}
    >
      <Menu.Target>
        <ActionIcon
          component="div"
          variant="default"
          size="sm"
          onClick={(e) => e.stopPropagation()}
          disabled={!taskId}
        >
          <IconDots size={16} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown onClick={(e) => e.stopPropagation()}>
        <Menu.Item onClick={() => copyTaskInstance(taskId)}>
          <IconCopy size={16} style={{ marginRight: rem(6) }} />
          Copy
        </Menu.Item>
        {isSelf && (
          <>
            {rescheduleTaskInstance && taskStatus === TaskStatusEnum.ACTIVE && (
              <Menu.Item onClick={() => rescheduleTaskInstance(taskId)}>
                <IconCalendarClock size={16} style={{ marginRight: rem(6) }} />
                Reschedule
              </Menu.Item>
            )}
            {redirectToTaskInstance && (
              <Menu.Item onClick={() => redirectToTaskInstance(taskId)}>
                <IconInfoCircle size={16} style={{ marginRight: rem(6) }} />
                See info
              </Menu.Item>
            )}
            {updateTaskInstance && (
              <>
                {taskStatus === TaskStatusEnum.ACTIVE && (
                  <Menu.Item onClick={() => updateTaskInstance(taskId, TaskStatusEnum.CANCELED)}>
                    <IconForbid size={16} style={{ marginRight: rem(6) }} />
                    Cancel
                  </Menu.Item>
                )}
                {taskStatus === TaskStatusEnum.CANCELED && (
                  <Menu.Item onClick={() => updateTaskInstance(taskId, TaskStatusEnum.ACTIVE)}>
                    <IconBolt size={16} style={{ marginRight: rem(6) }} />
                    Activate
                  </Menu.Item>
                )}
              </>
            )}
            {deleteTaskInstance &&
              [TaskStatusEnum.CANCELED, TaskStatusEnum.EXPIRED].includes(
                taskStatus as TaskStatusEnum
              ) && (
                <Menu.Item onClick={() => deleteTaskInstance(taskId)}>
                  <IconTrash size={16} style={{ marginRight: rem(6) }} />
                  Delete
                </Menu.Item>
              )}
          </>
        )}
      </Menu.Dropdown>
    </Menu>
  );
}
