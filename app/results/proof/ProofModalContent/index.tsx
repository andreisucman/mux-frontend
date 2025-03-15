import React from "react";
import { rem, Stack } from "@mantine/core";
import ImageCard from "@/components/ImageCard";
import VideoPlayer from "@/components/VideoPlayer";
import { formatDate } from "@/helpers/formatDate";
import { normalizeString } from "@/helpers/utils";
import ProofCardHeader from "../ProofGallery/ProofCard/ProofCardHeader";
import { SimpleProofType } from "../types";
import classes from "./ProofModalContent.module.css";

type Props = {
  record: SimpleProofType;
  isPublicPage?: boolean;
};

export default function ProofModalContent({ record, isPublicPage }: Props) {
  const { icon, createdAt, mainUrl, concern, taskName } = record || {};

  const formattedDate = formatDate({ date: createdAt });
  const concernName = normalizeString(concern);

  return (
    <Stack className={classes.container}>
      <ProofCardHeader
        concernName={concernName}
        icon={icon}
        taskName={taskName}
        hideTitle={!isPublicPage}
        customStyles={{ paddingBottom: rem(16) }}
      />
      <Stack className={classes.contentWrapper}>
        {record.contentType === "image" ? (
          <ImageCard
            date={formattedDate}
            image={mainUrl.url}
            datePosition="bottom-right"
            customWrapperStyles={{ position: "absolute", aspectRatio: 3 / 4 }}
            showDate
            isRelative
          />
        ) : (
          <VideoPlayer
            url={mainUrl.url}
            createdAt={createdAt}
            playOnBufferEnd
            showDate
            isRelative
          />
        )}
      </Stack>
    </Stack>
  );
}
