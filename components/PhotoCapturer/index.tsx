import React, { useCallback, useEffect, useRef, useState } from "react";
import { IconCamera, IconRefresh, IconStopwatch } from "@tabler/icons-react";
import cn from "classnames";
import { Button, Group, rem, Stack, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import openErrorModal from "@/helpers/openErrorModal";
import classes from "./PhotoCapturer.module.css";

type Props = {
  hideTimerButton?: boolean;
  silhouette?: string;
  handleCapture: (base64string: string) => void;
};

const TIMER_SECONDS = 5;
const audioUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}/assets/shutter.mp3`;

export default function PhotoCapturer({ handleCapture, hideTimerButton, silhouette }: Props) {
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timeoutIdRef = useRef<NodeJS.Timeout>();
  const [secondsLeft, setSecondsLeft] = useState(TIMER_SECONDS);
  const [timerStarted, setTimerStarted] = useState(false);
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  const isMobile = useMediaQuery("(max-width: 36em)");

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

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = canvas.toDataURL("image/jpeg");

      const audio = new Audio(audioUrl);
      audio.play();

      handleCapture(imageData);
    } catch (err) {
      console.log("Error in capturePhoto: ", err);
    }
  }, [handleCapture]);

  const flipCamera = useCallback(() => {
    setFacingMode((prevFacingMode) => (prevFacingMode === "user" ? "environment" : "user"));
  }, []);

  const startVideoPreview = useCallback(async () => {
    try {
      let constraints: MediaStreamConstraints = {
        audio: false,
        video: {
          facingMode,
          frameRate: { max: 30 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        videoRef.current.play();
      }

      // Check available cameras
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((device) => device.kind === "videoinput");
      setHasMultipleCameras(videoDevices.length > 1);
    } catch (err) {
      openErrorModal({
        title: "🚨 An error occurred",
        description: "Failed to access camera",
        onClose: () => modals.closeAll(),
      });
    }
  }, [facingMode]);

  useEffect(() => {
    startVideoPreview();
    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
      }
      if (streamRef.current) {
        stopBothVideoAndAudio(streamRef.current);
        streamRef.current = null;
      }
    };
  }, [startVideoPreview, facingMode]);

  return (
    <Stack
      className={cn(classes.container, {
        [classes.mobileVideo]: isMobile,
        [classes.desktopVideo]: !isMobile,
      })}
    >
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
