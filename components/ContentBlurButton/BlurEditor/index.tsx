import React, { useMemo, useState } from "react";
import { Stack } from "@mantine/core";
import { ProgressImageType } from "@/types/global";
import { HandleSaveBlurProps, HandleSelectProps } from "../types";
import BlurEditorSlide from "./BlurSelectorSlide";
import classes from "./BlurEditor.module.css";

type Props = {
  contentId: string;
  images: ProgressImageType[];
  onUpdate: (args: HandleSaveBlurProps) => Promise<void>;
  handleSelectBlurType: (args: HandleSelectProps) => Promise<void>;
};

export default function BlurEditor({ contentId, images, onUpdate, handleSelectBlurType }: Props) {
  const [slideIndex, setSlideIndex] = useState(0);

  const slides = useMemo(() => {
    return images.map((progressImage, i) => (
      <BlurEditorSlide
        key={i}
        contentId={contentId}
        image={progressImage}
        mainUrl={progressImage.mainUrl}
        slideIndex={slideIndex}
        setSlideIndex={setSlideIndex}
        handleSave={onUpdate}
        handleSelectBlurType={handleSelectBlurType}
        totalSlides={images.length}
      />
    ));
  }, [images, slideIndex]);

  return <Stack className={classes.container}>{slides[slideIndex]}</Stack>;
}
