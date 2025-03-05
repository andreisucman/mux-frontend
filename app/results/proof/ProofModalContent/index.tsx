import React, { useState } from "react";
import { LoadingOverlay, rem, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import ImageCard from "@/components/ImageCard";
import VideoPlayer from "@/components/VideoPlayer";
import { useRouter } from "@/helpers/custom-router";
import { formatDate } from "@/helpers/formatDate";
import { normalizeString } from "@/helpers/utils";
import ProofCardFooter from "../ProofGallery/ProofCard/ProofCardFooter";
import ProofCardHeader from "../ProofGallery/ProofCard/ProofCardHeader";
import { SimpleProofType } from "../types";
import classes from "./ProofModalContent.module.css";

type Props = {
  record: SimpleProofType;
  isPublicPage?: boolean;
};

export default function ProofModalContent({ record, isPublicPage }: Props) {
  const router = useRouter();
  const [isBuffering, setIsBuffering] = useState(true);

  const { icon, createdAt, mainUrl, mainThumbnail, concern, taskName, userName } = record || {};

  const formattedDate = formatDate({ date: createdAt });
  const concernName = normalizeString(concern);

  const redirectUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}/club/routines/${userName}`;

  const handleRedirect = () => {
    router.push(redirectUrl);
    modals.closeAll();
  };

  console.log("isBuffering", isBuffering);

  return (
    <Stack className={classes.container}>
      <ProofCardHeader
        concernName={concernName}
        icon={icon}
        taskName={taskName}
        hideTitle={!isPublicPage}
        customStyles={{ paddingBottom: rem(16) }}
      />
      <LoadingOverlay visible={isBuffering} />
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
          setIsBuffering={setIsBuffering}
          playOnBufferEnd
          showDate
          isRelative
        />
      )}
      {isPublicPage && <ProofCardFooter handleTrack={handleRedirect} />}
    </Stack>
  );
}
