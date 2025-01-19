import React from "react";
import { IconCirclePlus } from "@tabler/icons-react";
import cn from "classnames";
import { Button, Group, Stack, Text } from "@mantine/core";
import IconWithColor from "@/app/tasks/TasksList/CreateTaskOverlay/IconWithColor";
import { formatDate } from "@/helpers/formatDate";
import AccordionTaskMenu from "../AccordionTaskMenu";
import classes from "./IndividualTasksList.module.css";

type Props = {
  taskKey: string;
  icon: string;
  color: string;
  isSelf: boolean;
  taskIdsObjects: { startsAt: string; status: string; _id: string }[];
  redirectToCalendar: (taskKey: string) => void;
  redirectToTask: (taskId: string) => void;
};

export default function RoutineIndividualTasksList({
  taskKey,
  icon,
  color,
  isSelf,
  taskIdsObjects,
  redirectToTask,
  redirectToCalendar,
}: Props) {
  return (
    <Stack className={classes.container}>
      {taskIdsObjects.map((idObj) => {
        const date = formatDate({ date: idObj.startsAt });
        return (
          <Group key={idObj._id} className={classes.row}>
            <div
              className={cn(classes.indicator, {
                [classes.active]: idObj.status === "active",
                [classes.canceled]: idObj.status === "canceled",
              })}
            />
            <IconWithColor icon={icon} color={color} />
            <Text className={classes.taskDate} mr="auto">
              {date}
            </Text>
            {isSelf && (
              <AccordionTaskMenu
                redirectToCalendar={() => redirectToCalendar(taskKey)}
                redirectToTask={() => redirectToTask(idObj._id)}
              />
            )}
          </Group>
        );
      })}
      <Button variant="default" className={classes.button}>
        <IconCirclePlus className={`${classes.icon} icon`} /> Add
      </Button>
    </Stack>
  );
}
