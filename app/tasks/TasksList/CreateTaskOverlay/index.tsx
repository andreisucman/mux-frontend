import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Button, Stack, Text, UnstyledButton } from "@mantine/core";
import { modals } from "@mantine/modals";
import { UserContext } from "@/context/UserContext";
import { HandleSaveTaskProps } from "@/functions/saveTaskFromDescription";
import { useRouter } from "next/navigation";
import openErrorModal from "@/helpers/openErrorModal";
import openSelectRoutineType from "@/helpers/openSelectRoutineType";
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
  const { latestProgressImages, nextRoutine } = userDetails || {};
  const [isLoading, setIsLoading] = useState(false);

  const nothingScanned = useMemo(() => {
    const values = Object.values(latestProgressImages || {});
    return values.filter(Boolean).length === 0;
  }, [latestProgressImages]);

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

  const onCreateRoutineClick = useCallback(() => {
    if (!nextRoutine || isLoading) return;

    const partsScanned = Object.entries(latestProgressImages || {})
      .filter(([key, value]) => Boolean(value))
      .map(([key, _]) => key);

    if (partsScanned.length > 1) {
      const relevantRoutines = nextRoutine.filter((obj) => partsScanned.includes(obj.part));
      if (relevantRoutines) openSelectRoutineType(relevantRoutines);
    } else if (partsScanned.length === 1) {
      setIsLoading(true);
      router.push(`/suggest/add-details?part=${partsScanned[0]}`);
    }
  }, [isLoading, nextRoutine, latestProgressImages]);

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
          Create a task manually
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
