import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { IconCamera, IconCameraRotate, IconPlayerStopFilled, IconVideo } from "@tabler/icons-react";
import { Button, Group, rem, SegmentedControl, Skeleton, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import InstructionContainer from "@/components/InstructionContainer";
import { BlurChoicesContext } from "@/context/BlurChoicesContext";
import base64ToBlob from "@/helpers/base64ToBlob";
import {
  deleteFromLocalStorage,
  getFromLocalStorage,
  saveToLocalStorage,
} from "@/helpers/localStorage";
import openErrorModal from "@/helpers/openErrorModal";
import { getSupportedMimeType } from "@/helpers/utils";
import RecordingStatus from "./RecordingStatus";
import VideoRecorderResult from "./VideoRecorderResult";
import classes from "./VideoRecorder.module.css";

type Props = {
  sex: string;
  instruction: string;
  uploadProof: (props: any) => void;
};

const RECORDING_TIME = 15000;

const segments = [
  { value: "image", label: "📸 Photo" },
  { value: "video", label: "🎥 Video" },
];

export default function VideoRecorder({ sex, instruction, uploadProof }: Props) {
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

  let constraints: MediaStreamConstraints = {
    video: {
      width: { ideal: 1080 },
      height: { ideal: 1920 },
      facingMode,
      aspectRatio: 9 / 16,
      frameRate: { max: 30 },
    },
  };

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

    constraints = {
      ...constraints,
      audio: true,
    };

    const mimeType = getSupportedMimeType();

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        if (!videoRef.current) return;

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
      setLocalUrl(url);
      saveVideo(blob);

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
      saveToLocalStorage("proofRecords", { image: imageData }, "add");
    } catch (err) {
      console.log("Error in capturePhoto: ", err);
    }
  }, [videoRef.current, captureType]);

  const handleStop = useCallback(() => {
    if (isVideoLoading) return;
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
    deleteFromLocalStorage("proofRecords", "video");

    parts.current = [];
  }, [isVideoLoading, stopBothVideoAndAudio]);

  const handleResetImage = useCallback(() => {
    setOriginalUrl("");
    setLocalUrl("");
    setEyesBlurredUrl("");
    setFaceBlurredUrl("");
    setRecordedBlob(null);
    setIsRecording(false);
    deleteFromLocalStorage("proofRecords", "image");
  }, [captureType]);

  const saveVideo = useCallback(
    (blob: Blob) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = function () {
        saveToLocalStorage("proofRecords", { video: reader.result }, "add");
      };
    },
    [captureType]
  );

  const handleSubmit = useCallback(() => {
    if (!captureType) return;
    if (!recordedBlob) return;

    uploadProof({
      recordedBlob,
      captureType,
      blurType,
      deleteFromLocalStorage,
    });
    setEyesBlurredUrl("");
    setFaceBlurredUrl("");
    setOriginalUrl("");
    setLocalUrl("");
    setRecordedBlob(null);
  }, [recordedBlob, uploadProof, captureType]);

  const flipCamera = useCallback(() => {
    setFacingMode((prevFacingMode) => (prevFacingMode === "user" ? "environment" : "user"));
  }, []);

  const handleChangeCaptureType = useCallback(
    (captureType: string) => {
      if (isRecording) return;
      setCaptureType(captureType);
      saveToLocalStorage("captureType", captureType);

      const savedRecords: { [key: string]: any } | null = getFromLocalStorage("proofRecords");

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
  }, [videoRef.current, streamRef.current, isRecording, isVideoLoading]);

  useEffect(() => {
    const savedCaptureType: string | null = getFromLocalStorage("captureType");
    setCaptureType(savedCaptureType ? savedCaptureType : "image");
  }, []);

  useEffect(() => {
    if (!captureType) return;

    const savedRecords: { [key: string]: any } | null = getFromLocalStorage("proofRecords");

    let typeRecord;
    let blob = null;

    if (savedRecords) {
      typeRecord = savedRecords[captureType];

      if (typeRecord) {
        const blob = base64ToBlob(
          typeRecord,
          captureType === "image" ? "image/jpeg" : "video/webm"
        );

        setRecordedBlob(blob);
      }
    }

    setOriginalUrl(typeRecord ? typeRecord : "");
    setLocalUrl(typeRecord ? typeRecord : "");
    setRecordedBlob(blob);
  }, [captureType]);

  useEffect(() => {
    if (!componentLoaded) return;
    if (!showStartRecording) return;
    startVideoPreview();
  }, [componentLoaded, showStartRecording]);

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
  const startIcon =
    captureType === "image" ? (
      <IconCamera className="icon" style={{ marginRight: rem(8) }} />
    ) : (
      <IconVideo className="icon" style={{ marginRight: rem(8) }} />
    );

  return (
    <Stack className={classes.container}>
      <InstructionContainer
        sex={sex}
        title="Instructions"
        instruction={instruction}
        customStyles={{ flex: 0 }}
      />

      <SegmentedControl value={captureType} onChange={handleChangeCaptureType} data={segments} />

      {!originalUrl && (
        <Skeleton visible={isVideoLoading} className="skeleton">
          <Stack className={classes.content} style={isVideoLoading ? { visibility: "hidden" } : {}}>
            {isRecording && <RecordingStatus recordingTime={recordingTime} />}
            <video ref={videoRef} className={classes.video} autoPlay muted></video>
            <Group className={classes.buttonGroup} style={isRecording ? { left: "unset" } : {}}>
              {!isRecording && hasMultipleCameras && (
                <Button
                  variant="default"
                  onClick={flipCamera}
                  className={classes.button}
                  style={{ flexGrow: 0, padding: 0 }}
                  miw={rem(50)}
                >
                  <IconCameraRotate className="icon" />
                </Button>
              )}
              {isRecording && (
                <Button variant="default" onClick={handleStop} className={classes.button}>
                  <IconPlayerStopFilled className="icon" style={{ marginRight: rem(8) }} /> Finish
                </Button>
              )}
              {showStartRecording && (
                <Button
                  onClick={captureType === "image" ? capturePhoto : startRecording}
                  className={classes.button}
                >
                  {startText}
                  {startIcon}
                </Button>
              )}
            </Group>
          </Stack>
        </Skeleton>
      )}
      {originalUrl && (
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
      )}
    </Stack>
  );
}
