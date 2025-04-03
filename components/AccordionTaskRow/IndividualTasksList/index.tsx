import React from "react";
import { IconCopy } from "@tabler/icons-react";
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
  handleCloneTaskInstance: (taskId: string) => void;
  redirectToTask: (taskId: string) => void;
  updateTaskStatus: (taskId: string, newStatus: string) => void;
  deleteTask: (taskId: string) => void;
};

export default function RoutineIndividualTasksList({
  taskKey,
  icon,
  color,
  isSelf,
  taskIdsObjects,
  deleteTask,
  handleCloneTaskInstance,
  redirectToTask,
  updateTaskStatus,
}: Props) {
  const isMasked = taskKey.includes("***");
  const lastTaskObject = taskIdsObjects[taskIdsObjects.length - 1];
  return (
    <Stack className={classes.container}>
      {taskIdsObjects.map((idObj, i) => {
        const date = formatDate({ date: idObj.startsAt });
        return (
          <Group key={i} className={classes.row} onClick={() => redirectToTask(idObj._id)}>
            <Indicator status={idObj.status} />
            <IconWithColor icon={icon} color={color} />
            <Text className={classes.taskDate} mr="auto">
              {date}
            </Text>
            {isSelf && (
              <AccordionTaskMenu
                taskId={idObj._id}
                taskStatus={idObj.status}
                deleteTask={deleteTask}
                redirectToTask={redirectToTask}
                updateTaskStatus={updateTaskStatus}
              />
            )}
          </Group>
        );
      })}
      {!isMasked && isSelf && (
        <Button
          variant="default"
          size="compact-sm"
          onClick={() => handleCloneTaskInstance(lastTaskObject._id)}
          className={classes.button}
        >
          <IconCopy className={`${classes.icon} icon icon__small`} /> Add more
        </Button>
      )}
    </Stack>
  );
}
