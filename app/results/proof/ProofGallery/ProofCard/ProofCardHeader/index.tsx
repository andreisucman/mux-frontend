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
        <Group className={classes.content}>
          <span>{icon}</span>
          <Title order={5} className={classes.taskName} lineClamp={1}>
            {taskName}
          </Title>
        </Group>
      )}
      <Text className={classes.concernName}>{concernName}</Text>
    </Group>
  );
}
