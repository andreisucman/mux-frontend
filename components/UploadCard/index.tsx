"use client";

import React, { useCallback, useContext, useMemo, useState } from "react";
import { Button, Group, Progress, Stack, Text, Title } from "@mantine/core";
import { useMediaQuery, useViewportSize } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { UploadProgressProps } from "@/app/scan/types";
import BlurButtons from "@/components/BlurButtons";
import ImageDisplayContainer from "@/components/ImageDisplayContainer";
import InstructionContainer from "@/components/InstructionContainer";
import { BlurChoicesContext } from "@/context/BlurChoicesContext";
import { BlurTypeEnum } from "@/context/BlurChoicesContext/types";
import { PartEnum } from "@/context/ScanPartsChoicesContext/types";
import { placeholders } from "@/data/placeholders";
import { OnBlurClickProps } from "@/functions/blur";
import { ScanTypeEnum, SexEnum } from "@/types/global";
import PhotoCapturer from "../PhotoCapturer";
import classes from "./UploadCard.module.css";
import getPlaceholderOrSilhouette from "@/helpers/getPlaceholderOrSilhouette";

type Props = {
  sex: SexEnum;
  part: PartEnum;
  scanType?: ScanTypeEnum;
  progress: number;
  position: string;
  latestStyleImage?: string;
  isLoading?: boolean;
  instruction: string;
  customButtonStyles?: { [key: string]: any };
  onBlurClick: (args: OnBlurClickProps) => Promise<void>;
  handleUpload: (args: UploadProgressProps) => Promise<void>;
};

export default function UploadCard({
  sex,
  scanType,
  part,
  progress,
  position,
  isLoading,
  instruction,
  latestStyleImage,
  customButtonStyles,
  onBlurClick,
  handleUpload,
}: Props) {
  const { blurType } = useContext(BlurChoicesContext);
  const [isBlurLoading, setIsBlurLoading] = useState(false);
  const { width, height } = useViewportSize();

  const [originalUrl, setOriginalUrl] = useState("");
  const [faceBlurredUrl, setFaceBlurredUrl] = useState("");
  const [eyesBlurredUrl, setEyesBlurredUrl] = useState("");
  const [localUrl, setLocalUrl] = useState("");

  const isMobile = useMediaQuery("(max-width: 36em)");

  const disableUpload =
    (blurType === "eyes" && !eyesBlurredUrl) ||
    (blurType === "face" && !faceBlurredUrl) ||
    !localUrl;

  const blurredImage =
    blurType === "face" ? faceBlurredUrl : blurType === "eyes" ? eyesBlurredUrl : originalUrl;

  const relevantPlaceholder = useMemo(
    () => getPlaceholderOrSilhouette({ sex, part, position, scanType, data: placeholders }),
    [sex, part, position, scanType, placeholders]
  );

  const loadLocally = useCallback(
    async (base64string: string) => {
      if (!base64string) return;

      setLocalUrl(base64string);
      setOriginalUrl(base64string);

      modals.closeAll();

      if (blurType === "original") return;

      setIsBlurLoading(true);

      await onBlurClick({
        originalUrl: base64string,
        blurType: blurType as BlurTypeEnum,
        faceBlurredUrl,
        eyesBlurredUrl,
        setEyesBlurredUrl,
        setFaceBlurredUrl,
        setLocalUrl,
      });

      setIsBlurLoading(false);
    },
    [blurType]
  );

  const handleDeleteImage = useCallback(() => {
    setLocalUrl("");
    setOriginalUrl("");
    setEyesBlurredUrl("");
    setFaceBlurredUrl("");
  }, []);

  const handleClickUpload = useCallback(async () => {
    await handleUpload({ blurType, part, position, url: originalUrl, blurredImage });
    handleDeleteImage();
  }, [blurType, part, position, originalUrl, blurredImage]);

  const openPhotoCapturer = useCallback(() => {
    modals.openContextModal({
      modal: "general",
      centered: true,
      title: (
        <Title order={5} component={"p"}>
          Take a photo
        </Title>
      ),
      closeOnClickOutside: false,
      size: "xl",
      fullScreen: isMobile,
      classNames: { body: classes.body, content: classes.content },
      innerProps: <PhotoCapturer handleCapture={loadLocally} />,
    });
  }, [loadLocally, width, height]);

  return (
    <Stack className={classes.container}>
      <InstructionContainer
        instruction={instruction}
        description="All of your uploads are private unless you publish them in the Club."
        customStyles={{ flex: 0 }}
      />
      <Stack className={classes.imageCell}>
        <ImageDisplayContainer
          handleDelete={handleDeleteImage}
          image={localUrl || latestStyleImage}
          isLoadingOverlay={isBlurLoading}
          placeholder={relevantPlaceholder && relevantPlaceholder.url}
        />
        <BlurButtons
          disabled={isBlurLoading || !!isLoading}
          originalUrl={originalUrl}
          onBlurClick={async ({ originalUrl, blurType }) => {
            setIsBlurLoading(true);
            await onBlurClick({
              originalUrl,
              blurType,
              faceBlurredUrl,
              eyesBlurredUrl,
              setEyesBlurredUrl,
              setFaceBlurredUrl,
              setLocalUrl,
            });
            setIsBlurLoading(false);
          }}
          customStyles={{ position: "absolute", top: "1rem", left: "1rem", zIndex: 1 }}
        />
        {isLoading && (
          <Stack className={classes.progressCell}>
            <Progress value={progress} w="100%" size={12} mt={4} />
            <Text size="sm" ta="center">
              Uploading...
            </Text>
          </Stack>
        )}
        {!isLoading && (
          <Stack className={classes.checkboxAndButtons}>
            <Group
              className={classes.buttonGroup}
              style={customButtonStyles ? customButtonStyles : {}}
            >
              {!localUrl && (
                <Button className={classes.button} onClick={openPhotoCapturer} disabled={isLoading}>
                  Take the photo
                </Button>
              )}
              {localUrl && (
                <Button
                  className={classes.button}
                  disabled={disableUpload || isLoading}
                  onClick={handleClickUpload}
                >
                  Upload
                </Button>
              )}
            </Group>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}
