import React from "react";
import { Checkbox, Group, Text } from "@mantine/core";
import { SelectedConcernItemType } from "../page";
import classes from "./ConcernRow.module.css";

type Props = {
  isChecked: boolean;
  isDisabled: boolean;
  item: SelectedConcernItemType;
  handleSelectConcerns: (item: SelectedConcernItemType) => void;
};
export default function ConcernRow({ isChecked, isDisabled, item, handleSelectConcerns }: Props) {
  return (
    <Group key={item.value} className={classes.row} onClick={() => handleSelectConcerns(item)}>
      <Checkbox disabled={isDisabled} checked={isChecked} className={classes.checkbox} readOnly />{" "}
      <Text className={classes.rowLabel}>{item.label}</Text>
    </Group>
  );
}
