import React, { useState } from "react";
import Link from "next/link";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { Button, Checkbox, Collapse, Group, Stack } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import { saveToLocalStorage } from "@/helpers/localStorage";
import classes from "./TaskFilters.module.css";

type Props = {
  isDisabled: boolean;
  canAddDiary: boolean;
  groupTasksByConcerns: boolean;
  setGroupTasksByConcerns: React.Dispatch<React.SetStateAction<boolean>>;
  hideCompletedTasks: boolean;
  setHideCompletedTasks: React.Dispatch<React.SetStateAction<boolean>>;
  hideFutureTasks: boolean;
  setHideFutureTasks: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function TaskFilters({
  isDisabled,
  canAddDiary,
  groupTasksByConcerns,
  setGroupTasksByConcerns,
  hideCompletedTasks,
  setHideCompletedTasks,
  hideFutureTasks,
  setHideFutureTasks,
}: Props) {
  const [showMenu, setShowMenu] = useState(false);
  const clickOutsideRef = useClickOutside(() => setShowMenu(false));

  const chevron = showMenu ? (
    <IconChevronUp size={18} className={classes.chevron} />
  ) : (
    <IconChevronDown size={18} className={classes.chevron} />
  );

  const taskCount = [hideCompletedTasks, hideFutureTasks].filter(Boolean).length;

  const handleChange = (category: string, value: boolean, setter: any) => {
    saveToLocalStorage(category, value);
    setter(value);
  };

  return (
    <Stack className={classes.container} ref={clickOutsideRef}>
      <Group wrap="nowrap">
        <Button
          size="compact-sm"
          variant="default"
          flex={1}
          className={classes.button}
          onClick={() => setShowMenu((prev) => !prev)}
        >
          {chevron} {showMenu ? "Hide filters" : "Filter list"}{" "}
          {taskCount ? `(${taskCount})` : undefined}
        </Button>
        {canAddDiary && (
          <Button size="compact-sm" flex={1} variant="default" component={Link} href={"/diary"}>
            Add a diary note
          </Button>
        )}
      </Group>
      <Collapse in={showMenu}>
        <Group className={classes.checkboxes}>
          <Checkbox
            onChange={(e) =>
              handleChange("groupTasksByConcern", e.currentTarget.checked, setGroupTasksByConcerns)
            }
            disabled={isDisabled}
            checked={groupTasksByConcerns && !isDisabled}
            label="Group by concerns"
            className={classes.checkbox}
          />
          <Checkbox
            onChange={(e) =>
              handleChange("hideCompletedTasks", e.currentTarget.checked, setHideCompletedTasks)
            }
            disabled={isDisabled}
            checked={hideCompletedTasks && !isDisabled}
            label="Hide completed"
            className={classes.checkbox}
          />
          <Checkbox
            onChange={(e) =>
              handleChange("hideFutureTasks", e.currentTarget.checked, setHideFutureTasks)
            }
            disabled={isDisabled}
            label="Hide future"
            checked={hideFutureTasks && !isDisabled}
            className={classes.checkbox}
          />
        </Group>
      </Collapse>
    </Stack>
  );
}
