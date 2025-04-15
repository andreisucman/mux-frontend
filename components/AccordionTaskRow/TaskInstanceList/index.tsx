import React from "react";
import { Button, Group, Stack, Text } from "@mantine/core";
import IconWithColor from "@/app/tasks/TasksList/CreateTaskOverlay/IconWithColor";
import Indicator from "@/components/Indicator";
import { formatDate } from "@/helpers/formatDate";
import AccordionTaskInstanceMenu from "../AccordionTaskInstanceMenu";
import classes from "./IndividualTasksList.module.css";

type Props = {
  icon: string;
  color: string;
  isSelf: boolean;
  taskIdsObjects: { startsAt: string; status: string; _id: string }[];
  redirectToTaskInstance?: (taskId: string) => void;
  copyTaskInstance: (taskId: string) => void;
  addTaskInstance: (taskId: string) => void;
  rescheduleTaskInstance?: (taskId: string) => void;
  updateTaskInstance?: (taskId: string, newStatus: string) => void;
  deleteTaskInstance?: (taskId: string) => void;
};

export default function TaskInstanceList({
  icon,
  color,
  isSelf,
  taskIdsObjects,
  deleteTaskInstance,
  copyTaskInstance,
  addTaskInstance,
  rescheduleTaskInstance,
  redirectToTaskInstance,
  updateTaskInstance,
}: Props) {
  const handleRedirectToTaskInstance = (taskId: string) => {
    if (!redirectToTaskInstance) return;
    redirectToTaskInstance(taskId);
  };
  return (
    <Stack className={classes.container}>
      {taskIdsObjects.map((idObj, i) => {
        const date = formatDate({ date: idObj.startsAt });
        return (
          <Group
            key={i}
            className={classes.row}
            onClick={() => handleRedirectToTaskInstance(idObj._id)}
          >
            <Indicator status={idObj.status} />
            <IconWithColor icon={icon} color={color} />
            <Text className={classes.taskDate} mr="auto">
              {date}
            </Text>
            <AccordionTaskInstanceMenu
              taskId={idObj._id}
              isSelf={isSelf}
              taskStatus={idObj.status}
              copyTaskInstance={copyTaskInstance}
              deleteTaskInstance={deleteTaskInstance}
              redirectToTaskInstance={redirectToTaskInstance}
              updateTaskInstance={updateTaskInstance}
              rescheduleTaskInstance={rescheduleTaskInstance}
            />
          </Group>
        );
      })}
      {isSelf && (
        <Button
          size="compact-sm"
          variant="default"
          onClick={() => addTaskInstance(taskIdsObjects[0]._id)}
        >
          Add more
        </Button>
      )}
    </Stack>
  );
}
