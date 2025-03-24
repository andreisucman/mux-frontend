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
import { RedirectWithDateProps } from "../AccordionRoutineRow";

type Props = {
  routineId: string;
  taskKey?: string;
  isSelf?: boolean;
  routineStatus: RoutineStatusEnum;
  cloneOrRescheduleRoutines?: (routineIds: string[], isReschedule?: boolean) => void;
  updateRoutineStatuses?: (routineIds: string[], newStatus: string) => void;
  redirectWithDate: (args: RedirectWithDateProps) => void;
};

export default function AccordionRowMenu({
  routineId,
  routineStatus,
  taskKey,
  isSelf,
  cloneOrRescheduleRoutines,
  updateRoutineStatuses,
  redirectWithDate,
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
        <ActionIcon
          component="div"
          variant="default"
          size="sm"
          onClick={(e) => e.stopPropagation()}
        >
          <IconDots className="icon icon__small icon__gray" />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown onClick={(e) => e.stopPropagation()}>
        {isSelf && (
          <>
            <Menu.Item onClick={() => redirectWithDate({ taskKey, page: "calendar" })}>
              <IconCalendar className={`icon icon__small`} style={{ marginRight: rem(6) }} />
              See in calendar
            </Menu.Item>
            <Menu.Item onClick={() => redirectWithDate({ taskKey, page: "diary" })}>
              <IconNotebook className={`icon icon__small`} style={{ marginRight: rem(6) }} />
              See in diary
            </Menu.Item>
            {routineStatus === RoutineStatusEnum.ACTIVE && cloneOrRescheduleRoutines && (
              <Menu.Item onClick={() => cloneOrRescheduleRoutines([routineId], true)}>
                <IconCalendarClock className={`icon icon__small`} style={{ marginRight: rem(6) }} />
                Reschedule
              </Menu.Item>
            )}
            {routineStatus === RoutineStatusEnum.CANCELED && updateRoutineStatuses && (
              <Menu.Item
                onClick={() => updateRoutineStatuses([routineId], RoutineStatusEnum.ACTIVE)}
              >
                <IconBolt className={`icon icon__small`} style={{ marginRight: rem(6) }} />
                Activate
              </Menu.Item>
            )}
            {routineStatus === RoutineStatusEnum.ACTIVE && updateRoutineStatuses && (
              <Menu.Item
                onClick={() => updateRoutineStatuses([routineId], RoutineStatusEnum.CANCELED)}
              >
                <IconCancel className={`icon icon__small`} style={{ marginRight: rem(6) }} />
                Cancel
              </Menu.Item>
            )}
            {routineStatus === RoutineStatusEnum.CANCELED && updateRoutineStatuses && (
              <Menu.Item
                onClick={() => updateRoutineStatuses([routineId], RoutineStatusEnum.DELETED)}
              >
                <IconTrash className={`icon icon__small`} style={{ marginRight: rem(6) }} />
                Delete
              </Menu.Item>
            )}
          </>
        )}
        {cloneOrRescheduleRoutines && (
          <Menu.Item onClick={() => cloneOrRescheduleRoutines([routineId])}>
            <IconCopy className={`icon icon__small`} style={{ marginRight: rem(6) }} />
            Clone
          </Menu.Item>
        )}
      </Menu.Dropdown>
    </Menu>
  );
}
