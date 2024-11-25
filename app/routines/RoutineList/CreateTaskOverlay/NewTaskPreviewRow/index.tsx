import React, { memo } from "react";
import { Group, Text } from "@mantine/core";
import IconWithColor from "../IconWithColor";
import classes from "./NewTaskPreviewRow.module.css";

type Props = {
  name: string;
  date: string;
  icon: string;
  color: string;
  numberOfTasks: number;
};

function NewTaskPreviewRow({ name, date, icon, color, numberOfTasks }: Props) {
  return (
    <Group className={classes.container}>
      <Text className={classes.date}>{date}</Text>
      <IconWithColor icon={icon} color={color} />
      <Text className={classes.name} lineClamp={2}>
        {name}
      </Text>
      <Text className={classes.count}>{numberOfTasks.toFixed(0)}</Text>
    </Group>
  );
}

export default memo(NewTaskPreviewRow);
