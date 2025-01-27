import React from "react";
import { Group } from "@mantine/core";
import classes from "./StatCell.module.css";

type Props = {
  icon: React.ReactNode;
  value: number;
};

export default function StatCell({ icon, value }: Props) {
  return (
    <Group className={classes.container}>
      {icon}
      {value || "0"}
    </Group>
  );
}
