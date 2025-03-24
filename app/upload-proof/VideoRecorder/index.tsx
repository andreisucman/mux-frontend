import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  IconCamera,
  IconCameraRotate,
  IconFlipHorizontal,
  IconPlayerStopFilled,
  IconRotateRectangle,
  IconStopwatch,
  IconVideo,
} from "@tabler/icons-react";
import { Button, Group, rem, SegmentedControl, Stack, Text } from "@mantine/core";
import { useMediaQuery, useViewportSize } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import InstructionContainer from "@/components/InstructionContainer";
import adjustVideoQuality from "@/helpers/adjustVideoQuality";
import base64ToBlob from "@/helpers/base64ToBlob";
import { deleteFromIndexedDb, getFromIndexedDb, saveToIndexedDb } from "@/helpers/indexedDb";
import { getFromLocalStorage, saveToLocalStorage } from "@/helpers/localStorage";
import openErrorModal from "@/helpers/openErrorModal";
import { getSupportedMimeType } from "@/helpers/utils";
import { SexEnum } from "@/types/global";
import RecordingStatus from "./RecordingStatus";
import VideoRecorderResult from "./VideoRecorderResult";
import classes from "./VideoRecorder.module.css";

type StartRecordingProps = {
  facingMode: "user" | "environment";
  aspectRatio: number;
  videoRef: any;
  streamRef: any;
  isVideoLoading: boolean;
  setIsVideoLoading: React.Dispatch<React.SetStateAction<boolean>>;
  stopBothVideoAndAudio: (props: any) => void;
};

type Props = {
  sex: SexEnum;
  taskExpired: boolean;
  instruction: string;
  uploadProof: (props: any) => Promise<void>;
};

const RECORDING_TIME = 30000;
const beepUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}/assets/beep.mp3`;
const shutterUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}/assets/shutter.mp3`;

const segments = [
  {
    value: "image",
    label: (
      <span className={classes.indicatorLabel}>
        <IconCamera className="icon" style={{ marginRight: rem(6) }} /> Photo
      </span>
    ),
  },
  {
    value: "video",
    label: (
      <span className={classes.indicatorLabel}>
        <IconVideo className="icon" style={{ marginRight: rem(6) }} /> Video
      </span>
    ),
  },
];

export default function VideoRecorder({ taskExpired, instruction, uploadProof }: Props) {
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [localUrl, setLocalUrl] = useState("");
  const [componentLoaded, setComponentLoaded] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(5);

  const parts = useRef<Blob[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(document.createElement("canvas"));
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [recordingTime, setRecordingTime] = useState(RECORDING_TIME);
  const [isRecording, setIsRecording] = useState(false);
  const [captureType, setCaptureType] = useState<string>("image");
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [orientation, setOrientation] = useState<"vertical" | "horizontal">("vertical");

  const { width: viewportWidth, height: viewportHeight } = useViewportSize();
  const isMobile = useMediaQuery("(max-width: 36em)");

  const savedCaptureType: string | null = getFromLocalStorage("captureType");

  const aspectRatio = useMemo(() => {
    let ratio = 0;
    if (orientation === "vertical") {
      ratio = isMobile ? viewportHeight / viewportWidth : 1;
    } else {
      ratio = 9 / 16;
    }
    return isNaN(ratio) ? 20 / 9 : ratio;
  }, [viewportWidth, viewportHeight, isMobile, orientation]);

  const showStartRecording = !isRecording && !isVideoLoading && !localUrl;

  const handleChangeOrientation = useCallback(() => {
    setOrientation((prev) => {
      let newOrientation: "vertical" | "horizontal" = "vertical";

      if (prev === "vertical") {
        newOrientation = "horizontal";
      }

      saveToLocalStorage("orientation", newOrientation);
      return newOrientation;
    });
  }, [orientation]);

  const stopBothVideoAndAudio = useCallback((stream: MediaStream) => {
    stream.getTracks().forEach((track) => {
      if (track.readyState === "live") {
        track.stop();
      }
    });
  }, []);

  const startRecording = useCallback(
    ({
      facingMode,
      aspectRatio,
      videoRef,
      streamRef,
      isVideoLoading,
      setIsVideoLoading,
      stopBothVideoAndAudio,
    }: StartRecordingProps) => {
      if (isVideoLoading) return;
      setIsVideoLoading(true);

      parts.current = [];

      let constraints: MediaStreamConstraints = {
        video: {
          facingMode,
          frameRate: { ideal: 30 },
          aspectRatio: { ideal: aspectRatio },
        },
        audio: true,
      };

      const mimeType = getSupportedMimeType();

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          if (!videoRef.current) return;
          const beep = new Audio(beepUrl);

          beep.play();
          videoRef.current.srcObject = stream;
          streamRef.current = stream;

          videoRef.current.onloadedmetadata = () => {
            if (!videoRef.current) return;
            videoRef.current.play();
            setIsRecording(true);
            setIsVideoLoading(false);
          };

          const options: MediaRecorderOptions = {
            mimeType,
            videoBitsPerSecond: 5000000,
          };

          mediaRecorder.current = new MediaRecorder(stream, options);

          mediaRecorder.current.ondataavailable = (e) => {
            parts.current.push(e.data);
          };

          mediaRecorder.current.onstop = async () => {
            await finalize(parts.current);
          };

          mediaRecorder.current.start();

          timeoutIdRef.current = setTimeout(() => {
            if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
              mediaRecorder.current.stop();
            }

            clearTimeout(timeoutIdRef.current as NodeJS.Timeout);
            timeoutIdRef.current = null;
          }, RECORDING_TIME);
        })
        .catch((err) => {
          setIsVideoLoading(false);
          openErrorModal({
            description: "Failed to access camera and microphone",
            onClose: () => modals.closeAll(),
          });
        });

      async function finalize(parts: Blob[]) {
        const blob = new Blob(parts, {
          type: mimeType,
        });

        setRecordedBlob(blob);
        saveVideo(blob);

        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64data = reader.result as string;
          setLocalUrl(base64data);
        };

        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.srcObject = null;
        }

        if (streamRef.current) {
          stopBothVideoAndAudio(streamRef.current);
          streamRef.current = null;
        }

        setIsRecording(false);
      }
    },
    [aspectRatio]
  );

  const capturePhoto = useCallback(async () => {
    if (captureType === "video") return;
    if (!videoRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    try {
      const shutter = new Audio(shutterUrl);

      shutter.play();
      const video = videoRef.current;
      if (!video.videoWidth || !video.videoHeight) return;

      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      const imageData = canvas.toDataURL("image/jpeg");

      const res = await fetch(imageData);
      const blob = await res.blob();

      setLocalUrl(imageData);
      setRecordedBlob(blob);
      saveToIndexedDb("proofImage", imageData);
    } catch (err) {
      console.log("Error in capturePhoto: ", err);
    }
  }, [videoRef.current, captureType, aspectRatio]);

  const startDelayedCapture = (seconds: number) => {
    if (timerStarted) return;
    setTimerStarted(true);
    setSecondsLeft(seconds);

    const tick = (remaining: number) => {
      if (remaining <= 0) {
        setTimerStarted(false);
        if (captureType === "image") capturePhoto();
        if (captureType === "video")
          startRecording({
            facingMode,
            aspectRatio,
            videoRef,
            streamRef,
            isVideoLoading,
            setIsVideoLoading,
            stopBothVideoAndAudio,
          });
        setSecondsLeft(seconds);
      } else {
        setSecondsLeft(remaining);
        setTimeout(() => tick(remaining - 1), 1000);
      }
    };
    tick(seconds);
  };

  const handleStop = useCallback(() => {
    if (isVideoLoading) return;
    const beep = new Audio(beepUrl);
    beep.play();

    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
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
      streamRef.current = null;
    }

    setIsRecording(false);
    setLocalUrl("");
    setRecordedBlob(null);
    parts.current = [];
  }, [isVideoLoading, stopBothVideoAndAudio]);

  const handleResetRecording = useCallback(() => {
    if (isVideoLoading) return;

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }

    if (streamRef.current) {
      stopBothVideoAndAudio(streamRef.current);
      streamRef.current = null;
    }

    setIsRecording(false);
    setLocalUrl("");
    setRecordedBlob(null);
    setRecordingTime(RECORDING_TIME);
    deleteFromIndexedDb("proofVideo");

    parts.current = [];
  }, [isVideoLoading, stopBothVideoAndAudio]);

  const handleResetImage = useCallback(() => {
    setLocalUrl("");
    setRecordedBlob(null);
    setIsRecording(false);
    deleteFromIndexedDb("proofImage");
  }, [captureType]);

  const saveVideo = useCallback(
    (blob: Blob) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = function () {
        saveToIndexedDb("proofVideo", reader.result);
      };
    },
    [captureType]
  );

  const handleSubmit = useCallback(async () => {
    await uploadProof({
      recordedBlob,
      captureType,
    });
    setLocalUrl("");
    setRecordedBlob(null);
  }, [recordedBlob, uploadProof, captureType]);

  const flipCamera = useCallback(() => {
    handleResetRecording();
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  }, [facingMode, facingMode]);

  const handleChangeCaptureType = useCallback(
    async (captureType: string) => {
      if (isRecording) return;
      setCaptureType(captureType as string);
      saveToLocalStorage("captureType", captureType);

      const savedVideo = await getFromIndexedDb("proofVideo");
      const savedImage = await getFromIndexedDb("proofImage");
      const savedRecords: { [key: string]: any } = { image: savedImage, video: savedVideo };

      if (savedRecords) {
        const newTypeRecord = savedRecords[captureType];
        const newUrl = newTypeRecord ? newTypeRecord : "";
        setLocalUrl(newUrl);
      }
    },
    [isRecording]
  );

  const startVideoPreview = useCallback(async () => {
    if (streamRef.current) {
      stopBothVideoAndAudio(streamRef.current);
    }
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode,
          frameRate: { max: 30 },
          aspectRatio: { ideal: aspectRatio },
        },
        audio: true,
      };

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
        description: "Failed to access camera",
        onClose: () => modals.closeAll(),
      });
    }
  }, [videoRef.current, streamRef.current, isRecording, isVideoLoading, facingMode, aspectRatio]);

  useEffect(() => {
    setCaptureType(savedCaptureType ? savedCaptureType : "image");
  }, [savedCaptureType]);

  useEffect(() => {
    if (!captureType) return;

    const loadSaved = async () => {
      const savedImage = await getFromIndexedDb("proofImage");
      const savedVideo = await getFromIndexedDb("proofVideo");
      const savedRecords: { [key: string]: any } = { image: savedImage, video: savedVideo };

      let typeRecord;
      let blob = null;

      if (savedRecords) {
        typeRecord = savedRecords[captureType];

        if (typeRecord) {
          blob = base64ToBlob(typeRecord, captureType === "image" ? "image/jpeg" : "video/webm");
        }
      }

      const savedUrl = typeRecord ? typeRecord : "";

      setLocalUrl(savedUrl);
      setRecordedBlob(blob);
    };
    loadSaved();
  }, [captureType]);

  useEffect(() => {
    if (!componentLoaded) return;
    if (!showStartRecording) return;
    startVideoPreview();
  }, [facingMode, componentLoaded, showStartRecording, aspectRatio]);

  useEffect(() => {
    setComponentLoaded(true);

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

  const startText = captureType === "image" ? "Capture" : "Start";

  return (
    <Stack className={classes.container}>
      <InstructionContainer
        title="Instructions"
        instruction={instruction}
        customStyles={{ flex: 0 }}
      />
      <SegmentedControl value={captureType} onChange={handleChangeCaptureType} data={segments} />
      <Stack className={classes.content} style={isVideoLoading ? { visibility: "hidden" } : {}}>
        {!localUrl && (
          <>
            {isRecording && <RecordingStatus recordingTime={recordingTime} />}
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
              ></video>
            </div>
            <Group className={classes.buttonGroup}>
              <Group>
                {!isRecording && hasMultipleCameras && (
                  <Button
                    variant="default"
                    onClick={flipCamera}
                    className={classes.button}
                    style={{ flexGrow: 0, padding: 0 }}
                    miw={rem(50)}
                    disabled={taskExpired}
                  >
                    <IconCameraRotate className="icon" />
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
                  <IconRotateRectangle className="icon" style={{ transform: "rotate(190deg)" }} />
                </Button>
              </Group>

              <Group>
                {showStartRecording && (
                  <>
                    <Button
                      variant="default"
                      disabled={timerStarted}
                      onClick={() => startDelayedCapture(5)}
                      className={classes.button}
                      style={{ flexGrow: 0, padding: 0 }}
                      miw={rem(50)}
                    >
                      <Text mr={2}>5</Text>
                      <IconStopwatch className="icon" />
                    </Button>
                    <Button
                      variant="default"
                      disabled={timerStarted}
                      onClick={() => startDelayedCapture(15)}
                      className={classes.button}
                      style={{ flexGrow: 0, padding: 0 }}
                      miw={rem(50)}
                    >
                      <Text mr={2}>15</Text>
                      <IconStopwatch className="icon" />
                    </Button>
                  </>
                )}
                {isRecording && (
                  <Button
                    variant="default"
                    disabled={timerStarted || taskExpired}
                    onClick={handleStop}
                    className={classes.button}
                  >
                    <IconPlayerStopFilled className="icon" style={{ marginRight: rem(6) }} /> Finish
                  </Button>
                )}
                {showStartRecording && (
                  <Button
                    onClick={
                      captureType === "image"
                        ? capturePhoto
                        : () =>
                            startRecording({
                              facingMode,
                              aspectRatio,
                              videoRef,
                              streamRef,
                              isVideoLoading,
                              setIsVideoLoading,
                              stopBothVideoAndAudio,
                            })
                    }
                    className={classes.button}
                    disabled={taskExpired || timerStarted}
                  >
                    {startText}
                  </Button>
                )}
              </Group>
            </Group>
          </>
        )}
        {localUrl && (
          <VideoRecorderResult
            captureType={captureType}
            isVideoLoading={isVideoLoading}
            localUrl={localUrl}
            handleResetImage={handleResetImage}
            handleResetRecording={handleResetRecording}
            handleSubmit={handleSubmit}
            setLocalUrl={setLocalUrl}
          />
        )}
      </Stack>
    </Stack>
  );
}
