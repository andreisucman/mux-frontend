import React, { useContext, useEffect, useState } from "react";
import { IconCalendarWeek, IconCirclePlus } from "@tabler/icons-react";
import { Button, rem, Stack } from "@mantine/core";
import { CreateRoutineContext } from "@/context/CreateRoutineContext";
import { UserContext } from "@/context/UserContext";
import { TypeEnum } from "@/types/global";
import { HandleSaveTaskProps } from "./AddATaskContainer/types";
import openCreateNewTask from "./openCreateNewTask";
import classes from "./CreateTaskOverlay.module.css";

type Props = {
  type: TypeEnum;
  timeZone?: string;
  handleSaveTask: (args: HandleSaveTaskProps) => Promise<void>;
  customStyles?: { [key: string]: any };
};

export default function CreateTaskOverlay({ type, timeZone, customStyles, handleSaveTask }: Props) {
  const [showWeeklyButton, setShowWeeklyButton] = useState(false);
  const { isTrialUsed, isSubscriptionActive, isLoading, onCreateRoutineClick } =
    useContext(CreateRoutineContext);
  const { userDetails } = useContext(UserContext);

  const onCreateManuallyClick = () => {
    openCreateNewTask({ type, timeZone, handleSaveTask, onCreateRoutineClick });
  };

  useEffect(() => {
    if (!userDetails) return;

    const { nextRoutine } = userDetails;

    const typeNextRoutine = nextRoutine?.find((obj) => obj.type === type);
    const isCreateRoutineInCooldown =
      typeNextRoutine && typeNextRoutine.date && new Date(typeNextRoutine.date) > new Date();

    setShowWeeklyButton(!isCreateRoutineInCooldown);
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
