import React from "react";
import { Group, Title } from "@mantine/core";
import classes from "./PageHeader.module.css";

type Props = {
  name: string;
  icon: React.ReactNode;
};

export default function PageHeader({ name, icon }: Props) {
  return (
    <Group className={classes.container}>
      {icon}
      <Title order={1} className={classes.title}>
        {name}
      </Title>
    </Group>
  );
}
