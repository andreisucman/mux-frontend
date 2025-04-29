import React from "react";
import { Checkbox, Group, Stack, Text } from "@mantine/core";
import { normalizeString } from "@/helpers/utils";
import { ScoreType } from "@/types/global";
import classes from "./ScoreDisplayRow.module.css";

type Props = {
  isChecked: boolean;
  isDisabled?: boolean;
  item: ScoreType;
  handleSelectConcerns: (item: ScoreType) => void;
};
export default function ScoreDisplayRow({
  isChecked,
  isDisabled,
  item,
  handleSelectConcerns,
}: Props) {
  return (
    <Stack key={item.value} className={classes.row} onClick={() => handleSelectConcerns(item)}>
      <Group>
        <Checkbox disabled={isDisabled && !isChecked} checked={isChecked} readOnly />
        <Text c={isDisabled && !isChecked ? "dimmed" : undefined} className={classes.rowLabel}>
          {normalizeString(item.name)}
        </Text>
        <Text>{item.value}/100</Text>
      </Group>
      <Text c={isDisabled && !isChecked ? "dimmed" : undefined} className={classes.rowLabel}>
        {item.explanation}
      </Text>
    </Stack>
  );
}
