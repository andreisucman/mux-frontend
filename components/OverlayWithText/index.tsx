import React from "react";
import { Button, Stack, Text } from "@mantine/core";
import classes from "./OverlayWithText.module.css";

type Props = {
  text: string;
  icon?: any;
  buttonText?: string;
  onButtonClick?: () => void;
  outerStyles?: { [key: string]: unknown };
  innerStyles?: { [key: string]: unknown };
};

export default function OverlayWithText({
  icon,
  text,
  buttonText,
  outerStyles,
  onButtonClick,
  innerStyles,
}: Props) {
  return (
    <Stack className={classes.container} style={outerStyles ? outerStyles : {}}>
      <Stack className={classes.wrapper} style={innerStyles ? innerStyles : {}} c="dimmed">
        <Text size="xl">{icon}</Text>
        <Text size="sm" ta="center">
          {text}
        </Text>
        {buttonText && (
          <Button mt={8} variant="default" onClick={onButtonClick}>
            {buttonText}
          </Button>
        )}
      </Stack>
    </Stack>
  );
}
