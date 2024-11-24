import React, { memo, useMemo } from "react";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
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
  linkClicked: string;
  link: NavigationLinkType;
  handleClickLink: (path: string) => void;
  closeDrawer: () => void;
};

function LinkRow({ linkClicked, handleClickLink, closeDrawer, link }: Props) {
  const active = linkClicked === link.path;

  const chevron = useMemo(
    () =>
      active ? (
        <IconChevronUp className={"icon"} stroke={1.25} />
      ) : (
        <IconChevronDown className={"icon"} stroke={1.25} />
      ),
    [active]
  );

  return (
    <Stack className={classes.container}>
      <Group className={classes.header} onClick={() => handleClickLink(link.path)}>
        <Link className={classes.link} href={link.path} onClick={closeDrawer}>
          {link.icon}
          {link.title}
        </Link>
        {link.children && chevron}
      </Group>
      {link.children && (
        <Collapse in={linkClicked === link.path}>
          {link.children.map((child, index) => (
            <Link key={index} href={child.path} className={`${classes.link} ${classes.child}`}>
              {child.title}
            </Link>
          ))}
        </Collapse>
      )}
    </Stack>
  );
}

export default memo(LinkRow);
