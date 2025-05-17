import React from "react";
import {
  IconBolt,
  IconCalendar,
  IconCalendarClock,
  IconCancel,
  IconCopy,
  IconDots,
  IconNotebook,
  IconTrash,
} from "@tabler/icons-react";
import { ActionIcon, Menu, rem } from "@mantine/core";
import { RoutineStatusEnum } from "@/types/global";

type Props = {
  routineId: string;
  taskKey?: string;
  isSelf?: boolean;
  routineStatus: RoutineStatusEnum;
  copyRoutine?: (routineId: string) => void;
  rescheduleRoutine?: (routineId: string) => void;
  updateRoutine?: (routineId: string, newStatus: string) => void;
  deleteRoutine?: (routineId: string) => void;
  redirectToTask: (args: { taskKey?: string; page: "calendar" | "diary" }) => void;
};

export default function AccordionRowMenu({
  routineId,
  routineStatus,
  taskKey,
  isSelf,
  deleteRoutine,
  copyRoutine,
  rescheduleRoutine,
  updateRoutine,
  redirectToTask,
}: Props) {
  return (
    <Menu
      withArrow
      disabled={!routineId}
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
          disabled={!routineId}
        >
          <IconDots size={16} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown onClick={(e) => e.stopPropagation()}>
        {copyRoutine && (
          <Menu.Item onClick={() => copyRoutine(routineId)}>
            <IconCopy size={16} style={{ marginRight: rem(6) }} />
            Copy
          </Menu.Item>
        )}
        {isSelf && (
          <>
            {routineStatus === RoutineStatusEnum.ACTIVE && rescheduleRoutine && (
              <Menu.Item onClick={() => rescheduleRoutine(routineId)}>
                <IconCalendarClock size={16} style={{ marginRight: rem(6) }} />
                Reschedule
              </Menu.Item>
            )}
            <Menu.Item onClick={() => redirectToTask({ taskKey, page: "calendar" })}>
              <IconCalendar size={16} style={{ marginRight: rem(6) }} />
              See in calendar
            </Menu.Item>
            <Menu.Item onClick={() => redirectToTask({ taskKey, page: "diary" })}>
              <IconNotebook size={16} style={{ marginRight: rem(6) }} />
              See in diary
            </Menu.Item>
            {routineStatus === RoutineStatusEnum.CANCELED && updateRoutine && (
              <Menu.Item onClick={() => updateRoutine(routineId, RoutineStatusEnum.ACTIVE)}>
                <IconBolt size={16} style={{ marginRight: rem(6) }} />
                Activate
              </Menu.Item>
            )}
            {routineStatus === RoutineStatusEnum.ACTIVE && updateRoutine && (
              <Menu.Item onClick={() => updateRoutine(routineId, RoutineStatusEnum.CANCELED)}>
                <IconCancel size={16} style={{ marginRight: rem(6) }} />
                Cancel
              </Menu.Item>
            )}
            {routineStatus === RoutineStatusEnum.CANCELED && deleteRoutine && (
              <Menu.Item onClick={() => deleteRoutine(routineId)}>
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
