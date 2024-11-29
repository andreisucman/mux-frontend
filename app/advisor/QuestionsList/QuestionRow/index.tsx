import React from "react";
import { Group, Stack, Text } from "@mantine/core";
import IconWithColor from "@/app/routines/RoutineList/CreateTaskOverlay/IconWithColor";
import classes from "./QuestionRow.module.css";

type Props = {
  color: string;
  title: string;
  icon?: string;
  customStyles?: { [key: string]: any };
  onClick?: () => void;
};

export default function QuestionRow({ color, title, icon, customStyles, onClick }: Props) {
  return (
    <Group
      className={classes.container}
      onClick={onClick ? onClick : undefined}
      style={customStyles ? customStyles : {}}
    >
      <IconWithColor icon={icon || ""} color={color} />
      <Stack className={classes.wrapper}>
        <Text className={classes.title} lineClamp={2}>
          {title}
        </Text>
      </Stack>
    </Group>
  );
}
