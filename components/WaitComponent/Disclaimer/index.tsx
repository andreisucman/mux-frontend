import React from "react";
import { Stack, Text, Title } from "@mantine/core";
import classes from "./Disclaimer.module.css";

type Props = {
  title?: string;
  body: string;
  dimmed?: boolean;
  customStyles?: { [key: string]: any };
};

export default function Disclaimer({ title, body, dimmed, customStyles }: Props) {
  return (
    <Stack className={classes.container} style={customStyles ? customStyles : {}}>
      {title && (
        <Title c={dimmed ? "dimmed" : undefined} order={4} className={classes.title}>
          {title}
        </Title>
      )}
      {body && (
        <Text c={dimmed ? "dimmed" : undefined} className={classes.text}>
          {body}
        </Text>
      )}
    </Stack>
  );
}
