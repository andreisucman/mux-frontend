import React from "react";
import { Group } from "@mantine/core";
import classes from "./HorizontalScrollRow.module.css";

type Props = {
  children: React.ReactNode;
  customContainerStyles?: { [key: string]: any };
  customWrapperStyles?: { [key: string]: any };
};

export default function HorizontalScrollRow({
  children,
  customContainerStyles,
  customWrapperStyles,
}: Props) {
  return (
    <Group className={classes.container} style={customContainerStyles || {}}>
      <Group className={classes.wrapper} style={customWrapperStyles || {}}>
        {children}
      </Group>
    </Group>
  );
}
