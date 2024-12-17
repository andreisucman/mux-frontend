import React from "react";
import NextImage from "next/image";
import { rem, Skeleton } from "@mantine/core";
import ProgressLoadingOverlay from "@/components/ProgressLoadingOverlay";
import VideoPlayer from "@/components/VideoPlayer";
import classes from "./ResultDisplayContainer.module.css";

type Props = {
  url: string;
  thumbnail?: string;
  createdAt: string;
  isBlurLoading?: boolean;
  progress?: number;
  captureType?: string;
};

export default function ResultDisplayContainer({
  url,
  thumbnail,
  createdAt,
  isBlurLoading = false,
  progress = 0,
  captureType,
}: Props) {
  const isImage = url.startsWith("data:image/");
  return (
    <div className={classes.container}>
      <Skeleton className="skeleton" visible={!captureType}>
        <ProgressLoadingOverlay isLoading={isBlurLoading} progress={progress} />
        {captureType === "image" && isImage ? (
          <NextImage src={url} className={classes.item} width={300} height={300} alt="" />
        ) : (
          <VideoPlayer
            url={url}
            thumbnail={thumbnail}
            createdAt={createdAt}
            customStyles={{ borderRadius: rem(16), overflow: "hidden" }}
            isStatic
          />
        )}
      </Skeleton>
    </div>
  );
}
