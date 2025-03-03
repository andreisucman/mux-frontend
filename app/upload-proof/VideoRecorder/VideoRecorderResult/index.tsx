import React, { memo } from "react";
import { IconX } from "@tabler/icons-react";
import { ActionIcon, Button, Group, rem, Stack } from "@mantine/core";
import ResultDisplayContainer from "./ResultDisplayContainer";
import classes from "./VideoRecorderResult.module.css";

type Props = {
  captureType?: string;
  isVideoLoading: boolean;
  localUrl: string;
  handleSubmit: () => void;
  handleResetImage: () => void;
  handleResetRecording: () => void;
};

function VideoRecorderResult({
  captureType,
  isVideoLoading,
  localUrl,
  handleSubmit,
  handleResetImage,
  handleResetRecording,
}: Props) {
  return (
    <Stack className={classes.content} style={isVideoLoading ? { visibility: "hidden" } : {}}>
      <Group className={classes.buttonGroup}>
        <ActionIcon
          variant="default"
          onClick={captureType === "image" ? handleResetImage : handleResetRecording}
          className={classes.button}
          style={{ flex: 0, minWidth: rem(40) }}
        >
          <IconX className="icon" />
        </ActionIcon>
        <Button onClick={handleSubmit} className={classes.button}>
          Upload
        </Button>
      </Group>
      <ResultDisplayContainer
        createdAt={new Date().toString()}
        captureType={captureType}
        url={localUrl}
      />
    </Stack>
  );
}

export default memo(VideoRecorderResult);
