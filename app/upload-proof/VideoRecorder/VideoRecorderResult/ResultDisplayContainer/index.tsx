import React, { useMemo } from "react";
import NextImage from "next/image";
import { rem } from "@mantine/core";
import { useMediaQuery, useViewportSize } from "@mantine/hooks";
import VideoPlayer from "@/components/VideoPlayer";
import classes from "./ResultDisplayContainer.module.css";

type Props = {
  url: string;
  thumbnail?: string;
  createdAt: string;
  captureType?: string;
};

export default function ResultDisplayContainer({ url, thumbnail, createdAt, captureType }: Props) {
  const isMobile = useMediaQuery("(max-width: 36em)");
  const { width: viewportWidth, height: viewportHeight } = useViewportSize();

  const imageExtension =
    url?.endsWith(".webp") || url?.endsWith(".jpg") || url?.startsWith("data:image/");
  const videoExtension =
    url?.endsWith(".mp4") || url?.endsWith(".webm") || url?.startsWith("data:video/");

  const aspectRatio = useMemo(() => {
    const ratio = isMobile ? viewportHeight / viewportWidth : 1;
    return isNaN(ratio) ? 20 / 9 : ratio;
  }, [viewportWidth, viewportHeight, isMobile]);

  return (
    <div className={classes.container} style={{ aspectRatio }}>
      {captureType === "image" && imageExtension && (
        <NextImage src={url} className={classes.image} width={300} height={533} alt="" />
      )}
      {captureType === "video" && videoExtension && (
        <VideoPlayer
          url={url}
          thumbnail={thumbnail}
          createdAt={createdAt}
          customStyles={{ borderRadius: rem(16), overflow: "hidden", aspectRatio }}
          isRelative
        />
      )}
    </div>
  );
}
