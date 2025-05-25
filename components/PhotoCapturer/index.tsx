import React, { useCallback, useEffect, useRef, useState } from "react";
import { IconCamera, IconCameraRotate, IconStopwatch, IconX } from "@tabler/icons-react";
import cn from "classnames";
import { ActionIcon, Button, Group, rem, Stack, Text } from "@mantine/core";
import { useMediaQuery, useViewportSize } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import openErrorModal from "@/helpers/openErrorModal";
import classes from "./PhotoCapturer.module.css";

/**
 * Which camera to request from `getUserMedia`.
 */
export type FacingMode = "user" | "environment";

export interface PhotoCapturerProps {
  /** Preferred camera on first mount. */
  defaultFacingMode?: FacingMode;
  /** Hide the 5‑second delay button. */
  hide5s?: boolean;
  /** Hide the 15‑second delay button. */
  hide15s?: boolean;
  /** Hide the flip‑camera button (useful on devices with just one camera). */
  hideFlipCamera?: boolean;
  /** (Reserved for future) path to a PNG to overlay as silhouette. */
  silhouette?: string;
  /** Called when the user presses ✕. */
  handleCancel?: () => void;
  /** Called with the captured JPEG (base64 data‑URL). */
  handleCapture: (base64string: string) => void;
}

const audioUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}/assets/shutter.mp3`;

export default function PhotoCapturer({
  handleCapture,
  handleCancel,
  defaultFacingMode = "user",
  hide5s,
  hide15s,
  hideFlipCamera,
}: PhotoCapturerProps) {
  const [facingMode, setFacingMode] = useState<FacingMode>(defaultFacingMode);
  const isMobile = useMediaQuery("(max-width: 36em)");

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerIdRef = useRef<number>();

  /** State */
  const [secondsLeft, setSecondsLeft] = useState(5);
  const [timerStarted, setTimerStarted] = useState(false);
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);

  /** Stop every live track of `stream`, swallowing any errors. */
  const stopStream = useCallback((stream: MediaStream | null) => {
    if (!stream) return;
    stream.getTracks().forEach((track) => {
      try {
        track.stop();
      } catch {
        /* ignore */
      }
    });
  }, []);

  /** Play the shutter sound (ignore autoplay errors). */
  const playShutter = () => audioRef.current?.play().catch(() => {});

  /** Capture current frame → JPEG → parent */
  const capturePhoto = useCallback(() => {
    const video = videoRef.current;
    if (!video?.videoWidth || !video.videoHeight) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    playShutter();
    handleCapture(canvas.toDataURL("image/jpeg"));
  }, [handleCapture]);

  /** Countdown helper before `capturePhoto()` */
  const startDelayedCapture = (delay: number) => {
    if (timerStarted) return;

    setTimerStarted(true);
    setSecondsLeft(delay);

    timerIdRef.current = window.setInterval(() => {
      setSecondsLeft((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          window.clearInterval(timerIdRef.current);
          timerIdRef.current = undefined;
          setTimerStarted(false);
          capturePhoto();
          return delay; // reset for next time
        }
        return next;
      });
    }, 1_000);
  };

  /** Swap between front & back cameras */
  const flipCamera = useCallback(() => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  }, []);

  /** On mobile we keep the aspect the same as the screen, on desktop we prefer square. */

  /** (Re)start the camera stream. Runs on mount + when constraints change. */
  const startVideoPreview = useCallback(async () => {
    stopStream(streamRef.current); // dispose previous stream first

    try {
      const constraints: MediaStreamConstraints = {
        audio: false,
        video: {
          facingMode,
          frameRate: { max: 30 },
          aspectRatio: { ideal: isMobile ? 2 / 1 : 1 / 2 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      /* Determine if the device exposes more than one camera */
      const devices = await navigator.mediaDevices.enumerateDevices();
      const numCams = devices.filter((d) => d.kind === "videoinput").length;
      setHasMultipleCameras(numCams > 1);
    } catch (err) {
      const error = err as DOMException;
      let title = "";
      let description = "";

      if (error?.name === "NotAllowedError" || error?.name === "PermissionDeniedError") {
        title = "Camera access required";
        description = "Please allow access to your camera to take a photo.";
      } else if (error?.name === "NotFoundError") {
        title = "Camera error";
        description = "Camera not found.";
      }

      if (title) {
        openErrorModal({
          title,
          description,
          onClose: () => modals.closeAll(),
        });
      }
    }
  }, [facingMode, isMobile, stopStream]);

  useEffect(() => {
    startVideoPreview();

    return () => {
      if (timerIdRef.current) window.clearInterval(timerIdRef.current);
      stopStream(streamRef.current);
      streamRef.current = null;
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
      }
    };
  }, [startVideoPreview, stopStream]);

  return (
    <Stack
      className={cn(classes.container, {
        [classes.mobileVideo]: isMobile,
        [classes.desktopVideo]: !isMobile,
      })}
    >
      <video ref={videoRef} autoPlay muted playsInline />

      {timerStarted && (
        <div className={classes.timerOverlay}>
          <Text fz={40} c="red.7">
            {secondsLeft}
          </Text>
        </div>
      )}

      <div className={classes.grid} />
      <Group className={classes.buttonGroup}>
        <audio ref={audioRef} hidden preload="auto" src={audioUrl} />

        {handleCancel && (
          <ActionIcon variant="default" className={classes.close} onClick={handleCancel}>
            <IconX size={20} />
          </ActionIcon>
        )}

        {!hide5s && (
          <Button
            variant="default"
            disabled={timerStarted}
            onClick={() => startDelayedCapture(5)}
            className={classes.button}
            style={{ flexGrow: 0, padding: 0 }}
            miw={rem(50)}
          >
            <Text mr={2}>5</Text>
            <IconStopwatch size={20} />
          </Button>
        )}

        {!hide15s && (
          <Button
            variant="default"
            disabled={timerStarted}
            onClick={() => startDelayedCapture(15)}
            className={classes.button}
            style={{ flexGrow: 0, padding: 0 }}
            miw={rem(50)}
          >
            <Text mr={2}>15</Text>
            <IconStopwatch size={20} />
          </Button>
        )}

        {!hideFlipCamera && hasMultipleCameras && (
          <Button
            variant="default"
            disabled={timerStarted}
            onClick={flipCamera}
            className={classes.button}
            style={{ flexGrow: 0, padding: 0 }}
            miw={rem(50)}
          >
            <IconCameraRotate size={20} />
          </Button>
        )}

        <Button
          variant="filled"
          disabled={timerStarted}
          onClick={capturePhoto}
          className={classes.button}
        >
          <IconCamera size={20} />
        </Button>
      </Group>
    </Stack>
  );
}
