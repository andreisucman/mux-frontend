import React from "react";
import { Checkbox, Group, Text } from "@mantine/core";
import classes from "./NextNoConcernsButton.module.css";

type Props = {
  nextNoConcern: boolean;
  toggleNoConcern: () => void;
};

export default function NextNoConcernsButton({ nextNoConcern, toggleNoConcern }: Props) {
  return (
    <Group className={classes.addConcernRow} onClick={toggleNoConcern}>
      <Checkbox checked={nextNoConcern} readOnly />
      <Text size={"sm"}>I don&apos;t know</Text>
    </Group>
  );
}
