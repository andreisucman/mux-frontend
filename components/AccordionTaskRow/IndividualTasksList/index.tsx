import React from "react";
import { IconCopy } from "@tabler/icons-react";
import cn from "classnames";
import { Button, Group, Stack, Text } from "@mantine/core";
import IconWithColor from "@/app/tasks/TasksList/CreateTaskOverlay/IconWithColor";
import Indicator from "@/components/Indicator";
import { formatDate } from "@/helpers/formatDate";
import AccordionTaskMenu from "../AccordionTaskMenu";
import classes from "./IndividualTasksList.module.css";

type Props = {
  taskKey: string;
  icon: string;
  color: string;
  isSelf: boolean;
  taskIdsObjects: { startsAt: string; status: string; _id: string }[];
  handleCloneTask: (taskId: string) => void;
  redirectToCalendar: (taskKey: string) => void;
  redirectToTask: (taskId: string) => void;
  updateTaskStatus: (taskId: string, newStatus: string) => void;
};

export default function RoutineIndividualTasksList({
  icon,
  color,
  isSelf,
  taskIdsObjects,
  handleCloneTask,
  redirectToTask,
  updateTaskStatus,
}: Props) {
  const lastTaskObject = taskIdsObjects[taskIdsObjects.length - 1];
  return (
    <Stack className={classes.container}>
      {taskIdsObjects.map((idObj) => {
        const date = formatDate({ date: idObj.startsAt });
        return (
          <Group key={idObj._id} className={classes.row}>
            <Indicator status={idObj.status} />
            <IconWithColor icon={icon} color={color} />
            <Text className={classes.taskDate} mr="auto">
              {date}
            </Text>
            {isSelf && (
              <AccordionTaskMenu
                taskId={idObj._id}
                taskStatus={idObj.status}
                redirectToTask={redirectToTask}
                updateTaskStatus={updateTaskStatus}
              />
            )}
          </Group>
        );
      })}
      <Button
        variant="default"
        size="compact-sm"
        onClick={() => handleCloneTask(lastTaskObject._id)}
        className={classes.button}
      >
        <IconCopy className={`${classes.icon} icon icon__small`} /> Add more
      </Button>
    </Stack>
  );
}
