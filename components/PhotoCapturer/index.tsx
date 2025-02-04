import React, { useCallback, useEffect, useRef, useState } from "react";
import { IconCamera, IconRefresh, IconStopwatch } from "@tabler/icons-react";
import { Button, Group, rem, Stack, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import openErrorModal from "@/helpers/openErrorModal";
import classes from "./PhotoCapturer.module.css";

type Props = {
  silhouette: string;
  hideTimerButton?: boolean;
  handleCapture: (base64string: string) => void;
};

const TIMER_SECONDS = 5;
const audioUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}/assets/shutter.mp3`;

export default function PhotoCapturer({ handleCapture, silhouette, hideTimerButton }: Props) {
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timeoutIdRef = useRef<NodeJS.Timeout>();
  const [cameraAspectRatio, setCamerAspectRatio] = useState<number>(9 / 16);
  const [secondsLeft, setSecondsLeft] = useState(TIMER_SECONDS);
  const [timerStarted, setTimerStarted] = useState(false);
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);

  const stopBothVideoAndAudio = useCallback((stream: MediaStream) => {
    stream.getTracks().forEach((track) => {
      if (track.readyState === "live") {
        track.stop();
      }
    });
  }, []);

  const startDelayedCapture = () => {
    if (timerStarted) return;
    setTimerStarted(true);
    try {
      timeoutIdRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 0) {
            clearInterval(timeoutIdRef.current);
            setTimerStarted(false);
            capturePhoto();
            return TIMER_SECONDS;
          } else {
            return prev - 1;
          }
        });
      }, 1000);
    } catch (err) {
      if (timeoutIdRef.current) {
        setTimerStarted(false);
        clearInterval(timeoutIdRef.current);
      }
      console.log("Error in startDelayedCapture: ", err);
    }
  };

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

      const audio = new Audio(audioUrl);
      audio.play();

      handleCapture(imageData);
    } catch (err) {
      console.log("Error in capturePhoto: ", err);
    }
  }, [videoRef.current]);

  const flipCamera = useCallback(() => {
    setFacingMode((prevFacingMode) => (prevFacingMode === "user" ? "environment" : "user"));
  }, [hasMultipleCameras]);

  const startVideoPreview = useCallback(async () => {
    const constraints = {
      audio: false,
      video: {
        facingMode,
        frameRate: { max: 30 },
      },
    };

    try {
      if (streamRef.current) {
        stopBothVideoAndAudio(streamRef.current);
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        await videoRef.current.play();

        // Calculate aspect ratio from actual video dimensions
        const { videoWidth, videoHeight } = videoRef.current;
        if (videoWidth > 0 && videoHeight > 0) {
          setCamerAspectRatio(videoWidth / videoHeight);
        }
      }

      // Check for multiple cameras
      const devices = await navigator.mediaDevices.enumerateDevices();
      setHasMultipleCameras(devices.filter((d) => d.kind === "videoinput").length > 1);
    } catch (err) {
      openErrorModal({
        title: "🚨 Camera Error",
        description: "Could not access camera",
        onClose: () => modals.closeAll(),
      });
    }
  }, [facingMode, stopBothVideoAndAudio]);

  useEffect(() => {
    startVideoPreview();

    return () => {
      if (streamRef.current) {
        stopBothVideoAndAudio(streamRef.current);
      }
    };
  }, [startVideoPreview]);

  return (
    <Stack className={classes.container} style={{ aspectRatio: cameraAspectRatio }}>
      <video ref={videoRef} autoPlay muted></video>
      {silhouette && (
        <div
          className={classes.silhouetteOverlay}
          style={{
            mask: `url('${silhouette}') center/contain no-repeat, linear-gradient(#000 0 0)`,
            maskComposite: "exclude",
          }}
        />
      )}
      {timerStarted && (
        <div className={classes.timerOverlay}>
          <Text fz={40}>{secondsLeft}</Text>
        </div>
      )}
      <Group className={classes.buttonGroup}>
        <audio ref={audioRef} src={audioUrl} preload="auto" />
        {!hideTimerButton && (
          <Button
            variant="default"
            disabled={timerStarted}
            onClick={startDelayedCapture}
            className={classes.button}
            style={{ flexGrow: 0, padding: 0 }}
            miw={rem(50)}
          >
            <IconStopwatch className="icon" />
          </Button>
        )}
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
        <Button
          disabled={timerStarted}
          onClick={capturePhoto}
          variant="filled"
          className={classes.button}
        >
          <IconCamera className="icon" />
        </Button>
      </Group>
    </Stack>
  );
}
