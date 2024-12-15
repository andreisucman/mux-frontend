import React, { useCallback, useRef, useState } from "react";
import cn from "classnames";
import { Button, Group, rem } from "@mantine/core";
import Timer from "@/components/Timer";
import callTheServer from "@/functions/callTheServer";
import classes from "./RecordingButton.module.css";

const DEFAULT_RECORDING_MILLISECONDS = 120000;

type Props = {
  variant?: "default" | "filled";
  size?: "compact-xs" | "compact-sm" | "sm";
  transcribeOnEnd?: boolean;
  defaultRecordingMs?: number;
  customContainerStyles?: { [key: string]: any };
  customButtonStyles?: { [key: string]: any };
  setText?: React.Dispatch<React.SetStateAction<string>>;
  setLocalUrl?: React.Dispatch<React.SetStateAction<string | null>>;
  setAudioBlobs: React.Dispatch<React.SetStateAction<Blob[] | null>>;
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function RecordingButton({
  variant = "default",
  size = "compact-xs",
  transcribeOnEnd = false,
  defaultRecordingMs = DEFAULT_RECORDING_MILLISECONDS,
  customButtonStyles,
  customContainerStyles,
  setText,
  setLocalUrl,
  setAudioBlobs,
  setIsLoading,
}: Props) {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const handleStartRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);

      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        console.log("Recording stopped, processing data...");
        const audioBlob = new Blob(audioChunks);
        setAudioBlobs((prev) => [...(prev || []), audioBlob]);
        if (setLocalUrl) {
          setLocalUrl(URL.createObjectURL(audioBlob));
        }
        if (transcribeOnEnd) {
          handleTranscribe(audioBlob);
        }
      };

      mediaRecorder.start();
    } catch (err) {
      handleStopRecording();
      console.log("Error in handleStartRecording: ", err);
    }
  }, [transcribeOnEnd]);

  const handleStopRecording = useCallback(async () => {
    const mediaRecorder = mediaRecorderRef.current;

    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      setIsRecording(false);
      console.log("Recording stopped");
    } else {
      console.log("No active recordings to stop.");
    }
  }, [setLocalUrl]);

  const handleTranscribe = useCallback(async (audioBlob: Blob) => {
    try {
      if (setIsLoading) setIsLoading(true);

      const formData = new FormData();
      formData.append("file", audioBlob);

      const response = await callTheServer({
        server: "processing",
        endpoint: "transcribe",
        method: "POST",
        body: formData,
      });

      if (response.status === 200) {
        if (setText) setText((prev: string) => prev + ` ${response.message}`);
      } else {
        console.log("Transcription failed:", response.message);
      }
      if (setIsLoading) setIsLoading(false);
    } catch (err) {
      if (setIsLoading) setIsLoading(false);
      console.log("Error in handleTranscribe:", err);
    }
  }, []);

  const handleClickRecord = useCallback(() => {
    if (isRecording) {
      handleStopRecording();
    } else {
      handleStartRecording();
    }
  }, [isRecording]);

  return (
    <Group className={classes.container} style={customContainerStyles ? customContainerStyles : {}}>
      <Button
        size={size}
        variant={variant}
        className={classes.button}
        classNames={{ label: classes.buttonLabel }}
        style={customButtonStyles ? customButtonStyles : {}}
        onClick={handleClickRecord}
      >
        <div
          className={cn(classes.indicator, {
            [classes.indicatorActive]: isRecording,
          })}
        />
        {isRecording ? "Stop" : "Record"}
        {isRecording && (
          <Timer
            date={defaultRecordingMs}
            onComplete={handleStopRecording}
            customStyles={{ fontSize: rem(14) }}
            onlyMinutes
            onlyCountdown
          />
        )}
      </Button>
    </Group>
  );
}
