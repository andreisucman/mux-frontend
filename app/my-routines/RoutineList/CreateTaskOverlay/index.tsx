import React, { useCallback, useContext } from "react";
import { IconCalendarWeek, IconCirclePlus } from "@tabler/icons-react";
import { Button, Stack, rem } from "@mantine/core";
import { CreateRoutineContext } from "@/context/CreateRoutineContext";
import { TypeEnum } from "@/types/global";
import { HandleSaveTaskProps } from "./AddATaskContainer/types";
import openCreateNewTask from "./openCreateNewTask";
import classes from "./CreateTaskOverlay.module.css";

type Props = {
  type: TypeEnum;
  handleSaveTask: (args: HandleSaveTaskProps) => Promise<void>;
  customStyles?: { [key: string]: any };
};

export default function CreateTaskOverlay({ type, customStyles, handleSaveTask }: Props) {
  const { isTrialUsed, isSubscriptionActive, isLoading, onCreateRoutineClick } =
    useContext(CreateRoutineContext);

  const onCreateManuallyClick = useCallback(() => {
    openCreateNewTask(type, handleSaveTask);
  }, []);

  return (
    <Stack className={classes.container} style={customStyles ? customStyles : {}}>
      <Stack className={classes.wrapper}>
        <Button
          variant="default"
          disabled={isLoading}
          className={classes.button}
          onClick={onCreateManuallyClick}
        >
          <IconCirclePlus className="icon" style={{ marginRight: rem(8) }} /> Create a task manually
        </Button>
        <Button
          disabled={isLoading}
          loading={isLoading}
          className={classes.button}
          onClick={() => onCreateRoutineClick(isSubscriptionActive, isTrialUsed)}
        >
          <IconCalendarWeek className="icon" style={{ marginRight: rem(8) }} /> Create a routine for
          the week
        </Button>
      </Stack>
    </Stack>
  );
}
