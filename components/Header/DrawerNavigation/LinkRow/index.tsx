import React, { memo, useMemo } from "react";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import cn from "classnames";
import { Collapse, Group, Stack } from "@mantine/core";
import Link from "@/helpers/custom-router/patch-router/link";
import classes from "./LinkRow.module.css";

export type NavigationLinkType = {
  title: string;
  icon?: React.ReactNode;
  path: string;
  children?: NavigationLinkType[];
};

type Props = {
  isSmall?: boolean;
  linkClicked: string;
  link: NavigationLinkType;
  clickLink: (path: string) => void;
  closeDrawer: () => void;
};

function LinkRow({ linkClicked, clickLink, closeDrawer, link }: Props) {
  const active = linkClicked === link.path;

  const chevron = useMemo(
    () =>
      active ? (
        <IconChevronUp size={20} stroke={1.25} />
      ) : (
        <IconChevronDown size={20} stroke={1.25} />
      ),
    [active]
  );

  return (
    <Stack className={classes.container}>
      <Group className={classes.header} onClick={() => clickLink(link.path)}>
        <Link className={classes.link} href={link.path} onClick={closeDrawer}>
          {link.icon}
          {link.title}
        </Link>
        {link.children && chevron}
      </Group>
      {link.children && (
        <Collapse in={linkClicked === link.path}>
          {link.children.map((child, index) => (
            <Link
              key={index}
              href={child.path}
              className={cn(classes.link, classes.child)}
              onClick={closeDrawer}
            >
              {child.title}
            </Link>
          ))}
        </Collapse>
      )}
    </Stack>
  );
}

export default memo(LinkRow);
