import React, { useCallback, useEffect, useState } from "react";
import { Button, Group, LoadingOverlay, Stack } from "@mantine/core";
import RecordingButton from "@/app/club/answers/RecordingButton";
import classes from "./ControlButtons.module.css";

type Props = {
  isLoading: boolean;
  onSubmit: (audioBlobs: Blob[] | null) => void;
};

export default function ControlButtons({ isLoading, onSubmit }: Props) {
  const [audioBlobs, setAudioBlobs] = useState<Blob[] | null>(null);
  const [localUrl, setLocalUrl] = useState<string | null>(null);

  const handleResetRecoring = useCallback(() => {
    setAudioBlobs(null);
    setLocalUrl(null);
  }, []);

  useEffect(() => {
    return () => {
      if (localUrl) URL.revokeObjectURL(localUrl);
    };
  }, []);

  return (
    <Group className={classes.container}>
      {localUrl && audioBlobs ? (
        <Stack className={classes.controls}>
          <audio src={localUrl || ""} controls className={classes.audio} />
          <Group className={classes.buttons}>
            <Button variant="default" className={classes.button} onClick={handleResetRecoring}>
              Retry
            </Button>
            <Button className={classes.button} onClick={() => onSubmit(audioBlobs)}>
              Save
            </Button>
          </Group>
        </Stack>
      ) : (
        <RecordingButton
          size="sm"
          variant="default"
          setLocalUrl={setLocalUrl}
          setAudioBlobs={setAudioBlobs}
          defaultRecordingMs={300000}
          customContainerStyles={{ width: "100%" }}
          customButtonStyles={{ width: "100%" }}
        />
      )}
      <LoadingOverlay visible={isLoading} classNames={{ overlay: classes.loadingOverlay }} />
    </Group>
  );
}
