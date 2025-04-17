import React, { useEffect, useRef, useState } from "react";
import { IconMinus, IconPlus, IconTrash } from "@tabler/icons-react";
import cn from "classnames";
import Draggable from "react-draggable";
import { ActionIcon, AngleSlider, Group, rem, Stack } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import { OffsetType } from "@/app/select-part/types";
import { BlurDotType } from "../UploadCard/types";
import VerticalSlider from "./VerticalSlider";
import classes from "./DraggableImageContainer.module.css";

type Props = {
  setBlurDots: React.Dispatch<React.SetStateAction<BlurDotType[]>>;
  handleDelete?: () => void;
  setOffsets: (offset: OffsetType) => void;
  image?: string | null;
  showBlur: boolean;
  blurDots: BlurDotType[];
  disableDelete?: boolean;
  defaultShowBlur?: boolean;
  customImageStyles?: { [key: string]: any };
  customStyles?: { [key: string]: any };
};

export default function DraggableImageContainer({
  image,
  blurDots,
  disableDelete,
  customImageStyles,
  customStyles,
  showBlur,
  setOffsets,
  handleDelete,
  setBlurDots,
}: Props) {
  const nodeRef = useRef(null);
  const secondNodeRef = useRef(null);
  const thirdNodeRef = useRef(null);
  const { width: containerWidth, height: containerHeight, ref: containerRef } = useElementSize();
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [selectedDotId, setSelectedDotId] = useState<string>();
  const [imageLoaded, setImageLoaded] = useState(false);
  const defaultDotPosition = { x: 100, y: 100 };

  const imageStyles = () => {
    let width = 0;
    let height = 0;

    const ratio = (imageRef.current?.naturalHeight || 1) / (imageRef.current?.naturalWidth || 1);

    if (ratio > 1) {
      height = containerHeight;
      width = (containerHeight || 0) / ratio;
    } else {
      width = containerWidth;
      height = (containerWidth || 0) * ratio;
    }

    return { width, height };
  };

  const calculateOffsets = () => {
    let scaleHeight = 0;
    let scaleWidth = 0;

    if (!imageRef.current) return { scaleHeight, scaleWidth };
    const naturalWidth = imageRef.current.naturalWidth;
    const naturalHeight = imageRef.current.naturalHeight;

    if (naturalWidth === 0 || naturalHeight === 0) return { scaleHeight, scaleWidth };

    const renderedWidth = imageRef.current.clientWidth || 0;
    const renderedHeight = imageRef.current.clientHeight || 0;

    scaleWidth = renderedWidth / naturalWidth;
    scaleHeight = renderedHeight / naturalHeight;

    return {
      scaleHeight,
      scaleWidth,
    };
  };

  const handleAddDot = () => {
    if (!imageRef.current) return;
    if (blurDots.length > 3) return;

    const id = Math.random().toString(36).slice(2, 9);
    const renderedWidth = imageRef.current.clientWidth;
    const renderedHeight = imageRef.current.clientHeight;
    const size = Math.max(renderedWidth, renderedHeight) / 2;

    const newDot = {
      id,
      originalWidth: size,
      originalHeight: size / 2,
      scale: 1,
      angle: 180,
      x: defaultDotPosition.x,
      y: defaultDotPosition.y,
    };

    if (blurDots.length) {
      newDot.scale = blurDots[blurDots.length - 1].scale;
      newDot.angle = 360 - blurDots[blurDots.length - 1].angle;
    }

    setSelectedDotId(newDot.id);
    setBlurDots((prev) => [...prev, newDot]);
  };

  const handleRemoveDot = () => {
    if (blurDots.length === 0 || !selectedDotId) return;

    setBlurDots((prev) => {
      const newDots = prev.filter((obj) => obj.id !== selectedDotId);
      if (newDots.length) setSelectedDotId(newDots[0].id);
      return newDots;
    });
  };

  const handleChangeSize = (scale: number, dotId?: string) => {
    if (!dotId) return;
    setBlurDots((prevDots) => prevDots.map((d) => (d.id === dotId ? { ...d, scale } : d)));
  };

  const handleChangeCoordinates = (x: number, y: number, dotId?: string) => {
    if (!dotId) return;
    setBlurDots((prevDots) => prevDots.map((d) => (d.id === dotId ? { ...d, x, y } : d)));
  };

  const handleChangeAngle = (angle: number, dotId?: string) => {
    if (!dotId) return;
    setBlurDots((prevDots) => prevDots.map((d) => (d.id === dotId ? { ...d, angle } : d)));
  };

  const selectedDot = blurDots.find((dot) => dot.id === selectedDotId);

  useEffect(() => {
    if (!imageLoaded) return;
    const offsets = calculateOffsets();
    setOffsets(offsets);
  }, [imageLoaded, image, imageRef.current?.naturalHeight, imageRef.current?.naturalHeight]);

  return (
    <Stack className={classes.container} ref={containerRef} style={customStyles || {}}>
      {handleDelete && image && (
        <ActionIcon
          className={classes.deleteIcon}
          disabled={!!disableDelete}
          variant="default"
          onClick={handleDelete}
        >
          <IconTrash style={{ width: rem(16) }} />
        </ActionIcon>
      )}

      {image && (
        <div className={classes.imageWrapper} style={imageStyles()}>
          {showBlur && image && (
            <>
              {blurDots.map((dot, i) => {
                const nodeRefs = [nodeRef, secondNodeRef, thirdNodeRef];

                return (
                  <Draggable
                    defaultClassName={classes.dragger}
                    onStop={() => setSelectedDotId(dot.id)}
                    onDrag={(e, data) => handleChangeCoordinates(data.x, data.y, dot.id)}
                    defaultPosition={{
                      x: defaultDotPosition.x,
                      y: defaultDotPosition.y,
                    }}
                    nodeRef={nodeRefs[i]}
                    key={dot.id}
                  >
                    <div ref={nodeRefs[i]} className={classes.nodeWrapper}>
                      <div
                        className={cn(classes.node, {
                          [classes.selectedNode]: dot.id === selectedDotId,
                        })}
                        style={{
                          width: dot.originalWidth * dot.scale,
                          height: dot.originalHeight * dot.scale,
                          transform: `rotate(${dot.angle}deg)`,
                        }}
                      ></div>
                    </div>
                  </Draggable>
                );
              })}
              <Stack className={classes.controlPanel}>
                <Group>
                  <ActionIcon
                    disabled={blurDots.length >= 3}
                    variant="default"
                    onClick={handleAddDot}
                  >
                    <IconPlus className="icon icon__small" />
                  </ActionIcon>
                  <ActionIcon
                    disabled={blurDots.length - 1 < 0 || !selectedDotId}
                    variant="default"
                    onClick={handleRemoveDot}
                  >
                    <IconMinus className="icon icon__small" />
                  </ActionIcon>
                </Group>
                <VerticalSlider
                  value={selectedDot?.scale || 1}
                  setValue={(value) => handleChangeSize(value, selectedDotId)}
                />
                <AngleSlider
                  value={selectedDot?.angle || 180}
                  onChange={(value) => handleChangeAngle(value, selectedDotId)}
                  size={60}
                  thumbSize={8}
                />
              </Stack>
            </>
          )}
          <img
            ref={imageRef}
            src={image || "https://placehold.co/169x300?text=Your+photo"}
            className={classes.image}
            style={customImageStyles ? customImageStyles : {}}
            alt=""
            onLoad={() => setImageLoaded(true)}
          />
        </div>
      )}
    </Stack>
  );
}
