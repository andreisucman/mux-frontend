import React, { useCallback, useEffect, useRef, useState } from "react";
import { IconCamera, IconRefresh } from "@tabler/icons-react";
import { Button, Group, rem, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import openErrorModal from "@/helpers/openErrorModal";
import classes from "./PhotoCapturer.module.css";

type Props = {
  handleCapture: (base64string: string) => void;
};

export default function PhotoCapturer({ handleCapture }: Props) {
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);

  let constraints: MediaStreamConstraints = {
    audio: false,
    video: {
      width: { ideal: 1080 },
      height: { ideal: 1920 },
      facingMode,
      aspectRatio: 9 / 16,
      frameRate: { max: 30 },
    },
  };

  const stopBothVideoAndAudio = useCallback((stream: MediaStream) => {
    stream.getTracks().forEach((track) => {
      if (track.readyState === "live") {
        track.stop();
      }
    });
  }, []);

  const capturePhoto = useCallback(async () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return;

    try {
      const video = videoRef.current;
      if (!video.videoWidth || !video.videoHeight) return;

      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      const imageData = canvas.toDataURL("image/jpeg");

      handleCapture(imageData);
    } catch (err) {
      console.log("Error in capturePhoto: ", err);
    }
  }, [videoRef.current]);

  const flipCamera = useCallback(() => {
    setFacingMode((prevFacingMode) => (prevFacingMode === "user" ? "environment" : "user"));
  }, []);

  const startVideoPreview = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        videoRef.current.play();
      }
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((device) => device.kind === "videoinput");
      if (videoDevices.length > 1) {
        setHasMultipleCameras(true);
      }
    } catch (err) {
      openErrorModal({
        title: "🚨 An error occurred",
        description: "Failed to access camera",
        onClose: () => modals.closeAll(),
      });
    }
  }, [videoRef.current, streamRef.current]);

  useEffect(() => {
    startVideoPreview();

    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
      if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
        mediaRecorder.current.stop();
      }
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
      }
      if (streamRef.current) {
        stopBothVideoAndAudio(streamRef.current);
      }
    };
  }, []);

  return (
    <Stack className={classes.container}>
      <video ref={videoRef} autoPlay muted></video>
      <Group className={classes.buttonGroup}>
        {hasMultipleCameras && (
          <Button
            variant="default"
            onClick={flipCamera}
            className={classes.button}
            style={{ flexGrow: 0, padding: 0 }}
            miw={rem(50)}
          >
            <IconRefresh className="icon" />
          </Button>
        )}
        <Button onClick={capturePhoto} className={classes.button}>
          <IconCamera className="icon" style={{marginRight: rem(8)}} />
          Take the photo
        </Button>
      </Group>
    </Stack>
  );
}
