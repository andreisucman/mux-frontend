import React, { useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Stack, Text, UnstyledButton } from "@mantine/core";
import { modals } from "@mantine/modals";
import { CreateRoutineContext } from "@/context/CreateRoutineContext";
import { UserContext } from "@/context/UserContext";
import { HandleSaveTaskProps } from "@/functions/saveTaskFromDescription";
import openErrorModal from "@/helpers/openErrorModal";
import openCreateNewTask from "./openCreateNewTask";
import classes from "./CreateTaskOverlay.module.css";

type Props = {
  handleSaveTask: (args: HandleSaveTaskProps) => Promise<void>;
  customStyles?: { [key: string]: any };
};

export default function CreateTaskOverlay({ customStyles, handleSaveTask }: Props) {
  const router = useRouter();
  const [showWeeklyButton, setShowWeeklyButton] = useState(false);
  const { userDetails } = useContext(UserContext);
  const { isLoading, onCreateRoutineClick } = useContext(CreateRoutineContext);
  const { initialProgressImages } = userDetails || {};

  const nothingScanned = useMemo(() => {
    const values = Object.values(initialProgressImages || {});
    return values.filter(Boolean).length === 0;
  }, [initialProgressImages]);

  const handleClick = (cb: () => void) => {
    if (nothingScanned) {
      openErrorModal({
        title: "Please scan yourself",
        description: (
          <Text>
            You need to{" "}
            <UnstyledButton
              onClick={() => {
                router.push("/select-part");
                modals.closeAll();
              }}
              style={{ textDecoration: "underline" }}
            >
              scan
            </UnstyledButton>{" "}
            yourself first.
          </Text>
        ),
      });
      return;
    }
    cb();
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
          onClick={() => handleClick(() => openCreateNewTask({ handleSaveTask }))}
        >
          Create a single task
        </Button>
        {showWeeklyButton && (
          <Button
            disabled={isLoading}
            loading={isLoading}
            className={classes.button}
            onClick={() => handleClick(onCreateRoutineClick)}
          >
            Suggest me a routine
          </Button>
        )}
      </Stack>
    </Stack>
  );
}
