import React, { memo, useMemo } from "react";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { Collapse, Group, Stack, UnstyledButton } from "@mantine/core";
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
  handleNavigate: (path: string) => void;
};

function LinkRow({ linkClicked, handleClickLink, handleNavigate, link }: Props) {
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
        <UnstyledButton className={classes.link} onClick={() => handleNavigate(link.path)}>
          {link.icon}
          {link.title}
        </UnstyledButton>
        {link.children && chevron}
      </Group>
      {link.children && (
        <Collapse in={linkClicked === link.path}>
          {link.children.map((child, index) => (
            <UnstyledButton
              key={index}
              onClick={() => handleNavigate(link.path)}
              className={`${classes.link} ${classes.child}`}
            >
              {child.title}
            </UnstyledButton>
          ))}
        </Collapse>
      )}
    </Stack>
  );
}

export default memo(LinkRow);
