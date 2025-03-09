import React from "react";
import { IconCalendar, IconDots, IconNotebook } from "@tabler/icons-react";
import { ActionIcon, Menu, rem } from "@mantine/core";
import { RedirectWithDateProps } from "../AccordionRoutineRow";

type Props = {
  taskKey?: string;
  isSelf?: boolean;
  redirectWithDate: (args: RedirectWithDateProps) => void;
};

export default function AccordionRowMenu({ taskKey, isSelf, redirectWithDate }: Props) {
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
          <IconDots className="icon icon__small" />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown onClick={(e) => e.stopPropagation()}>
        {isSelf && (
          <Menu.Item onClick={() => redirectWithDate({ taskKey, page: "calendar" })}>
            <IconCalendar className={`icon icon__small`} style={{ marginRight: rem(6) }} />
            See calendar
          </Menu.Item>
        )}
        <Menu.Item onClick={() => redirectWithDate({ taskKey, page: "diary" })}>
          <IconNotebook className={`icon icon__small`} style={{ marginRight: rem(6) }} />
          See diary
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
