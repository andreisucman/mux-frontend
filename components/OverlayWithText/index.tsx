import React from "react";
import { Stack, Text } from "@mantine/core";
import classes from "./OverlayWithText.module.css";

type Props = {
  text: string;
  icon?: any;
  outerStyles?: { [key: string]: unknown };
  innerStyles?: { [key: string]: unknown };
};

export default function OverlayWithText({ icon, text, outerStyles, innerStyles }: Props) {
  return (
    <Stack className={classes.container} style={outerStyles ? outerStyles : {}}>
      <Stack className={classes.wrapper} style={innerStyles ? innerStyles : {}} c="dimmed">
        <Text size="xl">{icon}</Text>
        <Text size="sm" ta="center">
          {text}
        </Text>
      </Stack>
    </Stack>
  );
}
