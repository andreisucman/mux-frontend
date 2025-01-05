"use client";

import React, { useContext } from "react";
import { IconCalendar, IconCirclePlus, IconHistory, IconShoppingBag } from "@tabler/icons-react";
import { Button, Group, rem } from "@mantine/core";
import { CreateRoutineContext } from "@/context/CreateRoutineContext";
import { UserContext } from "@/context/UserContext";
import { useRouter } from "@/helpers/custom-router";
import modifyQuery from "@/helpers/modifyQuery";
import { TypeEnum } from "@/types/global";
import { HandleSaveTaskProps } from "../CreateTaskOverlay/AddATaskContainer/types";
import openCreateNewTask from "../CreateTaskOverlay/openCreateNewTask";
import classes from "./TasksButtons.module.css";

type Props = {
  disableSuggestions?: boolean;
  disableCalendar?: boolean;
  disableCreate?: boolean;
  disableHistory?: boolean;
  type: TypeEnum;
  handleSaveTask: (args: HandleSaveTaskProps) => Promise<void>;
};

export default function TasksButtons({
  type,
  disableCreate,
  disableCalendar,
  disableHistory,
  disableSuggestions,
  handleSaveTask,
}: Props) {
  const router = useRouter();
  const { userDetails } = useContext(UserContext);
  const { tasks, timeZone } = userDetails || {};
  const relevantTasks = tasks?.filter((t) => t.type === type);
  const tooManyTasksForToday = relevantTasks && relevantTasks?.length >= 10;

  const { onCreateRoutineClick } = useContext(CreateRoutineContext);

  return (
    <Group className={classes.container}>
      <Button
        className={classes.button}
        disabled={disableSuggestions}
        variant="default"
        size="xs"
        onClick={() => {
          const query = modifyQuery({
            params: [{ name: "type", value: type || "head", action: "replace" }],
          });
          router.push(`/products?${query}`);
        }}
      >
        <IconShoppingBag style={{ width: rem(20) }} />
      </Button>
      <Button
        className={classes.button}
        variant="default"
        disabled={disableCalendar}
        size="xs"
        onClick={() => {
          const query = modifyQuery({
            params: [{ name: "type", value: type || "head", action: "replace" }],
          });
          router.push(`/tasks/calendar?${query}`);
        }}
      >
        <IconCalendar style={{ width: rem(20) }} />
      </Button>
      <Button
        className={classes.button}
        variant="default"
        disabled={disableHistory}
        size="xs"
        onClick={() => {
          const query = modifyQuery({
            params: [{ name: "type", value: type || "head", action: "replace" }],
          });
          router.push(`/tasks/history?${query}`);
        }}
      >
        <IconHistory style={{ width: rem(20) }} />
      </Button>
      <Button
        className={classes.button}
        variant="default"
        disabled={disableCreate || tooManyTasksForToday}
        size="xs"
        onClick={() => openCreateNewTask({ type, handleSaveTask, onCreateRoutineClick, timeZone })}
      >
        <IconCirclePlus style={{ width: rem(20) }} />
      </Button>
    </Group>
  );
}
