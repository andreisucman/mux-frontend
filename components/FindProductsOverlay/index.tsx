import React from "react";
import { Button, CloseButton, Stack } from "@mantine/core";
import classes from "./FindProductsOverlay.module.css";

type Props = {
  onClick: () => void;
  setShowOverlay: React.Dispatch<React.SetStateAction<boolean>>;
  customStyles?: { [key: string]: any };
};

export default function FindProductsOverlay({ customStyles, setShowOverlay, onClick }: Props) {
  return (
    <Stack className={classes.container} style={customStyles ? customStyles : {}}>
      <CloseButton className={classes.close} onClick={() => setShowOverlay(false)} />
      <Button className={classes.button} onClick={onClick}>
        Choose best
      </Button>
    </Stack>
  );
}
