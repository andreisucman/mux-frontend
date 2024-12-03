import React from "react";
import cn from "classnames";
import { Checkbox, Stack, Text } from "@mantine/core";
import classes from "./TosCheckbox.module.css";

type Props = {
  highlightTos: boolean;
  setHighlightTos: React.Dispatch<React.SetStateAction<boolean>>;
  tosAccepted: boolean;
  setTosAccepted: React.Dispatch<React.SetStateAction<boolean>>;
  openLegalBody?: () => void;
};

export default function TosCheckbox({
  highlightTos,
  tosAccepted,
  setHighlightTos,
  setTosAccepted,
  openLegalBody,
}: Props) {
  return (
    <Stack className={cn(classes.container, { [classes.highlightTos]: highlightTos })}>
      <Checkbox
        label={
          <Text component="div" lineClamp={2} size="sm">
            I have read, understood and accept the{" "}
            <Text
              onClickCapture={openLegalBody}
              className={cn(classes.text, { [classes.pointer]: !!openLegalBody })}
            >
              Terms of Service
            </Text>{" "}
          </Text>
        }
        styles={{ body: { alignItems: "center" } }}
        checked={tosAccepted}
        onChange={(event) => {
          setHighlightTos(false);
          setTosAccepted(event.currentTarget.checked);
        }}
      />
    </Stack>
  );
}
