import React, { memo } from "react";
import { Group, Text } from "@mantine/core";
import IconWithColor from "../IconWithColor";
import classes from "./NewTaskPreviewRow.module.css";

type Props = {
  name: string;
  date: string;
  icon: string;
  color: string;
};

function NewTaskPreviewRow({ name, date, icon, color }: Props) {
  return (
    <Group className={classes.container}>
      <Text className={classes.date}>{date}</Text>
      <IconWithColor icon={icon} color={color} />
      <Text className={classes.name} lineClamp={2}>
        {name}
      </Text>
    </Group>
  );
}

export default memo(NewTaskPreviewRow);
