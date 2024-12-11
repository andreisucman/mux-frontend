import React from "react";
import { Group, Text, Title } from "@mantine/core";
import classes from "./ProofCardHeader.module.css";

type Props = {
  icon: string;
  taskName: string;
  concernName: string;
  customStyles?: { [key: string]: any };
};

export default function ProofCardHeader({ icon, customStyles, taskName, concernName }: Props) {
  return (
    <Group className={classes.container} style={customStyles ? customStyles : {}}>
      <span className={classes.icon}>{icon}</span>
      <Title order={5} className={classes.taskName} lineClamp={1}>
        {taskName}
      </Title>
      <Text className={classes.concernName} c="dimmed">
        {concernName}
      </Text>
    </Group>
  );
}
