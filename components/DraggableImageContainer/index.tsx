import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IconHandGrab, IconMinus, IconPlus, IconTrash } from "@tabler/icons-react";
import cn from "classnames";
import Draggable from "react-draggable";
import { ActionIcon, AngleSlider, Button, Group, rem, Stack } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import { OffsetType } from "@/app/select-part/types";
import { BlurDotType } from "../UploadCard/types";
import VerticalSlider from "./VerticalSlider";
import classes from "./DraggableImageContainer.module.css";

/**
 * Per-dot refs are stored here so React-Draggable gets a stable nodeRef.
 */
function useDotRefs() {
  const map = useRef<Record<string, React.RefObject<HTMLDivElement>>>({});
  const get = useCallback((id: string) => {
    if (!map.current[id]) map.current[id] = React.createRef();
    return map.current[id];
  }, []);
  return get;
}

type Props = {
  setBlurDots: React.Dispatch<React.SetStateAction<BlurDotType[]>>;
  handleDelete?: () => void;
  setOffsets: (offset: OffsetType) => void;
  image?: string | null;
  showDelete?: boolean;
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
  showDelete,
  disableDelete,
  customImageStyles,
  customStyles,
  showBlur,
  setOffsets,
  handleDelete,
  setBlurDots,
}: Props) {
  /* --------------------------- basic refs & state -------------------------- */
  const getDotRef = useDotRefs();
  const controlPaneRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const { width: containerWidth, height: containerHeight, ref: containerRef } = useElementSize();
  const [selectedDotId, setSelectedDotId] = useState<string>();
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => setImageLoaded(false), [image]);

  /* ---------------------- derived style for <img> wrapper ------------------ */
  const imageStyles = useMemo(() => {
    if (!imageLoaded || !containerWidth || !containerHeight) return undefined;
    const naturalH = imageRef.current?.naturalHeight ?? 1;
    const naturalW = imageRef.current?.naturalWidth ?? 1;
    if (!naturalW) return undefined; // corrupt image safety-net

    const ratio = naturalH / naturalW;
    return ratio > 1
      ? { height: containerHeight, width: containerHeight / ratio }
      : { width: containerWidth, height: containerWidth * ratio };
  }, [imageLoaded]);

  /* ---------------------------- offset helper ----------------------------- */
  const calculateOffsets = useCallback((): OffsetType => {
    const naturalW = imageRef.current?.naturalWidth ?? 0;
    const naturalH = imageRef.current?.naturalHeight ?? 0;
    if (!naturalW || !naturalH) return { scaleHeight: 0, scaleWidth: 0 };

    const renderedW = imageRef.current?.clientWidth ?? 0;
    const renderedH = imageRef.current?.clientHeight ?? 0;

    return {
      scaleWidth: renderedW / naturalW,
      scaleHeight: renderedH / naturalH,
    };
  }, []);

  /* -------------------------- sync offsets upward ------------------------- */
  useEffect(() => {
    if (!imageLoaded) return;
    setOffsets(calculateOffsets());
  }, [imageLoaded, containerWidth, containerHeight, calculateOffsets, setOffsets]);

  /* ---------------------- dot add / remove / update ----------------------- */
  const defaultDotPosition = { x: 100, y: 100 };

  const handleAddDot = () => {
    if (!imageLoaded || !imageRef.current) return;
    if (blurDots.length >= 3) return;

    const renderedW = imageRef.current.clientWidth;
    const renderedH = imageRef.current.clientHeight;
    if (!renderedW || !renderedH) return; // dimensions not ready yet

    const id = Math.random().toString(36).slice(2, 9);
    const size = Math.min(renderedW, renderedH) / 3; // friendlier default size

    const newDot: BlurDotType = {
      id,
      originalWidth: size,
      originalHeight: size / 2,
      scaleX: blurDots.at(-1)?.scaleX ?? 1,
      scaleY: blurDots.at(-1)?.scaleY ?? 1,
      angle: blurDots.at(-1) ? 360 - blurDots.at(-1)!.angle : 180,
      x: defaultDotPosition.x,
      y: defaultDotPosition.y,
    };

    // state update in two steps – no side-effects inside a setter
    setBlurDots((prev) => [...prev, newDot]);
    setSelectedDotId(id);
  };

  const handleRemoveDot = () => {
    if (!selectedDotId) return;
    setBlurDots((prev) => {
      const next = prev.filter((d) => d.id !== selectedDotId);
      if (next.length) setSelectedDotId(next[0].id);
      else setSelectedDotId(undefined);
      return next;
    });
  };

  /* generic field setters */
  const updateDot = useCallback(
    (id: string | undefined, patch: Partial<BlurDotType>) => {
      if (!id) return;
      setBlurDots((prev) => prev.map((d) => (d.id === id ? { ...d, ...patch } : d)));
    },
    [setBlurDots]
  );

  /* ------------------------------ render ---------------------------------- */
  const selectedDot = blurDots.find((d) => d.id === selectedDotId);

  return (
    <Stack className={classes.container} ref={containerRef} style={customStyles}>
      {/* delete button */}
      {showDelete && handleDelete && image && (
        <ActionIcon
          className={classes.deleteIcon}
          disabled={disableDelete}
          variant="default"
          onClick={handleDelete}
        >
          <IconTrash style={{ width: rem(16) }} />
        </ActionIcon>
      )}

      {/* image + dots */}
      {image && (
        <div className={classes.imageWrapper} style={imageStyles}>
          {showBlur && (
            <>
              {blurDots.map((dot) => {
                const nodeRef = getDotRef(dot.id);
                const renderedW = imageRef.current?.clientWidth ?? 0;
                const renderedH = imageRef.current?.clientHeight ?? 0;

                return (
                  <Draggable
                    key={dot.id}
                    nodeRef={nodeRef}
                    defaultClassName={classes.dragger}
                    bounds={{
                      left: 0,
                      top: 0,
                      right: renderedW - dot.originalWidth * dot.scaleX,
                      bottom: renderedH - dot.originalHeight * dot.scaleY,
                    }}
                    position={{ x: dot.x, y: dot.y }}
                    onDrag={(_, data) => updateDot(dot.id, { x: data.x, y: data.y })}
                    onStop={() => setSelectedDotId(dot.id)}
                  >
                    <div
                      ref={nodeRef}
                      className={classes.nodeWrapper}
                      onMouseDown={() => setSelectedDotId(dot.id)}
                    >
                      <div
                        className={cn(classes.node, {
                          [classes.selectedNode]: dot.id === selectedDotId,
                        })}
                        style={{
                          width: dot.originalWidth * dot.scaleX,
                          height: dot.originalHeight * dot.scaleY,
                          transform: `rotate(${dot.angle}deg)`,
                        }}
                      />
                    </div>
                  </Draggable>
                );
              })}

              {/* control panel */}
              <Draggable
                nodeRef={controlPaneRef}
                defaultClassName={classes.dragger}
                cancel=".no-drag"
              >
                <Stack className={classes.controlPanel} ref={controlPaneRef}>
                  <ActionIcon variant="default" className={classes.dndIcon}>
                    <IconHandGrab size={16} />
                  </ActionIcon>

                  <Stack gap={8}>
                    <Button
                      className="no-drag"
                      disabled={blurDots.length >= 3}
                      variant="default"
                      size="compact-sm"
                      onClick={handleAddDot}
                    >
                      <IconPlus size={16} style={{ marginRight: rem(4) }} /> Add
                    </Button>
                    <Button
                      className="no-drag"
                      disabled={!selectedDotId}
                      variant="default"
                      size="compact-sm"
                      onClick={handleRemoveDot}
                    >
                      <IconMinus size={16} style={{ marginRight: rem(4) }} /> Remove
                    </Button>
                  </Stack>

                  <Group className="no-drag">
                    <VerticalSlider
                      value={selectedDot?.scaleX ?? 1}
                      setValue={(v) => updateDot(selectedDotId, { scaleX: v })}
                    />
                    <VerticalSlider
                      value={selectedDot?.scaleY ?? 1}
                      setValue={(v) => updateDot(selectedDotId, { scaleY: v })}
                    />
                  </Group>

                  <AngleSlider
                    className="no-drag"
                    value={selectedDot?.angle ?? 180}
                    onChange={(v) => updateDot(selectedDotId, { angle: v })}
                    size={60}
                    thumbSize={8}
                  />
                </Stack>
              </Draggable>
            </>
          )}

          {/* the image itself */}
          <img
            ref={imageRef}
            src={image || "https://placehold.co/169x300?text=Your+photo"}
            className={classes.image}
            style={customImageStyles}
            alt="uploaded"
            onLoad={() => setImageLoaded(true)}
          />
        </div>
      )}
    </Stack>
  );
}
