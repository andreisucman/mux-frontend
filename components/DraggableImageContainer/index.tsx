import React, { useRef, useState } from "react";
import { IconMinus, IconPlus, IconTrash } from "@tabler/icons-react";
import cn from "classnames";
import Draggable from "react-draggable";
import { ActionIcon, AngleSlider, Checkbox, Group, Image, rem, Stack } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import { BlurDot } from "../UploadCard/types";
import VerticalSlider from "./VerticalSlider";
import classes from "./DraggableImageContainer.module.css";

type Props = {
  blurDots: BlurDot[];
  setBlurDots: React.Dispatch<React.SetStateAction<BlurDot[]>>;
  image?: string | null;
  handleDelete?: () => void;
  disableDelete?: boolean;
  placeholder?: any;
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
  defaultShowBlur,
  placeholder,
  handleDelete,
  setBlurDots,
}: Props) {
  const { ref, width, height } = useElementSize();
  const nodeRef = useRef(null);
  const secondNodeRef = useRef(null);
  const [showBlur, setShowBlur] = useState(!!defaultShowBlur);
  const [selectedDotId, setSelectedDotId] = useState<string>();

  const handleAddDot = () => {
    if (blurDots.length > 1) return;

    const id = Math.random().toString(36).slice(2, 9);
    const originalWidth = 360;
    const originalHeight = 225;

    const newDot = {
      id,
      originalWidth,
      originalHeight,
      scale: 1,
      angle: 180,
      x: 0,
      y: 0,
    };

    if (blurDots.length) {
      newDot.scale = blurDots[0].scale;
      newDot.angle = blurDots[0].angle;
    }

    setSelectedDotId(newDot.id);
    setBlurDots((prev) => [...prev, newDot]);
  };

  const handleRemoveDot = () => {
    if (blurDots.length === 1) return;
    setBlurDots((prev) => {
      const newDot = prev[0];
      setSelectedDotId(newDot.id);
      return [newDot];
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

  return (
    <Stack className={classes.container} ref={ref} style={customStyles ? customStyles : {}}>
      <Checkbox
        checked={!!showBlur}
        className={classes.checkbox}
        onChange={() => setShowBlur((prev) => !prev)}
        label="Blur features"
      />

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
      {showBlur && (
        <>
          {blurDots.map((dot, i) => {
            const nodeRefs = [nodeRef, secondNodeRef];

            return (
              <Draggable
                defaultClassName={classes.dragger}
                onStop={() => setSelectedDotId(dot.id)}
                onDrag={(e, data) => handleChangeCoordinates(data.x, data.y, dot.id)}
                defaultPosition={{
                  x: width / 2 - (dot.originalWidth * dot.scale) / 2,
                  y: height / 3 - (dot.originalHeight * dot.scale) / 2,
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
              <ActionIcon disabled={blurDots.length === 2} variant="default" onClick={handleAddDot}>
                <IconPlus className="icon icon__small" />
              </ActionIcon>
              <ActionIcon
                disabled={blurDots.length <= 1}
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
      <Image
        width={100}
        height={100}
        src={
          image ||
          (placeholder && placeholder.src) ||
          "https://placehold.co/169x300?text=Your+photo"
        }
        className={classes.image}
        style={customImageStyles ? customImageStyles : {}}
        alt=""
      />
    </Stack>
  );
}
