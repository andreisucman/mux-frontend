import React from "react";
import {
  IconBolt,
  IconCalendar,
  IconCopy,
  IconDots,
  IconForbid,
  IconNotebook,
  IconTrash,
} from "@tabler/icons-react";
import { ActionIcon, Menu, rem } from "@mantine/core";
import { TaskStatusEnum } from "@/types/global";

type Props = {
  taskKey: string;
  isSelf: boolean;
  hasActiveTasks: boolean;
  allTasksCanceled: boolean;
  hasCanceledTasks: boolean;
  copyTask: (taskKey: string) => void;
  rescheduleTask?: (taskKey: string) => void;
  deleteTask?: (taskKey: string) => void;
  redirectToTask?: (props: { taskKey?: string; page: "calendar" | "diary" }) => void;
  updateTask?: (taskKey: string, newStatus: string) => void;
};

export default function AccordionTaskMenu({
  taskKey,
  isSelf,
  hasActiveTasks,
  hasCanceledTasks,
  allTasksCanceled,
  copyTask,
  rescheduleTask,
  deleteTask,
  redirectToTask,
  updateTask,
}: Props) {
  return (
    <Menu
      withArrow
      disabled={!taskKey}
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
          disabled={!taskKey}
        >
          <IconDots size={16} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown onClick={(e) => e.stopPropagation()}>
        <Menu.Item onClick={() => copyTask(taskKey)}>
          <IconCopy size={16} style={{ marginRight: rem(6) }} />
          Copy
        </Menu.Item>
        {isSelf && (
          <>
            {rescheduleTask && hasActiveTasks && (
              <Menu.Item onClick={() => rescheduleTask(taskKey)}>
                <IconCalendar size={16} style={{ marginRight: rem(6) }} />
                Reschedule
              </Menu.Item>
            )}
            {redirectToTask && (
              <>
                <Menu.Item onClick={() => redirectToTask({ taskKey, page: "calendar" })}>
                  <IconCalendar size={16} style={{ marginRight: rem(6) }} />
                  See in calendar
                </Menu.Item>
                <Menu.Item onClick={() => redirectToTask({ taskKey, page: "diary" })}>
                  <IconNotebook size={16} style={{ marginRight: rem(6) }} />
                  See in diary
                </Menu.Item>
              </>
            )}
            {updateTask && (
              <>
                {hasActiveTasks && (
                  <Menu.Item onClick={() => updateTask(taskKey, TaskStatusEnum.CANCELED)}>
                    <IconForbid size={16} style={{ marginRight: rem(6) }} />
                    Cancel
                  </Menu.Item>
                )}
                {hasCanceledTasks && (
                  <Menu.Item onClick={() => updateTask(taskKey, TaskStatusEnum.ACTIVE)}>
                    <IconBolt size={16} style={{ marginRight: rem(6) }} />
                    Activate
                  </Menu.Item>
                )}
              </>
            )}
            {deleteTask && allTasksCanceled && (
              <Menu.Item onClick={() => deleteTask(taskKey)}>
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
