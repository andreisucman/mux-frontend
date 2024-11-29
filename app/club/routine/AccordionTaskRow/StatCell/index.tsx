import React from "react";
import cn from "classnames";
import { Group, Text } from "@mantine/core";
import classes from "./StatCell.module.css";

type Props = {
  icon: React.ReactNode;
  value: number;
  isChild?: boolean;
};

export default function StatCell({ icon, value, isChild }: Props) {
  return (
    <Group className={classes.container}>
      {icon}
      <Text className={cn(classes.value, { [classes.child]: isChild })}>{value}</Text>
    </Group>
  );
}
