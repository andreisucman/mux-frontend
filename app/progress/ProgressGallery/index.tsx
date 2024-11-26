"use client";

import React, { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { IconCircleOff } from "@tabler/icons-react";
import { Stack } from "@mantine/core";
import OverlayWithText from "@/components/OverlayWithText";
import { HandleUpdateProgressType, SimpleProgressType } from "../types";
import ProgressCard from "./ProgressCard";
import classes from "./ProgressGallery.module.css";

type Props = {
  progress: SimpleProgressType[];
  handleUpdateProgress?: ({ contentId, images, initialImages }: HandleUpdateProgressType) => void;
};

export default function ProgressGallery({ progress, handleUpdateProgress }: Props) {
  const searchParams = useSearchParams();

  const position = searchParams.get("position") || "front";

  const processedProgress = useMemo(
    () =>
      progress.map((p) => ({
        ...p,
        images: p.images.filter((io) => io.position === position),
        initialImages: p.initialImages.filter((io) => io.position === position),
      })),
    [position]
  );

  return (
    <Stack className={classes.container}>
      {progress.length > 0 ? (
        <Stack className={classes.content}>
          {processedProgress.map((record, index) => (
            <ProgressCard data={record} key={index} handleUpdateProgress={handleUpdateProgress} />
          ))}
        </Stack>
      ) : (
        <OverlayWithText
          icon={<IconCircleOff className="icon" />}
          text="Nothing found"
          outerStyles={{
            backgroundColor: "var(--mantine-color-dark-6)",
            border: "1px solid var(--mantine-color-dark-5)",
            borderRadius: "var(--mantine-radius-lg)",
          }}
        />
      )}
    </Stack>
  );
}
