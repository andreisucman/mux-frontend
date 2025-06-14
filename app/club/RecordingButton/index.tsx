import React, { useCallback, useState } from "react";
import cn from "classnames";
import { Button, Group, rem } from "@mantine/core";
import Timer from "@/components/Timer";
import callTheServer from "@/functions/callTheServer";
import uploadToSpaces from "@/functions/uploadToSpaces";
import classes from "./RecordingButton.module.css";

const DEFAULT_RECORDING_MILLISECONDS = 120000;

type Props = {
  variant?: "default" | "filled";
  size?: "compact-xs" | "compact-sm" | "sm";
  transcribeOnEnd?: boolean;
  isDisabled?: boolean;
  buttonText?: string;
  isLoading?: boolean;
  defaultRecordingMs?: number;
  customContainerStyles?: { [key: string]: any };
  customButtonStyles?: { [key: string]: any };
  mediaRecorderRef: React.MutableRefObject<MediaRecorder | null>;
  mediaStreamRef: React.MutableRefObject<MediaStream | null>;
  setText?: (text: string) => void;
  setLocalUrl?: React.Dispatch<React.SetStateAction<string | null>>;
  setAudioBlobs?: React.Dispatch<React.SetStateAction<Blob[] | null>>;
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function RecordingButton({
  variant = "default",
  size = "compact-xs",
  transcribeOnEnd = false,
  defaultRecordingMs = DEFAULT_RECORDING_MILLISECONDS,
  customButtonStyles,
  customContainerStyles,
  isLoading,
  isDisabled,
  mediaRecorderRef,
  mediaStreamRef,
  buttonText = "Record",
  setText,
  setLocalUrl,
  setAudioBlobs,
  setIsLoading,
}: Props) {
  const [isRecording, setIsRecording] = useState(false);

  const handleStartRecording = useCallback(async () => {
    if (isDisabled) return;
    try {
      mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      const mediaRecorder = new MediaRecorder(mediaStreamRef.current, {
        mimeType: "audio/webm",
      });
      mediaRecorderRef.current = mediaRecorder;

      setIsRecording(true);

      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        if (setAudioBlobs) setAudioBlobs((prev) => [...(prev || []), audioBlob]);
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
  }, [transcribeOnEnd, isDisabled, mediaRecorderRef.current, mediaStreamRef.current]);

  const handleStopRecording = useCallback(async () => {
    const mediaRecorder = mediaRecorderRef.current;

    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
      console.log("Recording stopped");
    } else {
      console.log("No active recordings to stop.");
    }
  }, [setLocalUrl, mediaRecorderRef.current]);

  const handleTranscribe = useCallback(async (audioBlob: Blob) => {
    try {
      if (setIsLoading) setIsLoading(true);

      const fileUrls = await uploadToSpaces({ itemsArray: [audioBlob] });

      const response = await callTheServer({
        endpoint: "transcribe",
        method: "POST",
        body: { url: fileUrls?.[0], categoryName: "suggest" },
      });

      if (response.status === 200) {
        if (setText) setText(response.message);
      }
      if (setIsLoading) setIsLoading(false);
    } catch (err) {
      if (setIsLoading) setIsLoading(false);
    }
  }, []);

  const handleClickRecord = useCallback(() => {
    if (isRecording) {
      handleStopRecording();
    } else {
      handleStartRecording();
    }
  }, [isRecording]);

  const timerFontSize = size === "compact-xs" ? rem(11) : rem(14);

  return (
    <Group className={classes.container} style={customContainerStyles ? customContainerStyles : {}}>
      <Button
        disabled={!!isLoading || isDisabled}
        size={size}
        variant={variant}
        className={classes.button}
        classNames={{ label: classes.buttonLabel }}
        style={customButtonStyles ? customButtonStyles : {}}
        onClick={handleClickRecord}
        component="div"
      >
        <div
          className={cn(classes.indicator, {
            [classes.indicatorActive]: isRecording,
            [classes[size]]: true,
          })}
        />
        {isRecording ? "Stop" : buttonText}
        {isRecording && (
          <Timer
            date={defaultRecordingMs}
            onComplete={handleStopRecording}
            customStyles={{ fontSize: timerFontSize }}
            onlyMinutes
            onlyCountdown
          />
        )}
      </Button>
    </Group>
  );
}
