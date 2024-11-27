import React from "react";
import { IconFilter } from "@tabler/icons-react";
import { ActionIcon, Group } from "@mantine/core";
import classes from "./FilterButton.module.css";

type Props = {
  onFilterClick?: () => void;
};

export default function FilterButton({ onFilterClick }: Props) {
  return (
    <Group className={classes.container}>
      <ActionIcon variant="default" onClick={onFilterClick}>
        <IconFilter className="icon" />
      </ActionIcon>
    </Group>
  );
}
