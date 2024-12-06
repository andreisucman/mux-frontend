import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { IconCloudUpload, IconArrowBackUp } from "@tabler/icons-react";
import { ActionIcon, Button, Group, rem, Stack } from "@mantine/core";
import BlurButtons from "@/components/BlurButtons";
import { BlurChoicesContext } from "@/context/BlurChoicesContext";
import { onBlurImageClick, onBlurVideoClick } from "@/functions/blur";
import callTheServer from "@/functions/callTheServer";
import openErrorModal from "@/helpers/openErrorModal";
import ResultDisplayContainer from "./ResultDisplayContainer";
import classes from "./VideoRecorderResult.module.css";
import { BlurTypeEnum } from "@/context/BlurChoicesContext/types";

type Props = {
  isVideoLoading: boolean;
  captureType?: string;
  localUrl: string;
  originalUrl: string;
  faceBlurredUrl: string;
  eyesBlurredUrl: string;
  setLocalUrl: React.Dispatch<React.SetStateAction<string>>;
  setFaceBlurredUrl: React.Dispatch<React.SetStateAction<string>>;
  setEyesBlurredUrl: React.Dispatch<React.SetStateAction<string>>;
  handleResetImage: () => void;
  handleResetRecording: () => void;
  handleSubmit: () => void;
};

type HandleBlurClickProps = {
  isBlur: boolean;
  blurType: BlurTypeEnum;
  originalUrl: string;
};

export default function VideoRecorderResult({
  captureType,
  isVideoLoading,
  originalUrl,
  localUrl,
  faceBlurredUrl,
  eyesBlurredUrl,
  setLocalUrl,
  handleSubmit,
  handleResetImage,
  setFaceBlurredUrl,
  setEyesBlurredUrl,
  handleResetRecording,
}: Props) {
  const blurContext = useContext(BlurChoicesContext);
  const { blurType, setBlurType } = blurContext;
  const [isBlurLoading, setIsBlurLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const pollBlurProgressStatus = useCallback(async (hash: string, blurType: BlurTypeEnum) => {
    try {
      setIsBlurLoading(true);

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(async () => {
        try {
          const response = await callTheServer({
            endpoint: "checkVideoBlurStatus",
            method: "POST",
            body: { hash, blurType },
          });

          if (response.status === 200) {
            const { mainUrl, progress, isRunning } = response.message || {};

            if (response.error) {
              setProgress(0);
              setIsBlurLoading(false);

              if (intervalRef.current) {
                clearInterval(intervalRef.current);
              }

              openErrorModal({ description: response.error });
              return;
            }

            if (isRunning) {
              setProgress(progress);
            } else {
              setIsBlurLoading(false);
              setProgress(0);

              if (intervalRef.current) {
                clearInterval(intervalRef.current);
              }

              if (mainUrl) {
                if (blurType === "face") {
                  setLocalUrl(mainUrl.url);
                  setFaceBlurredUrl(mainUrl.url);
                }

                if (blurType === "eyes") {
                  setEyesBlurredUrl(mainUrl.url);
                  setLocalUrl(mainUrl.url);
                }
              }
            }
          } else {
            setProgress(0);
            setIsBlurLoading(false);

            if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }

            openErrorModal({ description: response.error });
          }
        } catch (err) {
          setIsBlurLoading(false);
          setProgress(0);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          console.error("Error during polling:", err);
        }
      }, 3000);
    } catch (err) {
      console.error("Error in pollBlurProgressStatus:", err);
    }
  }, []);

  const handleBlurClick = async ({ blurType, originalUrl }: HandleBlurClickProps) => {
    if (!originalUrl) return;

    if (captureType === "image") {
      setIsBlurLoading(true);

      await onBlurImageClick({
        originalUrl,
        blurType,
        faceBlurredUrl,
        eyesBlurredUrl,
        setLocalUrl,
        setFaceBlurredUrl,
        setEyesBlurredUrl,
      });

      setIsBlurLoading(false);
    }
    if (captureType === "video") {
      await onBlurVideoClick({
        originalUrl,
        blurType,
        faceBlurredUrl,
        eyesBlurredUrl,
        setLocalUrl,
        setFaceBlurredUrl,
        setEyesBlurredUrl,
        handlePoll: pollBlurProgressStatus,
        setIsBlurLoading,
      });
    }
  };

  const handleBlurOnLoad = useCallback(async () => {
    try {
      if (captureType === "image") {
        setIsBlurLoading(true);

        await onBlurImageClick({
          originalUrl,
          blurType: BlurTypeEnum.FACE,
          faceBlurredUrl,
          eyesBlurredUrl,
          setEyesBlurredUrl,
          setFaceBlurredUrl,
          setLocalUrl,
        });

        setIsBlurLoading(false);
      }

      if (captureType === "video") {
        await onBlurVideoClick({
          originalUrl,
          blurType: BlurTypeEnum.FACE,
          faceBlurredUrl,
          eyesBlurredUrl,
          setLocalUrl,
          setFaceBlurredUrl,
          setEyesBlurredUrl,
          handlePoll: pollBlurProgressStatus,
          setIsBlurLoading,
        });
      }
    } catch (err) {
      console.log("Error in handleBlurOnLoad: ", err);
    }
  }, [captureType, blurType, originalUrl, faceBlurredUrl, eyesBlurredUrl]);

  useEffect(() => {
    if (!captureType) return;
    if (!blurContext) return;
    if (blurType === "original") return;
    handleBlurOnLoad();
  }, [typeof blurContext, captureType]);

  return (
    <Stack className={classes.content} style={isVideoLoading ? { visibility: "hidden" } : {}}>
      <Group className={classes.buttonGroup}>
        <Button onClick={handleSubmit} className={classes.button} disabled={isBlurLoading}>
          <IconCloudUpload className="icon" style={{ marginRight: rem(8) }} /> Upload
        </Button>
        <ActionIcon
          variant="default"
          disabled={isBlurLoading}
          onClick={captureType === "image" ? handleResetImage : handleResetRecording}
          className={classes.button}
          style={{ flex: 0, minWidth: rem(40) }}
        >
          <IconArrowBackUp className="icon"  />
        </ActionIcon>
      </Group>
      <ResultDisplayContainer
        createdAt={new Date().toString()}
        captureType={captureType}
        isBlurLoading={isBlurLoading}
        progress={progress}
        url={localUrl}
      />
      <BlurButtons
        disabled={isBlurLoading}
        originalUrl={originalUrl}
        onBlurClick={handleBlurClick}
      />
    </Stack>
  );
}
