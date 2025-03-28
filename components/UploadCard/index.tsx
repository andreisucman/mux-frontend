"use client";

import React, { useCallback, useContext, useMemo, useState } from "react";
import { Button, Checkbox, Progress, Stack, Text, Title } from "@mantine/core";
import { useMediaQuery, useViewportSize } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { UploadProgressProps } from "@/app/scan/types";
import InstructionContainer from "@/components/InstructionContainer";
import { PartEnum } from "@/context/ScanPartsChoicesContext/types";
import { placeholders } from "@/data/placeholders";
import { silhouettes } from "@/data/silhouettes";
import getPlaceholderOrSilhouette from "@/helpers/getPlaceholderOrSilhouette";
import { ScanTypeEnum, SexEnum } from "@/types/global";
import DraggableImageContainer from "../DraggableImageContainer";
import PhotoCapturer from "../PhotoCapturer";
import { BlurDotType } from "./types";
import classes from "./UploadCard.module.css";

type Props = {
  sex: SexEnum;
  part: PartEnum;
  scanType?: ScanTypeEnum;
  progress: number;
  position: string;
  isLoading?: boolean;
  instruction: string;
  customButtonStyles?: { [key: string]: any };
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
  handleUpload,
}: Props) {
  const { width, height } = useViewportSize();
  const [localUrl, setLocalUrl] = useState("");
  const [offsets, setOffsets] = useState({
    scaleHeight: 0,
    scaleWidth: 0,
  });
  const [showBlur, setShowBlur] = useState(false);
  const [blurDots, setBlurDots] = useState<BlurDotType[]>([]);

  const isMobile = useMediaQuery("(max-width: 36em)");

  const relevantPlaceholder = useMemo(
    () => getPlaceholderOrSilhouette({ sex, part, position, scanType, data: placeholders }),
    [sex, part, position, scanType, placeholders]
  );

  const relevantSilhouette = useMemo(
    () => getPlaceholderOrSilhouette({ sex, part, position, scanType, data: silhouettes }),
    [sex, part, position, scanType]
  );

  const handleToggleBlur = () => {
    setShowBlur((prev: boolean) => {
      if (prev) {
        setBlurDots([]);
      }
      return !prev;
    });
  };

  const handleDeleteImage = useCallback(() => {
    setLocalUrl("");
  }, []);

  const handleCapture = useCallback((base64: string) => {
    setLocalUrl(base64);
    modals.closeAll();
  }, []);

  const handleClickUpload = useCallback(async () => {
    await handleUpload({ part, position, url: localUrl, blurDots, offsets });
    handleDeleteImage();
  }, [part, position, blurDots]);

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
      innerProps: (
        <PhotoCapturer handleCapture={handleCapture} silhouette={relevantSilhouette?.url || ""} />
      ),
    });
  }, [relevantSilhouette, width, height]);

  return (
    <Stack className={classes.container}>
      <InstructionContainer
        instruction={instruction}
        description="All of your uploads are private unless you publish them in the Club."
        customStyles={{ flex: 0 }}
      />
      <Stack className={classes.imageCell}>
        <Checkbox
          checked={showBlur}
          className={classes.checkbox}
          onChange={handleToggleBlur}
          label="Blur features"
        />
        <DraggableImageContainer
          showBlur={showBlur}
          blurDots={blurDots}
          image={localUrl}
          disableDelete={isLoading}
          handleDelete={handleDeleteImage}
          setBlurDots={setBlurDots}
          setOffsets={setOffsets}
          placeholder={relevantPlaceholder && relevantPlaceholder.url}
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
          <div className={classes.buttonWrapper}>
            {!localUrl && (
              <Button className={classes.button} onClick={openPhotoCapturer} disabled={isLoading}>
                Capture
              </Button>
            )}
            {localUrl && (
              <Button
                className={classes.button}
                disabled={isLoading || !localUrl}
                onClick={handleClickUpload}
              >
                Upload
              </Button>
            )}
          </div>
        )}
      </Stack>
    </Stack>
  );
}
