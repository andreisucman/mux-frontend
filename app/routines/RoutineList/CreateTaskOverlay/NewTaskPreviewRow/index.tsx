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
  let numberOfTimes =
    numberOfTasks === 1 ? "once" : numberOfTasks === 2 ? "twice" : `${numberOfTasks} times`;

  return (
    <Group className={classes.container}>
      <Text className={classes.date}>{date}</Text>
      <IconWithColor icon={icon} color={color} />
      <Text className={classes.name} lineClamp={2}>
        {name}
      </Text>
      <Text className={classes.count}>{numberOfTimes}</Text>
    </Group>
  );
}

export default memo(NewTaskPreviewRow);
