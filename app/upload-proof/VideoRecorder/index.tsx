import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { IconCamera, IconCameraRotate, IconPlayerStopFilled, IconVideo } from "@tabler/icons-react";
import { Button, Group, rem, SegmentedControl, Skeleton, Stack } from "@mantine/core";
import { useMediaQuery, useViewportSize } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import InstructionContainer from "@/components/InstructionContainer";
import { BlurChoicesContext } from "@/context/BlurChoicesContext";
import base64ToBlob from "@/helpers/base64ToBlob";
import { deleteFromIndexedDb, getFromIndexedDb, saveToIndexedDb } from "@/helpers/indexedDb";
import { getFromLocalStorage, saveToLocalStorage } from "@/helpers/localStorage";
import openErrorModal from "@/helpers/openErrorModal";
import { getSupportedMimeType } from "@/helpers/utils";
import { SexEnum } from "@/types/global";
import RecordingStatus from "./RecordingStatus";
import VideoRecorderResult from "./VideoRecorderResult";
import classes from "./VideoRecorder.module.css";

type Props = {
  sex: SexEnum;
  taskExpired: boolean;
  instruction: string;
  uploadProof: (props: any) => Promise<void>;
};

const RECORDING_TIME = 20000;
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
  const { blurType } = useContext(BlurChoicesContext);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [localUrl, setLocalUrl] = useState("");
  const [originalUrl, setOriginalUrl] = useState<string>("");
  const [faceBlurredUrl, setFaceBlurredUrl] = useState("");
  const [eyesBlurredUrl, setEyesBlurredUrl] = useState("");
  const [componentLoaded, setComponentLoaded] = useState(false);

  const parts = useRef<Blob[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [recordingTime, setRecordingTime] = useState(RECORDING_TIME);
  const [isRecording, setIsRecording] = useState(false);
  const [captureType, setCaptureType] = useState<string>();
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);

  const { width: viewportWidth, height: viewportHeight } = useViewportSize();
  const isMobile = useMediaQuery("(max-width: 36em)");

  const showStartRecording = !isRecording && !isVideoLoading && !originalUrl;

  const stopBothVideoAndAudio = useCallback((stream: MediaStream) => {
    stream.getTracks().forEach((track) => {
      if (track.readyState === "live") {
        track.stop();
      }
    });
  }, []);

  const startRecording = useCallback(() => {
    if (isVideoLoading) return;
    setIsVideoLoading(true);
    parts.current = [];

    let constraints: MediaStreamConstraints = {
      video: {
        facingMode,
        frameRate: { max: 30 },
        aspectRatio: { ideal: aspectRatio },
        // width: { ideal: 1080 },
        // height: { ideal: 1920 },
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

        const options = {
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

      const url = URL.createObjectURL(blob);
      setRecordedBlob(blob);
      setOriginalUrl(url);
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
  }, [isVideoLoading, setIsVideoLoading, stopBothVideoAndAudio]);

  const capturePhoto = useCallback(async () => {
    if (captureType === "video") return;
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
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

      setOriginalUrl(imageData);
      setLocalUrl(imageData);
      setRecordedBlob(blob);
      saveToIndexedDb("proofImage", imageData);
    } catch (err) {
      console.log("Error in capturePhoto: ", err);
    }
  }, [videoRef.current, captureType]);

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
    setOriginalUrl("");
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
    setOriginalUrl("");
    setLocalUrl("");
    setEyesBlurredUrl("");
    setFaceBlurredUrl("");
    setRecordedBlob(null);
    setRecordingTime(RECORDING_TIME);
    deleteFromIndexedDb("proofVideo");

    parts.current = [];
  }, [isVideoLoading, stopBothVideoAndAudio]);

  const handleResetImage = useCallback(() => {
    setOriginalUrl("");
    setLocalUrl("");
    setEyesBlurredUrl("");
    setFaceBlurredUrl("");
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
      blurType,
    });
    setEyesBlurredUrl("");
    setFaceBlurredUrl("");
    setOriginalUrl("");
    setLocalUrl("");
    setRecordedBlob(null);
  }, [recordedBlob, uploadProof, captureType]);

  const flipCamera = useCallback(() => {
    handleResetRecording();
    setFacingMode((prevFacingMode) => (prevFacingMode === "user" ? "environment" : "user"));
  }, [facingMode]);

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

        setOriginalUrl(newUrl);
        setLocalUrl(newUrl);
        setEyesBlurredUrl("");
        setFaceBlurredUrl("");
      }
    },
    [isRecording]
  );

  const startVideoPreview = useCallback(async () => {
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode,
          frameRate: { max: 30 },
          aspectRatio: { ideal: aspectRatio },
          // width: { ideal: 1080 },
          // height: { ideal: 1920 },
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
  }, [videoRef.current, streamRef.current, isRecording, isVideoLoading, facingMode]);

  useEffect(() => {
    const savedCaptureType: string | null = getFromLocalStorage("captureType");
    setCaptureType(savedCaptureType ? savedCaptureType : "image");
  }, []);

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

      setOriginalUrl(savedUrl);
      setLocalUrl(savedUrl);
      setRecordedBlob(blob);
    };
    loadSaved();
  }, [captureType]);

  useEffect(() => {
    if (!componentLoaded) return;
    if (!showStartRecording) return;
    startVideoPreview();
  }, [facingMode, componentLoaded, showStartRecording]);

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

  const startText = captureType === "image" ? "Take the photo" : "Start recording";

  const aspectRatio = useMemo(() => {
    const ratio = isMobile ? viewportHeight / viewportWidth : 1;
    return isNaN(ratio) ? 20 / 9 : ratio;
  }, [viewportWidth, viewportHeight, isMobile]);

  return (
    <Stack className={classes.container}>
      <InstructionContainer
        title="Instructions"
        instruction={instruction}
        customStyles={{ flex: 0 }}
      />

      <SegmentedControl value={captureType} onChange={handleChangeCaptureType} data={segments} />

      {!originalUrl && (
        <Stack className={classes.content} style={isVideoLoading ? { visibility: "hidden" } : {}}>
          {isRecording && <RecordingStatus recordingTime={recordingTime} />}
          <div className={classes.videoWrapper}>
            <video
              ref={videoRef}
              className={classes.video}
              style={{ aspectRatio }}
              autoPlay
              muted
            ></video>
          </div>
          <Group className={classes.buttonGroup} style={isRecording ? { left: "unset" } : {}}>
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
            {isRecording && (
              <Button
                variant="default"
                onClick={handleStop}
                className={classes.button}
                disabled={taskExpired}
              >
                <IconPlayerStopFilled className="icon" style={{ marginRight: rem(6) }} /> Finish
              </Button>
            )}
            {showStartRecording && (
              <Button
                onClick={captureType === "image" ? capturePhoto : startRecording}
                className={classes.button}
                disabled={taskExpired}
              >
                {startText}
              </Button>
            )}
          </Group>
        </Stack>
      )}
      {originalUrl && (
        <Stack className={classes.content}>
          <VideoRecorderResult
            captureType={captureType}
            isVideoLoading={isVideoLoading}
            localUrl={localUrl}
            originalUrl={originalUrl}
            eyesBlurredUrl={eyesBlurredUrl}
            faceBlurredUrl={faceBlurredUrl}
            handleResetImage={handleResetImage}
            handleResetRecording={handleResetRecording}
            handleSubmit={handleSubmit}
            setEyesBlurredUrl={setEyesBlurredUrl}
            setFaceBlurredUrl={setFaceBlurredUrl}
            setLocalUrl={setLocalUrl}
          />
        </Stack>
      )}
    </Stack>
  );
}
