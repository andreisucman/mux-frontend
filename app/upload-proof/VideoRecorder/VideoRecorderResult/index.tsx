import React, { memo, useCallback, useState } from "react";
import { IconX } from "@tabler/icons-react";
import { ActionIcon, Button, Group, rem, Stack } from "@mantine/core";
import VideoPlayer from "@/components/VideoPlayer";
import classes from "./VideoRecorderResult.module.css";

type Props = {
  isVideoLoading: boolean;
  localUrl: string;
  handleSubmit: () => void;
  handleResetImage: () => void;
  handleResetRecording: () => void;
  setLocalUrl: React.Dispatch<React.SetStateAction<string>>;
};

function VideoRecorderResult({
  isVideoLoading,
  localUrl,
  handleSubmit,
  handleResetRecording,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = useCallback(() => {
    setIsLoading(true);
    handleSubmit();
  }, []);

  const videoExtension =
    localUrl?.endsWith(".mp4") ||
    localUrl?.endsWith(".webm") ||
    localUrl?.startsWith("data:video/");

  return (
    <Stack className={classes.content} style={isVideoLoading ? { visibility: "hidden" } : {}}>
      <Group className={classes.buttonGroup}>
        <ActionIcon
          variant="default"
          disabled={isLoading}
          onClick={handleResetRecording}
          className={classes.button}
          style={{ flex: 0, minWidth: rem(40) }}
        >
          <IconX size={20} />
        </ActionIcon>
        <Button
          onClick={onSubmit}
          loading={isLoading}
          disabled={isLoading}
          className={classes.button}
        >
          Upload
        </Button>
      </Group>
      <div className={classes.videoPlayerWrapper}>
        {videoExtension && (
          <VideoPlayer
            url={localUrl}
            createdAt={new Date().toString()}
            customStyles={{ borderRadius: rem(16), overflow: "hidden" }}
            isRelative
          />
        )}
      </div>
    </Stack>
  );
}

export default memo(VideoRecorderResult);
