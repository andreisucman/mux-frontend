import React from "react";
import { IconCalendar, IconDots, IconInfoCircle } from "@tabler/icons-react";
import { ActionIcon, Menu, rem } from "@mantine/core";
import classes from "./AccordionTaskRow.module.css";

type Props = {
  redirectToTask: () => void;
  redirectToCalendar: () => void;
};

export default function AccordionTaskMenu({ redirectToTask, redirectToCalendar }: Props) {
  return (
    <Menu withArrow classNames={{ itemLabel: classes.menuItemLabel }}>
      <Menu.Target>
        <ActionIcon variant="default" size="sm">
          <IconDots className="icon icon__small" />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item onClick={redirectToCalendar}>
          <IconCalendar className={`icon icon__small`} style={{ marginRight: rem(6) }} />
          See calendar
        </Menu.Item>
        <Menu.Item onClick={redirectToTask}>
          <IconInfoCircle className={`icon icon__small`} style={{ marginRight: rem(6) }} />
          See task
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
