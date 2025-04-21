import React, { useMemo, useState } from "react";
import { Stack } from "@mantine/core";
import { ProgressImageType } from "@/types/global";
import { OnUpdateBlurProps } from "../types";
import BlurEditorSlide from "./BlurSelectorSlide";
import classes from "./BlurEditor.module.css";

type Props = {
  contentId: string;
  images: ProgressImageType[];
  onUpdate: (
    args: OnUpdateBlurProps
  ) => Promise<{ images: ProgressImageType[]; initialImages: ProgressImageType[] }[]>;
};

export default function BlurEditor({ images, onUpdate }: Props) {
  const [editorImages, setEditorImages] = useState(images);
  const [slideIndex, setSlideIndex] = useState(0);

  const slides = useMemo(() => {
    return editorImages.map((progressImage, i) => (
      <BlurEditorSlide
        key={i}
        image={progressImage}
        mainUrl={progressImage.mainUrl}
        slideIndex={slideIndex}
        setSlideIndex={setSlideIndex}
        onUpdate={onUpdate}
        setEditorImages={setEditorImages}
        totalSlides={editorImages.length}
      />
    ));
  }, [editorImages, slideIndex]);

  return <Stack className={classes.container}>{slides[slideIndex]}</Stack>;
}
