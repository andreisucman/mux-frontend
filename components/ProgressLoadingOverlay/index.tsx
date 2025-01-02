import React, { useMemo } from "react";
import { Loader, LoadingOverlay, Stack, Text } from "@mantine/core";
import Disclaimer from "../WaitComponent/Disclaimer";
import classes from "./ProgressLoadingOverlay.module.css";

type Props = {
  isLoading: boolean;
  progress?: number;
  description?: string;
  showDisclaimer?: boolean;
  loaderType?: "bars" | "oval";
  customStyles?: { [key: string]: any };
  customContainerStyles?: { [key: string]: any };
};

export default function ProgressLoadingOverlay({
  isLoading,
  progress,
  description,
  showDisclaimer,
  customStyles,
  loaderType = "oval",
  customContainerStyles,
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
      style={customStyles ? customStyles : {}}
      loaderProps={{
        children: (
          <Stack
            className={classes.container}
            style={customContainerStyles ? customContainerStyles : {}}
          >
            <Loader type={loaderType} />
            {text && <Text>{text}</Text>}
            {showDisclaimer && <Disclaimer />}
          </Stack>
        ),
      }}
    />
  );
}
