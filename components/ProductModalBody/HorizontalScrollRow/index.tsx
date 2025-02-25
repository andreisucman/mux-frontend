import React from "react";
import { Group } from "@mantine/core";
import classes from "./HorizontalScrollRow.module.css";

type Props = {
  children: React.ReactNode;
  ref?: any;
  customContainerStyles?: { [key: string]: any };
  customWrapperStyles?: { [key: string]: any };
};

export default function HorizontalScrollRow({
  children,
  ref,
  customContainerStyles,
  customWrapperStyles,
}: Props) {
  return (
    <Group ref={ref} className={classes.container} style={customContainerStyles || {}}>
      <Group className={classes.wrapper} style={customWrapperStyles || {}}>
        {children}
      </Group>
    </Group>
  );
}
