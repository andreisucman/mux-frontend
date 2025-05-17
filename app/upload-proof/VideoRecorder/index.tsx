import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  IconCameraRotate,
  IconPlayerStopFilled,
  IconRotateRectangle,
  IconStopwatch,
} from "@tabler/icons-react";
import { Button, Group, rem, Stack, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import InstructionContainer from "@/components/InstructionContainer";
import base64ToBlob from "@/helpers/base64ToBlob";
import { deleteFromIndexedDb, getFromIndexedDb, saveToIndexedDb } from "@/helpers/indexedDb";
import { saveToLocalStorage } from "@/helpers/localStorage";
import openErrorModal from "@/helpers/openErrorModal";
import { getSupportedMimeType } from "@/helpers/utils";
import { SexEnum } from "@/types/global";
import RecordingStatus from "./RecordingStatus";
import VideoRecorderResult from "./VideoRecorderResult";
import classes from "./VideoRecorder.module.css";

type Props = {
  sex: SexEnum;
  taskId: string;
  taskExpired: boolean;
  instruction: string;
  uploadProof: (props: { recordedBlob: Blob | null }) => Promise<void>;
};

const RECORDING_TIME = 30_000;
const beepUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}/assets/beep.mp3`;

export default function VideoRecorder({ taskId, taskExpired, instruction, uploadProof }: Props) {
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [localUrl, setLocalUrl] = useState("");
  const [componentLoaded, setComponentLoaded] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(5);
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [orientation, setOrientation] = useState<"vertical" | "horizontal">("vertical");

  const parts = useRef<Blob[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const isMobile = useMediaQuery("(max-width: 36em)");

  const aspectRatio = useMemo(() => {
    let ratio = 0;
    if (orientation === "vertical") {
      ratio = isMobile ? 2 / 1 : 1 / 2;
    } else {
      ratio = 1 / 2;
    }
    return Number.isNaN(ratio) ? 20 / 9 : ratio;
  }, [isMobile, orientation]);

  const showStartRecording = !isRecording && !isVideoLoading && !localUrl;

  const stopTracks = useCallback((stream: MediaStream) => {
    stream.getTracks().forEach((track) => track.stop());
  }, []);

  const handleChangeOrientation = useCallback(() => {
    setOrientation((prev) => {
      const next = prev === "vertical" ? "horizontal" : "vertical";
      saveToLocalStorage("orientation", next);
      return next;
    });
  }, []);

  const startRecording = useCallback(async () => {
    if (isVideoLoading) return;
    setIsVideoLoading(true);
    parts.current = [];

    const mimeType = getSupportedMimeType() ?? "";

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          frameRate: { ideal: 30 },
          aspectRatio: { ideal: aspectRatio },
        },
        audio: true,
      });

      if (!videoRef.current) return;

      new Audio(beepUrl).play();
      videoRef.current.srcObject = stream;
      streamRef.current = stream;

      videoRef.current.onloadedmetadata = () => {
        videoRef.current?.play();
        setIsRecording(true);
        setIsVideoLoading(false);
      };

      mediaRecorder.current = new MediaRecorder(stream, { mimeType });
      mediaRecorder.current.ondataavailable = (e) => parts.current.push(e.data);
      mediaRecorder.current.onstop = () => finalizeRecording(mimeType);
      mediaRecorder.current.start();

      countdownRef.current = setTimeout(() => {
        if (mediaRecorder.current?.state !== "inactive") {
          mediaRecorder.current?.stop();
        }
      }, RECORDING_TIME);
    } catch (err) {
      setIsVideoLoading(false);
      openErrorModal({
        description: "Failed to access camera and microphone",
        onClose: () => modals.closeAll(),
      });
    }
  }, [aspectRatio, facingMode, isVideoLoading, stopTracks]);

  const finalizeRecording = async (mimeType: string) => {
    const blob = new Blob(parts.current, { type: mimeType });
    setRecordedBlob(blob);
    saveVideo(blob);

    const reader = new FileReader();
    reader.onloadend = () => {
      setLocalUrl(reader.result as string);
    };
    reader.readAsDataURL(blob);

    videoRef.current?.pause();
    videoRef.current && (videoRef.current.srcObject = null);
    streamRef.current && stopTracks(streamRef.current);
    streamRef.current = null;
    setIsRecording(false);
  };

  const startCountdown = useCallback(
    (secs: number) => {
      if (timerStarted) return;
      setTimerStarted(true);
      setSecondsLeft(secs);

      const intId = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intId);
            setTimerStarted(false);

            startRecording();

            return secs;
          }
          return prev - 1;
        });
      }, 1000);
      countdownRef.current = intId;
    },
    [timerStarted, startRecording]
  );

  const handleStop = useCallback(() => {
    if (isVideoLoading) return;
    new Audio(beepUrl).play();

    countdownRef.current && clearTimeout(countdownRef.current);

    if (mediaRecorder.current?.state !== "inactive") {
      mediaRecorder.current!.stop();
    }
    videoRef.current?.pause();
    videoRef.current && (videoRef.current.srcObject = null);
    streamRef.current && stopTracks(streamRef.current);

    setIsRecording(false);
    setLocalUrl("");
    setRecordedBlob(null);
    parts.current = [];
  }, [isVideoLoading, stopTracks]);

  const resetImage = useCallback(() => {
    setLocalUrl("");
    setRecordedBlob(null);
    deleteFromIndexedDb(`proofImage-${taskId}`);
  }, [taskId]);

  const resetRecording = useCallback(() => {
    if (isVideoLoading) return;
    videoRef.current?.pause();
    videoRef.current && (videoRef.current.srcObject = null);
    streamRef.current && stopTracks(streamRef.current);

    setIsRecording(false);
    setLocalUrl("");
    setRecordedBlob(null);
    deleteFromIndexedDb(`proofVideo-${taskId}`);
    parts.current = [];
  }, [isVideoLoading, stopTracks, taskId]);

  const saveVideo = useCallback(
    (blob: Blob) => {
      const reader = new FileReader();
      reader.onloadend = () => saveToIndexedDb(`proofVideo-${taskId}`, reader.result);
      reader.readAsDataURL(blob);
    },
    [taskId]
  );

  const handleSubmit = useCallback(async () => {
    await uploadProof({ recordedBlob });
    setLocalUrl("");
    setRecordedBlob(null);
  }, [recordedBlob, uploadProof]);

  const flipCamera = useCallback(() => {
    resetRecording();
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  }, [resetRecording]);

  const startVideoPreview = useCallback(async () => {
    try {
      streamRef.current && stopTracks(streamRef.current);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          frameRate: { max: 30 },
          aspectRatio: { ideal: aspectRatio },
        },
        audio: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      streamRef.current = stream;

      const devices = await navigator.mediaDevices.enumerateDevices();
      setHasMultipleCameras(devices.filter((d) => d.kind === "videoinput").length > 1);
    } catch (err) {
      const e = err as DOMException;
      if (e?.name === "NotAllowedError" || e?.name === "PermissionDeniedError") {
        openErrorModal({
          title: "Camera access required",
          description: "Please allow access to your camera.",
          onClose: () => modals.closeAll(),
        });
      } else {
        console.error("Unable to start camera:", err);
      }
    }
  }, [facingMode, aspectRatio, stopTracks]);

  useEffect(() => {
    if (!taskId) return;

    const loadSaved = async () => {
      const savedVideo = await getFromIndexedDb(`proofVideo-${taskId}`);

      const url = savedVideo;
      setLocalUrl(savedVideo);

      if (url) {
        setRecordedBlob(base64ToBlob(url, "video/webm"));
      } else {
        setRecordedBlob(null);
      }
    };
    loadSaved();
  }, [taskId]);

  // Start preview whenever conditions allow
  useEffect(() => {
    if (componentLoaded && showStartRecording) startVideoPreview();
  }, [componentLoaded, showStartRecording, startVideoPreview]);

  useEffect(() => {
    setComponentLoaded(true);
    return () => {
      countdownRef.current && clearTimeout(countdownRef.current);
      mediaRecorder.current?.state !== "inactive" && mediaRecorder.current?.stop();
      videoRef.current?.pause();
      videoRef.current && (videoRef.current.srcObject = null);
      streamRef.current && stopTracks(streamRef.current);
    };
  }, [stopTracks]);

  return (
    <Stack className={classes.container}>
      <InstructionContainer
        title="Instructions"
        instruction={instruction}
        customStyles={{ flex: 0 }}
      />

      <Stack className={classes.content} style={isVideoLoading ? { visibility: "hidden" } : {}}>
        {!localUrl && (
          <>
            {isRecording && <RecordingStatus recordingTime={RECORDING_TIME} />}
            {timerStarted && (
              <div className={classes.timerOverlay}>
                <Text fz={40}>{secondsLeft}</Text>
              </div>
            )}

            <div className={classes.videoWrapper}>
              <video
                ref={videoRef}
                className={classes.video}
                style={{ aspectRatio }}
                autoPlay
                muted
              />
            </div>

            <Group className={classes.buttonGroup}>
              {/* Left button cluster */}
              <Group>
                {!isRecording && (
                  <>
                    {hasMultipleCameras && (
                      <Button
                        variant="default"
                        onClick={flipCamera}
                        className={classes.button}
                        style={{ flexGrow: 0, padding: 0 }}
                        miw={rem(50)}
                        disabled={taskExpired}
                      >
                        <IconCameraRotate size={20} />
                      </Button>
                    )}

                    <Button
                      variant="default"
                      disabled={timerStarted}
                      onClick={handleChangeOrientation}
                      className={classes.button}
                      style={{ flexGrow: 0, padding: 0 }}
                      miw={rem(50)}
                    >
                      <IconRotateRectangle size={20} style={{ transform: "rotate(190deg)" }} />
                    </Button>
                  </>
                )}
              </Group>

              {/* Right button cluster */}
              <Group>
                {showStartRecording && (
                  <>
                    {[5, 15].map((s) => (
                      <Button
                        key={s}
                        variant="default"
                        disabled={timerStarted}
                        onClick={() => startCountdown(s)}
                        className={classes.button}
                        style={{ flexGrow: 0, padding: 0 }}
                        miw={rem(50)}
                      >
                        <Text mr={2}>{s}</Text>
                        <IconStopwatch size={20} />
                      </Button>
                    ))}
                  </>
                )}

                {isRecording && (
                  <Button
                    variant="default"
                    disabled={timerStarted || taskExpired}
                    onClick={handleStop}
                    className={classes.button}
                  >
                    <IconPlayerStopFilled size={20} style={{ marginRight: rem(6) }} />
                    Finish
                  </Button>
                )}

                {showStartRecording && (
                  <Button
                    onClick={startRecording}
                    className={classes.button}
                    disabled={taskExpired || timerStarted}
                  >
                    Record
                  </Button>
                )}
              </Group>
            </Group>
          </>
        )}
        {localUrl && (
          <VideoRecorderResult
            isVideoLoading={isVideoLoading}
            localUrl={localUrl}
            handleResetImage={resetImage}
            handleResetRecording={resetRecording}
            handleSubmit={handleSubmit}
            setLocalUrl={setLocalUrl}
          />
        )}
      </Stack>
    </Stack>
  );
}
