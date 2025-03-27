import React, { useState } from "react";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { ActionIcon, Button, Group, rem, Stack } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import { OffsetType } from "@/app/scan/types";
import DraggableImageContainer from "@/components/DraggableImageContainer";
import { BlurDotType } from "@/components/UploadCard/types";
import { BlurTypeEnum } from "@/context/BlurChoicesContext/types";
import { BlurredUrlType, ProgressImageType } from "@/types/global";
import { HandleSaveBlurProps, HandleSelectProps } from "../../types";
import BlurSelectorMenu from "../BlurSelectorMenu";
import classes from "./BlurEditorSlide.module.css";

type Props = {
  contentId: string;
  slideIndex: number;
  image: ProgressImageType;
  totalSlides: number;
  mainUrl: BlurredUrlType;
  setSlideIndex: React.Dispatch<React.SetStateAction<number>>;
  handleSave: (args: HandleSaveBlurProps) => void;
  handleSelectBlurType: (args: HandleSelectProps) => Promise<void>;
};

export default function BlurEditorSlide({
  contentId,
  totalSlides,
  slideIndex,
  image,
  mainUrl,
  setSlideIndex,
  handleSave,
  handleSelectBlurType,
}: Props) {
  const originalUrlObject = image.urls.find((obj) => obj.name === BlurTypeEnum.ORIGINAL);
  const blurredUrlObject = image.urls.find((obj) => obj.name === BlurTypeEnum.BLURRED);

  const [selectedUrl, setSelectedUrl] = useState<BlurredUrlType | undefined>(mainUrl);
  const [blurDots, setBlurDots] = useState<BlurDotType[]>([]);
  const [offsets, setOffsets] = useState<OffsetType>({ scaleHeight: 0, scaleWidth: 0 });
  const [showBlur, setShowBlur] = useState(false);
  const defaultBlurTypes = image.urls.map((obj) => ({
    value: obj.name,
    label: upperFirst(obj.name),
  }));

  const handleToggleBlur = () => {
    setShowBlur((prev: boolean) => {
      if (prev) {
        setBlurDots([]);
      }
      return !prev;
    });
  };

  const disableSave = selectedUrl?.name === mainUrl?.name || (showBlur && !blurDots.length);

  return (
    <Stack className={classes.container}>
      <BlurSelectorMenu
        selectedValue={mainUrl.name}
        customStyles={{
          cursor: "pointer",
          position: "absolute",
          top: rem(8),
          left: rem(8),
          zIndex: 1,
          backgroundColor: "var(--mantine-color-dark-6)",
          padding: "0.25rem 0.5rem",
          borderRadius: rem(16),
        }}
        handleNewBlur={() => {
          setSelectedUrl(originalUrlObject);
          setShowBlur(true);
        }}
        defaultBlurTypes={defaultBlurTypes}
        handleSelect={(blurType: BlurTypeEnum) => {
          setShowBlur(false);
          setSelectedUrl(blurType === BlurTypeEnum.BLURRED ? blurredUrlObject : originalUrlObject);
        }}
      />
      <DraggableImageContainer
        blurDots={blurDots}
        image={selectedUrl?.url}
        setOffsets={setOffsets}
        setBlurDots={setBlurDots}
        setShowBlur={handleToggleBlur}
        showBlur={showBlur}
        defaultShowBlur
      />
      <Group className={classes.buttons}>
        <ActionIcon
          variant="default"
          disabled={slideIndex <= 0}
          className={classes.button}
          onClick={() => setSlideIndex((prev) => prev - 1)}
        >
          <IconArrowLeft className="icon icon__small" />
        </ActionIcon>
        <Button
          disabled={disableSave}
          className={classes.button}
          onClick={() => handleSave({ blurDots, image: originalUrlObject?.url || "", offsets })}
        >
          Save
        </Button>
        <ActionIcon
          variant="default"
          className={classes.button}
          disabled={slideIndex + 1 >= totalSlides}
          onClick={() => setSlideIndex((prev) => prev + 1)}
        >
          <IconArrowRight className="icon icon__small" />
        </ActionIcon>
      </Group>
    </Stack>
  );
}
