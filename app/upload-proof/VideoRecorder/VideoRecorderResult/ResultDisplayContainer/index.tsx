import React from "react";
import NextImage from "next/image";
import { rem } from "@mantine/core";
import VideoPlayer from "@/components/VideoPlayer";
import classes from "./ResultDisplayContainer.module.css";

type Props = {
  url: string;
  thumbnail?: string;
  createdAt: string;
  captureType?: string;
};

export default function ResultDisplayContainer({ url, thumbnail, createdAt, captureType }: Props) {
  const imageExtension =
    url?.endsWith(".webp") || url?.endsWith(".jpg") || url?.startsWith("data:image/");
  const videoExtension =
    url?.endsWith(".mp4") || url?.endsWith(".webm") || url?.startsWith("data:video/");

  return (
    <div className={classes.container}>
      {captureType === "image" && imageExtension && (
        <NextImage src={url} className={classes.image} width={300} height={533} alt="" />
      )}
      {captureType === "video" && videoExtension && (
        <VideoPlayer
          url={url}
          thumbnail={thumbnail}
          createdAt={createdAt}
          customStyles={{ borderRadius: rem(16), overflow: "hidden" }}
          isRelative
        />
      )}
    </div>
  );
}
