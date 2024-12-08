import React from "react";
import cn from "classnames";
import { Checkbox, Stack } from "@mantine/core";
import classes from "./TosCheckbox.module.css";

type Props = {
  label: React.ReactNode;
  highlightTos: boolean;
  setHighlightTos: React.Dispatch<React.SetStateAction<boolean>>;
  tosAccepted: boolean;
  setTosAccepted: React.Dispatch<React.SetStateAction<boolean>>;
  customStyles?: { [key: string]: any };
};

export default function TosCheckbox({
  label,
  highlightTos,
  tosAccepted,
  setHighlightTos,
  setTosAccepted,
  customStyles,
}: Props) {
  return (
    <Stack
      className={cn(classes.container, { [classes.highlightTos]: highlightTos })}
      style={customStyles ? customStyles : {}}
    >
      <Checkbox
        label={label}
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
