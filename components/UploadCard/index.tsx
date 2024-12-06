"use client";

import React, { useCallback, useContext, useMemo, useState } from "react";
import { IconArrowRight, IconCamera, IconUpload } from "@tabler/icons-react";
import { ActionIcon, Button, Group, Progress, rem, Stack, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import BlurButtons from "@/components/BlurButtons";
import ImageDisplayContainer from "@/components/ImageDisplayContainer";
import InstructionContainer from "@/components/InstructionContainer";
import { BlurChoicesContext } from "@/context/BlurChoicesContext";
import { BlurTypeEnum } from "@/context/BlurChoicesContext/types";
import { placeholders } from "@/data/placeholders";
import { useRouter } from "@/helpers/custom-router/patch-router/router";
import { ScanTypeEnum, SexEnum } from "@/types/global";
import PhotoCapturer from "../PhotoCapturer";
import classes from "./UploadCard.module.css";

type OnBlurClickProps = {
  blurType: BlurTypeEnum;
  originalUrl: string;
};

type Props = {
  sex: SexEnum;
  type?: string;
  scanType?: ScanTypeEnum;
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
  handleUpload: (args?: File | null) => Promise<void>;
  handleDelete: () => void;
};

export default function UploadCard({
  sex,
  scanType,
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
  const [localFile, setLocalFile] = useState<File | null>();
  const { blurType } = useContext(BlurChoicesContext);
  const [isBlurLoading, setIsBlurLoading] = useState(false);

  const disableUpload =
    (blurType === "eyes" && !eyesBlurredUrl && type === "head") ||
    (blurType === "face" && !faceBlurredUrl && type === "body") ||
    (!localUrl && !localFile);

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

  const showBlurButtons = useMemo(() => scanType === "progress" || scanType === "style", []);

  const relevantPlaceholder = useMemo(() => {
    return placeholders.find(
      (item) =>
        item.sex.includes(sex) &&
        scanType === item.scanType &&
        item.type === type &&
        item.position === position
    );
  }, [sex, type, position, scanType]);

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
          {showBlurButtons && (
            <BlurButtons
              disabled={isBlurLoading || !!isLoading}
              originalUrl={originalUrl}
              onBlurClick={onBlurClick}
            />
          )}
          {!isLoading && (
            <Group
              className={classes.buttonGroup}
              style={customButtonStyles ? customButtonStyles : {}}
            >
              {!localUrl && scanType !== "health" && (
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
              {scanType === "health" && !localFile && (
                <Button
                  component="label"
                  variant="default"
                  htmlFor="file_input"
                  className={classes.button}
                >
                  <IconUpload className="icon" style={{ marginRight: rem(8) }} />
                  Upload a file
                  <input
                    id="file_input"
                    type="file"
                    accept="image/png, image/jpeg, application/pdf"
                    hidden
                    onChange={(e: React.FormEvent<HTMLInputElement>) =>
                      setLocalFile(e.currentTarget.files?.[0])
                    }
                  />
                </Button>
              )}
              {localUrl ||
                (localFile && (
                  <Button
                    className={classes.button}
                    disabled={disableUpload || isLoading}
                    onClick={() => handleUpload(localFile)}
                  >
                    <IconUpload className="icon" style={{ marginRight: rem(8) }} />
                    Upload
                  </Button>
                ))}
              {scanType && !localUrl && latestStyleImage && (
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
