import React, { useCallback, useRef, useState } from "react";
import cn from "classnames";
import { Button, Group, rem } from "@mantine/core";
import Timer from "@/components/Timer";
import callTheServer from "@/functions/callTheServer";
import classes from "./RecordingButton.module.css";

const DEFAULT_RECORDING_MILLISECONDS = 120000;

type Props = {
  setText: React.Dispatch<React.SetStateAction<string>>;
  setAudioBlobs: React.Dispatch<React.SetStateAction<Blob[] | null>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function RecordingButton({ setText, setAudioBlobs, setIsLoading }: Props) {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const handleStartRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);

      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        console.log("Recording stopped, processing data...");
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        setAudioBlobs((prev) => [...(prev || []), audioBlob]);
        handleTranscribe(audioBlob);
      };

      mediaRecorder.start();
    } catch (err) {
      handleStopRecording();
      console.log("Error in handleStartRecording: ", err);
    }
  }, []);

  const handleStopRecording = useCallback(async () => {
    const mediaRecorder = mediaRecorderRef.current;

    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      setIsRecording(false);
      console.log("Recording stopped");
    } else {
      console.log("No active recording to stop.");
    }
  }, []);

  const handleTranscribe = useCallback(async (audioBlob: Blob) => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("file", audioBlob);

      const response = await callTheServer({
        server: "processing",
        endpoint: "transcribe",
        method: "POST",
        body: formData,
      });

      if (response.status === 200) {
        setText((prev: string) => prev + ` ${response.message}`);
      } else {
        console.log("Transcription failed:", response.message);
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
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
    <Group className={classes.container}>
      <Button
        variant="default"
        className={classes.button}
        classNames={{ label: classes.buttonLabel }}
        size="compact-xs"
        onClick={handleClickRecord}
      >
        <div
          className={cn(classes.indicator, {
            [classes.indicatorActive]: isRecording,
          })}
        />
        {isRecording ? "Stop" : "Record"}
      </Button>
      {isRecording && (
        <Timer
          date={DEFAULT_RECORDING_MILLISECONDS}
          onlyMinutes
          onlyCountdown
          onComplete={handleStopRecording}
          customStyles={{ fontSize: rem(14) }}
        />
      )}
    </Group>
  );
}
