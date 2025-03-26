import React, { useContext, useEffect, useState } from "react";
import { Button, Stack, Text, UnstyledButton } from "@mantine/core";
import { modals } from "@mantine/modals";
import { CreateRoutineContext } from "@/context/CreateRoutineContext";
import { UserContext } from "@/context/UserContext";
import { HandleSaveTaskProps } from "@/functions/saveTaskFromDescription";
import { useRouter } from "@/helpers/custom-router";
import openErrorModal from "@/helpers/openErrorModal";
import openCreateNewTask from "./openCreateNewTask";
import classes from "./CreateTaskOverlay.module.css";

type Props = {
  timeZone?: string;
  handleSaveTask: (args: HandleSaveTaskProps) => Promise<void>;
  customStyles?: { [key: string]: any };
};

export default function CreateTaskOverlay({ timeZone, customStyles, handleSaveTask }: Props) {
  const router = useRouter();
  const [showWeeklyButton, setShowWeeklyButton] = useState(false);
  const { isTrialUsed, isSubscriptionActive, isLoading, onCreateRoutineClick } =
    useContext(CreateRoutineContext);
  const { userDetails } = useContext(UserContext);
  const { latestProgress } = userDetails || {};

  const onCreateManuallyClick = () => {
    if (!latestProgress?.overall) {
      openErrorModal({
        title: "Please scan yourself",
        description: (
          <Text>
            You need to scan your appearance first. Click{" "}
            <UnstyledButton
              onClick={() => {
                router.push("/scan/progress");
                modals.closeAll();
              }}
              style={{ textDecoration: "underline" }}
            >
              here
            </UnstyledButton>{" "}
            to start.
          </Text>
        ),
      });
      return;
    }
    openCreateNewTask({ timeZone, handleSaveTask, onCreateRoutineClick });
  };

  useEffect(() => {
    if (!userDetails) return;

    const { nextRoutine } = userDetails;
    const allInCooldown = nextRoutine?.every((r) => r.date && new Date() < new Date(r.date || 0));

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
            Create weekly routine
          </Button>
        )}
      </Stack>
    </Stack>
  );
}
