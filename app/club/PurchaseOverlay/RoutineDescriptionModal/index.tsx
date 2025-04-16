import React, { useState } from "react";
import { rem, Stack, Text } from "@mantine/core";
import GlowingButton from "@/components/GlowingButton";
import classes from "./RoutineDescriptionModal.module.css";

type Props = {
  text: string;
  onButtonClick: (isLoading: boolean, setIsLoading: any) => Promise<void>;
};

export default function RoutineDescriptionModal({ text, onButtonClick }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Stack className={classes.container}>
      <Text>{text}</Text>
      <Stack className={classes.buttonWrapper}>
        <GlowingButton
          text={"Buy access"}
          disabled={isLoading}
          loading={isLoading}
          addGradient={true}
          onClick={() => onButtonClick(isLoading, setIsLoading)}
          containerStyles={{ marginTop: rem(4) }}
        />
      </Stack>
    </Stack>
  );
}
