"use client";

import React, { useContext } from "react";
import { usePathname } from "next/navigation";
import {
  IconCalendar,
  IconCirclePlus,
  IconListDetails,
  IconRoute,
  IconShoppingBag,
} from "@tabler/icons-react";
import { Button, Group, rem } from "@mantine/core";
import { CreateRoutineContext } from "@/context/CreateRoutineContext";
import { UserContext } from "@/context/UserContext";
import { HandleSaveTaskProps } from "@/functions/saveTaskFromDescription";
import { useRouter } from "@/helpers/custom-router";
import openCreateNewTask from "../CreateTaskOverlay/openCreateNewTask";
import classes from "./TasksButtons.module.css";

type Props = {
  handleSaveTask: (args: HandleSaveTaskProps) => Promise<void>;
};

export default function TasksButtons({ handleSaveTask }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { userDetails } = useContext(UserContext);
  const { timeZone } = userDetails || {};

  const { onCreateRoutineClick } = useContext(CreateRoutineContext);

  return (
    <Group className={classes.container}>
      <Button
        className={classes.button}
        variant="default"
        size="xs"
        onClick={() => router.push("/products")}
      >
        <IconShoppingBag style={{ width: rem(20) }} />
      </Button>
      <Button
        className={classes.button}
        variant="default"
        size="xs"
        onClick={() => router.push("/calendar")}
      >
        <IconCalendar style={{ width: rem(20) }} />
      </Button>
      {pathname === "/tasks" && (
        <Button
          className={classes.button}
          variant="default"
          size="xs"
          onClick={() => router.push("/routines")}
        >
          <IconRoute style={{ width: rem(20) }} />
        </Button>
      )}
      {pathname === "/routines" && (
        <Button
          className={classes.button}
          variant="default"
          size="xs"
          onClick={() => router.push("/tasks")}
        >
          <IconListDetails style={{ width: rem(20) }} />
        </Button>
      )}
      <Button
        className={classes.button}
        variant="default"
        size="xs"
        onClick={() => openCreateNewTask({ handleSaveTask, onCreateRoutineClick, timeZone })}
      >
        <IconCirclePlus style={{ width: rem(20) }} />
      </Button>
    </Group>
  );
}
