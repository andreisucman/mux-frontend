import React from "react";
import { Loader, LoadingOverlay, Stack, Text } from "@mantine/core";
import classes from "./BlurLoadingOverlay.module.css";

type Props = {
  isLoading: boolean;
  progress: number;
};

export default function BlurLoadingOverlay({ isLoading, progress }: Props) {
  return (
    <LoadingOverlay
      visible={isLoading}
      classNames={{ overlay: classes.overlay }}
      loaderProps={{
        children: (
          <Stack className={classes.container}>
            <Loader />
            {progress > 0 && <Text>{progress}%</Text>}
          </Stack>
        ),
      }}
    />
  );
}
