import React from "react";
import { IconListSearch } from "@tabler/icons-react";
import { Button, CloseButton, rem, Stack } from "@mantine/core";
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
        <IconListSearch className="icon" style={{ marginRight: rem(8) }} /> Choose best for me
      </Button>
    </Stack>
  );
}
