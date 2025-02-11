import React, { useContext, useEffect, useState } from "react";
import { Button, Stack } from "@mantine/core";
import { CreateRoutineContext } from "@/context/CreateRoutineContext";
import { UserContext } from "@/context/UserContext";
import { HandleSaveTaskProps } from "@/functions/saveTaskFromDescription";
import openCreateNewTask from "./openCreateNewTask";
import classes from "./CreateTaskOverlay.module.css";

type Props = {
  timeZone?: string;
  handleSaveTask: (args: HandleSaveTaskProps) => Promise<void>;
  customStyles?: { [key: string]: any };
};

export default function CreateTaskOverlay({ timeZone, customStyles, handleSaveTask }: Props) {
  const [showWeeklyButton, setShowWeeklyButton] = useState(false);
  const { isTrialUsed, isSubscriptionActive, isLoading, onCreateRoutineClick } =
    useContext(CreateRoutineContext);
  const { userDetails } = useContext(UserContext);

  const onCreateManuallyClick = () => {
    openCreateNewTask({ timeZone, handleSaveTask, onCreateRoutineClick });
  };

  useEffect(() => {
    if (!userDetails) return;

    const { nextRoutine } = userDetails;
    const allInCooldown = nextRoutine?.every((r) => new Date() > new Date(r.date || 0));

    setShowWeeklyButton(!allInCooldown);
  }, [userDetails]);

  return (
    <Stack className={classes.container} style={customStyles ? customStyles : {}}>
      <Stack className={classes.wrapper}>
        <Button
          variant="default"
          disabled={isLoading}
          className={classes.button}
          onClick={onCreateManuallyClick}
        >
          Create a task manually
        </Button>
        {showWeeklyButton && (
          <Button
            disabled={isLoading}
            loading={isLoading}
            className={classes.button}
            onClick={() => onCreateRoutineClick({ isSubscriptionActive, isTrialUsed })}
          >
            Create a routine for the week
          </Button>
        )}
      </Stack>
    </Stack>
  );
}
