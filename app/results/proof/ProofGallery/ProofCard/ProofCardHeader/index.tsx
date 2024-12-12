import React from "react";
import cn from "classnames";
import { Group, Text, Title } from "@mantine/core";
import classes from "./ProofCardHeader.module.css";

type Props = {
  icon: string;
  taskName: string;
  concernName: string;
  hideTitle?: boolean;
  customStyles?: { [key: string]: any };
};

export default function ProofCardHeader({
  icon,
  hideTitle,
  customStyles,
  taskName,
  concernName,
}: Props) {
  return (
    <Group
      className={cn(classes.container, { [classes.absolute]: hideTitle })}
      style={customStyles ? customStyles : {}}
    >
      {!hideTitle && (
        <>
          <span className={classes.icon}>{icon}</span>
          <Title order={5} className={classes.taskName} lineClamp={1}>
            {taskName}
          </Title>
        </>
      )}
      <Text className={classes.concernName} c="dimmed">
        {concernName}
      </Text>
    </Group>
  );
}
