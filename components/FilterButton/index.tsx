import React from "react";
import { IconFilter } from "@tabler/icons-react";
import { ActionIcon, Group, Indicator } from "@mantine/core";
import classes from "./FilterButton.module.css";

type Props = {
  isDisabled?: boolean;
  activeFiltersCount: number;
  onFilterClick?: () => void;
};

export default function FilterButton({ onFilterClick, activeFiltersCount, isDisabled }: Props) {
  return (
    <Group className={classes.container}>
      <ActionIcon
        variant="default"
        onClick={onFilterClick}
        disabled={isDisabled}
        className={classes.button}
      >
        <IconFilter size={20} />
      </ActionIcon>
      {activeFiltersCount > 0 && (
        <Indicator label={activeFiltersCount} size={16} className={classes.indicator} />
      )}
    </Group>
  );
}
