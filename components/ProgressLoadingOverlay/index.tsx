import React, { useMemo } from "react";
import { Loader, LoadingOverlay, Stack, Text } from "@mantine/core";
import classes from "./ProgressLoadingOverlay.module.css";

type Props = {
  isLoading: boolean;
  progress?: number;
  description?: string;
  loaderType?: "bars" | "oval";
  customStyle?: { [key: string]: any };
};

export default function ProgressLoadingOverlay({
  isLoading,
  progress,
  description,
  customStyle,
  loaderType = "oval",
}: Props) {
  const text = useMemo(() => {
    let text = "";
    if (description) {
      if (progress) {
        text = `${description} - ${progress}%`;
      } else {
        text = description;
      }
    } else {
      if (progress) {
        text = `${progress}%`;
      }
    }
    return text;
  }, [description, progress]);

  return (
    <LoadingOverlay
      visible={isLoading}
      style={customStyle ? customStyle : {}}
      classNames={{ overlay: classes.overlay }}
      loaderProps={{
        children: (
          <Stack className={classes.container}>
            <Loader type={loaderType} />
            {text && <Text>{text}</Text>}
          </Stack>
        ),
      }}
    />
  );
}
