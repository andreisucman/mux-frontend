import React from "react";
import { Checkbox, Group, Text } from "@mantine/core";
import { FilterItemType } from "@/components/FilterDropdown/types";
import classes from "./ConcernRow.module.css";

type Props = {
  isChecked: boolean;
  isDisabled: boolean;
  item: FilterItemType;
  handleSelectConcerns: (item: FilterItemType) => void;
};
export default function ConcernRow({ isChecked, isDisabled, item, handleSelectConcerns }: Props) {
  return (
    <Group key={item.value} className={classes.row} onClick={() => handleSelectConcerns(item)}>
      <Checkbox disabled={isDisabled && !isChecked} checked={isChecked} readOnly />
      <Text c={isDisabled && !isChecked ? "dimmed" : undefined} className={classes.rowLabel}>
        {item.label}
      </Text>
    </Group>
  );
}
