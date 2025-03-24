import React from "react";
import { Group, rem } from "@mantine/core";
import GlowingButton from "@/components/GlowingButton";
import classes from "./MaximizeOverlayButton.module.css";

type Props = {
  setShowPurchaseOverlay: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function MaximizeOverlayButton({ setShowPurchaseOverlay }: Props) {
  return (
    <Group className={classes.container}>
      <GlowingButton
        containerStyles={{ maxWidth: rem(300), margin: "auto" }}
        text="Buy now"
        onClick={() => setShowPurchaseOverlay(true)}
      />
    </Group>
  );
}
