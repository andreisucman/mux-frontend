"use client";

import React, { useCallback, useContext, useMemo, useState } from "react";
import { IconArrowRight, IconCamera, IconUpload } from "@tabler/icons-react";
import { ActionIcon, Button, Group, Progress, rem, Stack, Text, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import BlurButtons from "@/components/BlurButtons";
import ImageDisplayContainer from "@/components/ImageDisplayContainer";
import InstructionContainer from "@/components/InstructionContainer";
import { BlurChoicesContext } from "@/context/BlurChoicesContext";
import { placeholders } from "@/data/placeholders";
import { useRouter } from "@/helpers/custom-router/patch-router/router";
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
  position: string;
  latestStyleImage?: string;
  isLoading?: boolean;
  instruction: string;
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
  position,
  isLoading,
  instruction,
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
  const { blurType } = useContext(BlurChoicesContext);
  const [isBlurLoading, setIsBlurLoading] = useState(false);

  const disableUpload =
    (blurType === "eyes" && !eyesBlurredUrl && type === "head") ||
    (blurType === "face" && !faceBlurredUrl && type === "body") ||
    !localUrl;

  console.log("isStyle", isStyle);

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
        blurType: blurType as "eyes",
      });

      setIsBlurLoading(false);
    },
    [blurType]
  );

  const openPhotoCapturer = useCallback(() => {
    modals.openContextModal({
      modal: "general",
      centered: true,
      title: (
        <Title order={5} component={"p"}>
          Take a photo
        </Title>
      ),
      innerProps: <PhotoCapturer handleCapture={loadLocally} />,
    });
  }, [loadLocally]);

  const relevantPlaceholder = useMemo(() => {
    const finalType = isStyle ? "style" : type;
    const finalPosition = isStyle ? (type === "head" || type === "body" ? type : position) : position;
    return placeholders.find(
      (item) => item.sex.includes(sex) && item.type === finalType && item.position === finalPosition
    );
  }, [sex, type, position, isStyle]);

  return (
    <Stack className={classes.container}>
      <InstructionContainer
        sex={sex}
        instruction={instruction}
        description="All of your uploads are private unless you publish them in the Club."
        customStyles={{ flex: 0 }}
      />

      <Stack
        className={classes.centralContent}
        style={customContentStyles ? customContentStyles : {}}
      >
        <Stack className={classes.imageCell}>
          <ImageDisplayContainer
            handleDelete={handleDelete}
            image={localUrl || latestStyleImage}
            isLoadingOverlay={isBlurLoading}
            placeholder={relevantPlaceholder && relevantPlaceholder.url}
          />
        </Stack>

        <Stack className={classes.checkboxAndButtons}>
          <BlurButtons
            disabled={isBlurLoading || !!isLoading}
            originalUrl={originalUrl}
            onBlurClick={onBlurClick}
          />
          {!isLoading && (
            <Group
              className={classes.buttonGroup}
              style={customButtonStyles ? customButtonStyles : {}}
            >
              {!localUrl && (
                <Button
                  className={classes.button}
                  onClick={openPhotoCapturer}
                  disabled={isLoading}
                  variant={"default"}
                >
                  <IconCamera className="icon" style={{ marginRight: rem(8) }} />
                  Take a photo
                </Button>
              )}
              {localUrl && (
                <Button
                  className={classes.button}
                  disabled={disableUpload || isLoading}
                  onClick={handleUpload}
                >
                  <IconUpload className="icon" style={{ marginRight: rem(8) }} />
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
                  <IconArrowRight className={"icon"} />
                </ActionIcon>
              )}
            </Group>
          )}
        </Stack>
        {isLoading && (
          <Stack className={classes.uploadingStack}>
            <Progress value={progress} w="100%" style={{ minHeight: rem(8) }} />
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}
