"use client";

import React, { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { IconArrowRight, IconCamera, IconUpload } from "@tabler/icons-react";
import {
  ActionIcon,
  Button,
  Group,
  Progress,
  rem,
  Stack,
  Text,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { BlurChoicesContext } from "@/context/BlurChoicesContext";
import BlurButtons from "@/components/BlurButtons";
import ImageDisplayContainer from "@/components/ImageDisplayContainer";
import InstructionContainer from "@/components/InstructionContainer";
import PhotoCapturer from "../PhotoCapturer";
import classes from "./UploadCard.module.css";

type OnBlurClickProps = {
  blurType: "eyes" | "face";
  originalUrl: string;
};

type Props = {
  sex: string;
  type?: string;
  isStyle?: boolean;
  localUrl: string;
  eyesBlurredUrl: string;
  faceBlurredUrl: string;
  originalUrl: string;
  progress: number;
  latestStyleImage?: string;
  isLoading?: boolean;
  instruction: string;
  exampleImage?: string;
  uploadResponse: string;
  customButtonStyles?: { [key: string]: any };
  customContentStyles?: { [key: string]: any };
  setOriginalUrl: React.Dispatch<React.SetStateAction<string>>;
  onBlurClick: ({ originalUrl, blurType }: OnBlurClickProps) => Promise<void>;
  setLocalUrl: React.Dispatch<React.SetStateAction<string>>;
  handleUpload: (() => Promise<void>) | (() => void);
  handleDelete: () => void;
};

export default function UploadCard({
  isStyle,
  sex,
  type,
  localUrl,
  originalUrl,
  progress,
  isLoading,
  instruction,
  exampleImage,
  eyesBlurredUrl,
  faceBlurredUrl,
  latestStyleImage,
  customButtonStyles,
  customContentStyles,
  setOriginalUrl,
  setLocalUrl,
  onBlurClick,
  handleDelete,
  handleUpload,
}: Props) {
  const router = useRouter();
  const [isBlurLoading, setIsBlurLoading] = useState(false);
  const { blurType } = useContext(BlurChoicesContext);

  const disableUpload =
    (blurType === "eyes" && !eyesBlurredUrl && type === "head") ||
    (blurType === "face" && !faceBlurredUrl && type === "body") ||
    !localUrl;

  async function loadLocally(base64string: string) {
    if (!base64string) return;
    modals.closeAll();

    // const fileUrl = URL.createObjectURL(file);
    setLocalUrl(base64string);
    setOriginalUrl(base64string);

    if (blurType === "original") return;
    setIsBlurLoading(true);

    await onBlurClick({
      originalUrl: base64string,
      blurType: blurType as "eyes",
    });

    setIsBlurLoading(false);
  }

  function openPhotoCapturer() {
    modals.openContextModal({
      modal: "general",
      centered: true,

      title: (
        <Group>
          <IconCamera className={classes.icon} /> <Text fw={600}>Take a photo</Text>
        </Group>
      ),
      innerProps: <PhotoCapturer handleCapture={loadLocally} />,
    });
  }

  async function onClickWrapper(blurType: "face" | "eyes") {
    setIsBlurLoading(true);
    console.log("originalUrl, blurType", originalUrl, blurType);
    await onBlurClick({ originalUrl, blurType });
    setIsBlurLoading(false);
  }

  return (
    <Stack className={classes.container}>
      <InstructionContainer
        sex={sex}
        title="Instructions"
        instruction={instruction}
        description="All of your uploads are private unless you publish them in the Club."
        customStyles={{ flex: 0 }}
      />

      <Stack
        className={classes.centralContent}
        style={customContentStyles ? customContentStyles : {}}
      >
        <Group className={classes.imageRow}>
          {exampleImage && (
            <Stack className={classes.imageCell}>
              <Text size="xs" c="dimmed">
                Example:
              </Text>
              <ImageDisplayContainer image={exampleImage} />
            </Stack>
          )}
          <Stack className={classes.imageCell}>
            <Text size="xs" c="dimmed">
              Uploaded:
            </Text>
            <ImageDisplayContainer
              handleDelete={handleDelete}
              image={localUrl || latestStyleImage}
              isLoadingOverlay={isBlurLoading}
            />
          </Stack>
        </Group>
        {isLoading && (
          <Stack className={classes.uploadingStack}>
            <Text size="sm" c="dimmed">
              Uploading...
            </Text>
            <Progress value={progress} w="100%" style={{ minHeight: rem(8) }} />
          </Stack>
        )}
        {!isLoading && (
          <Stack className={classes.checkboxAndButtons}>
            <BlurButtons
              disabled={isBlurLoading}
              originalUrl={originalUrl}
              onBlurClick={onBlurClick}
            />
            <Group
              className={classes.buttonGroup}
              style={customButtonStyles ? customButtonStyles : {}}
            >
              {!localUrl && (
                <Button onClick={openPhotoCapturer} disabled={isLoading} variant={"default"}>
                  <IconCamera className="icon" />
                  Take a photo
                </Button>
              )}
              {localUrl && (
                <Button disabled={disableUpload || isLoading} onClick={handleUpload}>
                  <IconUpload className="icon" />
                  Upload
                </Button>
              )}
              {isStyle && !localUrl && latestStyleImage && (
                <ActionIcon
                  maw={rem(50)}
                  disabled={isLoading}
                  variant="default"
                  onClick={() => router.replace(`/scan/style/result?type=${type}`)}
                >
                  <IconArrowRight className={classes.icon} />
                </ActionIcon>
              )}
            </Group>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}
