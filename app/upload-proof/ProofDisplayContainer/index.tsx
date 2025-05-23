import React, { useMemo } from "react";
import NextImage from "next/image";
import { Image, Stack, Text } from "@mantine/core";
import ContentPublicityIndicator from "@/components/ContentPublicityIndicator";
import VideoPlayer from "@/components/VideoPlayer";
import { formatDate } from "@/helpers/formatDate";
import { ExistingProofRecordType } from "../types";
import classes from "./ProofDisplayContainer.module.css";

type Props = {
  existingProofRecord: ExistingProofRecordType;
};

export default function ProofDisplayContainer({ existingProofRecord }: Props) {
  const { contentType, createdAt, mainUrl, isPublic, mainThumbnail } = existingProofRecord;

  const formattedDate = useMemo(() => formatDate({ date: createdAt }), []);

  return (
    <Stack className={classes.container}>
      {createdAt && <Text className={classes.date}>{formattedDate}</Text>}{" "}
      <Stack className={classes.wrapper}>
        {contentType === "image" ? (
          <Image
            src={mainUrl.url}
            component={NextImage}
            className={classes.item}
            width={300}
            height={300}
            alt=""
          />
        ) : (
          <VideoPlayer
            url={mainUrl.url}
            thumbnail={mainThumbnail.url}
            createdAt={createdAt}
            isRelative
          />
        )}
      </Stack>
      <ContentPublicityIndicator isPublic={isPublic} position="bottom-right" />
    </Stack>
  );
}
