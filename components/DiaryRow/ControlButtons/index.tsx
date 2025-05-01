import React, { useEffect } from "react";
import { Button, Group, LoadingOverlay, Stack } from "@mantine/core";
import RecordingButton from "@/app/club/RecordingButton";
import classes from "./ControlButtons.module.css";

type Props = {
  mediaStreamRef: any;
  mediaRecorderRef: any;
  audioBlobs: Blob[] | null;
  localUrl: string | null;
  isLoading: boolean;
  setLocalUrl: React.Dispatch<React.SetStateAction<string | null>>;
  setAudioBlobs: React.Dispatch<React.SetStateAction<Blob[] | null>>;
  handleResetRecoring: () => void;
  onSubmit: (audioBlobs: Blob[] | null) => void;
};

export default function ControlButtons({
  isLoading,
  mediaStreamRef,
  mediaRecorderRef,
  audioBlobs,
  localUrl,
  handleResetRecoring,
  setLocalUrl,
  setAudioBlobs,
  onSubmit,
}: Props) {
  useEffect(() => {
    return () => {
      if (localUrl) URL.revokeObjectURL(localUrl);
    };
  }, []);

  return (
    <Group className={classes.container}>
      {localUrl && audioBlobs ? (
        <Stack className={classes.controls}>
          {localUrl && <audio src={localUrl} controls className={classes.audio} />}
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
          buttonText="Record note"
          setLocalUrl={setLocalUrl}
          setAudioBlobs={setAudioBlobs}
          defaultRecordingMs={300000}
          mediaStreamRef={mediaStreamRef}
          mediaRecorderRef={mediaRecorderRef}
          customContainerStyles={{ width: "100%" }}
          customButtonStyles={{ width: "100%" }}
        />
      )}
      <LoadingOverlay visible={isLoading} classNames={{ overlay: classes.loadingOverlay }} />
    </Group>
  );
}
