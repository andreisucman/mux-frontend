import React from "react";
import { IconHandGrab, IconSquareCheck } from "@tabler/icons-react";
import { Button, Group, rem, Text } from "@mantine/core";
import classes from "./RoutineSelectionButtons.module.css";

type Props = {
  allRoutineIds: string[];
  selectedRoutineIds: string[];
  disabled?: boolean;
  isSelf: boolean;
  handleClick: (routineIds: string[], copyAll: boolean) => void;
};

export default function RoutineSelectionButtons({
  allRoutineIds,
  selectedRoutineIds,
  isSelf,
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
        {isSelf ? "Clone" : "Copy"} selected{" "}
        {selectedRoutineIds.length ? `(${selectedRoutineIds.length})` : ""}
      </Button>
      <Button
        disabled={disabled}
        variant="default"
        size="compact-sm"
        component="div"
        className={classes.button}
        onClick={disabled ? undefined : () => handleClick(allRoutineIds, true)}
      >
        {isSelf ? "Clone" : "Copy"} all
      </Button>
    </Group>
  );
}
