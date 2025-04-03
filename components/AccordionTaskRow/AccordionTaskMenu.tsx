import React from "react";
import {
  IconBolt,
  IconCalendar,
  IconCancel,
  IconCopy,
  IconDots,
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
          <IconDots className="icon icon__small icon__gray" />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown onClick={(e) => e.stopPropagation()}>
        <Menu.Item onClick={() => copyTask(taskKey)}>
          <IconCopy className={`icon icon__small`} style={{ marginRight: rem(6) }} />
          Copy
        </Menu.Item>
        {isSelf && (
          <>
            {rescheduleTask && (
              <Menu.Item onClick={() => rescheduleTask(taskKey)}>
                <IconCalendar className={`icon icon__small`} style={{ marginRight: rem(6) }} />
                Reschedule
              </Menu.Item>
            )}
            {redirectToTask && (
              <>
                <Menu.Item onClick={() => redirectToTask({ taskKey, page: "calendar" })}>
                  <IconCalendar className={`icon icon__small`} style={{ marginRight: rem(6) }} />
                  See in calendar
                </Menu.Item>
                <Menu.Item onClick={() => redirectToTask({ taskKey, page: "diary" })}>
                  <IconNotebook className={`icon icon__small`} style={{ marginRight: rem(6) }} />
                  See in diary
                </Menu.Item>
              </>
            )}
            {updateTask && (
              <>
                {hasActiveTasks && (
                  <Menu.Item onClick={() => updateTask(taskKey, TaskStatusEnum.CANCELED)}>
                    <IconCancel className={`icon icon__small`} style={{ marginRight: rem(6) }} />
                    Cancel
                  </Menu.Item>
                )}
                {hasCanceledTasks && (
                  <Menu.Item onClick={() => updateTask(taskKey, TaskStatusEnum.ACTIVE)}>
                    <IconBolt className={`icon icon__small`} style={{ marginRight: rem(6) }} />
                    Activate
                  </Menu.Item>
                )}
              </>
            )}
            {deleteTask && allTasksCanceled && (
              <Menu.Item onClick={() => deleteTask(taskKey)}>
                <IconTrash className={`icon icon__small`} style={{ marginRight: rem(6) }} />
                Delete
              </Menu.Item>
            )}
          </>
        )}
      </Menu.Dropdown>
    </Menu>
  );
}
