import React from "react";
import { Button, Group } from "@mantine/core";
import classes from "./RoutineSelectionButtons.module.css";

type Props = {
  allRoutineIds: string[];
  selectedRoutineIds: string[];
  disabled?: boolean;
  handleClick: (routineIds: string[], copyAll: boolean) => void;
};

export default function RoutineSelectionButtons({
  allRoutineIds,
  selectedRoutineIds,
  disabled,
  handleClick,
}: Props) {
  return (
    <Group className={classes.container}>
      <Button
        disabled={disabled || !selectedRoutineIds.length}
        component="div"
        variant="default"
        size="compact-sm"
        className={classes.button}
        onClick={disabled ? undefined : () => handleClick(selectedRoutineIds, false)}
      >
        Copy selected {selectedRoutineIds.length ? `(${selectedRoutineIds.length})` : ""}
      </Button>
      <Button
        disabled={disabled}
        variant="default"
        size="compact-sm"
        component="div"
        className={classes.button}
        onClick={disabled ? undefined : () => handleClick(allRoutineIds, true)}
      >
        Copy all
      </Button>
    </Group>
  );
}
