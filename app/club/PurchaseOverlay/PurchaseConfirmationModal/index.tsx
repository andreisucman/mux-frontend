import React, { useState } from "react";
import { Checkbox, rem, Stack, Text } from "@mantine/core";
import GlowingButton from "@/components/GlowingButton";
import classes from "./PurchaseConfirmationModal.module.css";

type Props = {
  onButtonClick: (isLoading: boolean, setIsLoading: any) => Promise<void>;
};

export const positives = [
  "See and copy tasks from the routines.",
  "Read the feedback and insights from the diary.",
  "See how to complete each task from proofs.",
];

export const negatives = [
  "You are not guaranteed results",
  "You will not be refunded if you don't like the tasks",
];

export default function PurchaseConfirmationModal({ onButtonClick }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasAgreed, setHasAgreed] = useState(false);

  return (
    <Stack className={classes.container}>
      <Stack className={classes.box}>
        <Text fw={600} fz={14}>You will be able to:</Text>
        <ul className={classes.list}>
          {positives.map((rec, i) => (
            <li key={i}>{rec}</li>
          ))}
        </ul>
      </Stack>
      <Stack className={classes.box}>
        <Text fw={600} fz={14}>Please note:</Text>
        <ul className={classes.list}>
          {negatives.map((rec, i) => (
            <li key={i}>{rec}</li>
          ))}
        </ul>
      </Stack>
      <Checkbox
        checked={hasAgreed}
        label="I understand and agree"
        onChange={(e) => setHasAgreed(e.currentTarget.checked)}
      />
      <Stack className={classes.buttonWrapper}>
        <GlowingButton
          text={"Buy access"}
          disabled={isLoading || !hasAgreed}
          loading={isLoading}
          addGradient={true}
          onClick={() => onButtonClick(isLoading, setIsLoading)}
          containerStyles={{ marginTop: rem(4), marginBottom: rem(8) }}
        />
      </Stack>
    </Stack>
  );
}
