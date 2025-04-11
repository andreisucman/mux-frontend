import React, { useCallback, useState } from "react";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { ActionIcon, Button, Group, rem, Stack } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import { OffsetType } from "@/app/concerns/types";
import DraggableImageContainer from "@/components/DraggableImageContainer";
import { BlurDotType } from "@/components/UploadCard/types";
import { BlurTypeEnum } from "@/context/BlurChoicesContext/types";
import { BlurredUrlType, ProgressImageType } from "@/types/global";
import { OnUpdateBlurProps } from "../../types";
import BlurSelectorMenu from "../BlurSelectorMenu";
import classes from "./BlurSelectorSlide.module.css";

type Props = {
  slideIndex: number;
  image: ProgressImageType;
  totalSlides: number;
  mainUrl: BlurredUrlType;
  setSlideIndex: React.Dispatch<React.SetStateAction<number>>;
  setEditorImages: React.Dispatch<React.SetStateAction<ProgressImageType[]>>;
  onUpdate: (
    args: OnUpdateBlurProps
  ) => Promise<{ images: ProgressImageType[]; initialImages: ProgressImageType[] }>;
};

export default function BlurEditorSlide({
  totalSlides,
  slideIndex,
  image,
  mainUrl,
  setSlideIndex,
  setEditorImages,
  onUpdate,
}: Props) {
  const originalUrlObject = image.urls.find((obj) => obj.name === BlurTypeEnum.ORIGINAL);
  const blurredUrlObject = image.urls.find((obj) => obj.name === BlurTypeEnum.BLURRED);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedUrlObject, setSelectedUrlObject] = useState<BlurredUrlType | undefined>(mainUrl);
  const [blurDots, setBlurDots] = useState<BlurDotType[]>([]);
  const [offsets, setOffsets] = useState<OffsetType>({ scaleHeight: 0, scaleWidth: 0 });
  const [showBlur, setShowBlur] = useState(false);
  const defaultBlurTypes = image.urls.map((obj) => ({
    value: obj.name,
    label: upperFirst(obj.name),
  }));

  const handleSave = useCallback(async () => {
    setIsLoading(true);
    const response = await onUpdate({
      blurDots,
      url: selectedUrlObject?.url || "",
      offsets,
      position: image.position,
    });
    setIsLoading(false);

    const { images } = response || {};
    const position = image.position;
    const newRelevantImage = images?.find((io) => io.position === position);
    setSelectedUrlObject(newRelevantImage?.mainUrl);
    setEditorImages(images);
    setShowBlur(false);
    setBlurDots([]);
  }, [originalUrlObject, blurDots, offsets, image]);

  const disableSave =
    (selectedUrlObject?.name === mainUrl?.name && !blurDots.length) ||
    (showBlur && !blurDots.length);

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
          setSelectedUrlObject(originalUrlObject);
          setShowBlur(true);
        }}
        defaultBlurTypes={defaultBlurTypes}
        handleSelect={(blurType: BlurTypeEnum) => {
          setShowBlur(false);
          setSelectedUrlObject(
            blurType === BlurTypeEnum.BLURRED ? blurredUrlObject : originalUrlObject
          );
        }}
      />
      <DraggableImageContainer
        blurDots={blurDots}
        image={selectedUrlObject?.url}
        setOffsets={setOffsets}
        setBlurDots={setBlurDots}
        showBlur={showBlur}
        defaultShowBlur
      />
      <Group className={classes.buttons}>
        <ActionIcon
          variant="default"
          disabled={slideIndex <= 0 || isLoading}
          className={classes.button}
          onClick={() => setSlideIndex((prev) => prev - 1)}
        >
          <IconArrowLeft className="icon icon__small" />
        </ActionIcon>
        <Button
          loading={isLoading}
          disabled={disableSave || isLoading}
          className={classes.button}
          onClick={handleSave}
        >
          Save
        </Button>
        <ActionIcon
          variant="default"
          className={classes.button}
          disabled={slideIndex + 1 >= totalSlides || isLoading}
          onClick={() => setSlideIndex((prev) => prev + 1)}
        >
          <IconArrowRight className="icon icon__small" />
        </ActionIcon>
      </Group>
    </Stack>
  );
}
