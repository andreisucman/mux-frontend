import React, { memo, useCallback, useContext, useEffect, useState } from "react";
import { IconX } from "@tabler/icons-react";
import { ActionIcon, Button, Group, rem, Stack } from "@mantine/core";
import BlurButtons from "@/components/BlurButtons";
import { BlurChoicesContext } from "@/context/BlurChoicesContext";
import { BlurTypeEnum } from "@/context/BlurChoicesContext/types";
import { onBlurImageClick } from "@/functions/blur";
import ResultDisplayContainer from "./ResultDisplayContainer";
import classes from "./VideoRecorderResult.module.css";

type Props = {
  captureType?: string;
  isVideoLoading: boolean;
  localUrl: string;
  originalUrl: string;
  faceBlurredUrl: string;
  eyesBlurredUrl: string;
  handleSubmit: () => void;
  handleResetImage: () => void;
  handleResetRecording: () => void;
  setLocalUrl: React.Dispatch<React.SetStateAction<string>>;
  setFaceBlurredUrl: React.Dispatch<React.SetStateAction<string>>;
  setEyesBlurredUrl: React.Dispatch<React.SetStateAction<string>>;
};

type HandleBlurClickProps = {
  blurType: BlurTypeEnum;
  originalUrl: string;
};

function VideoRecorderResult({
  captureType,
  isVideoLoading,
  localUrl,
  originalUrl,
  faceBlurredUrl,
  eyesBlurredUrl,
  setLocalUrl,
  setFaceBlurredUrl,
  setEyesBlurredUrl,
  handleSubmit,
  handleResetImage,
  handleResetRecording,
}: Props) {
  const blurContext = useContext(BlurChoicesContext);
  const { blurType } = blurContext;
  const [isLoading, setIsLoading] = useState(false);
  const [isBlurLoading, setIsBlurLoading] = useState(false);

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
  };

  const onSubmit = useCallback(() => {
    setIsLoading(true);
    handleSubmit();
  }, []);

  useEffect(() => {
    if (!captureType) return;
    if (!blurContext) return;
    if (blurType === "original") return;
    handleBlurClick({ blurType, originalUrl });
  }, [typeof blurContext, captureType]);

  return (
    <Stack className={classes.content} style={isVideoLoading ? { visibility: "hidden" } : {}}>
      <Group className={classes.buttonGroup}>
        <ActionIcon
          variant="default"
          disabled={isLoading}
          onClick={captureType === "image" ? handleResetImage : handleResetRecording}
          className={classes.button}
          style={{ flex: 0, minWidth: rem(40) }}
        >
          <IconX className="icon" />
        </ActionIcon>
        <Button
          onClick={onSubmit}
          loading={isLoading}
          disabled={isLoading}
          className={classes.button}
        >
          Upload
        </Button>
      </Group>
      <BlurButtons
        disabled={isBlurLoading}
        originalUrl={originalUrl}
        onBlurClick={handleBlurClick}
        customStyles={{
          position: "absolute",
          bottom: rem(16),
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1,
        }}
      />
      <ResultDisplayContainer
        createdAt={new Date().toString()}
        captureType={captureType}
        url={localUrl}
      />
    </Stack>
  );
}

export default memo(VideoRecorderResult);
