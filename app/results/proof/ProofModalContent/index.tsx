import React, { useContext } from "react";
import { rem, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import ImageCard from "@/components/ImageCard";
import VideoPlayer from "@/components/VideoPlayer";
import { UserContext } from "@/context/UserContext";
import { useRouter } from "@/helpers/custom-router";
import { formatDate } from "@/helpers/formatDate";
import { normalizeString } from "@/helpers/utils";
import ProofCardFooter from "../ProofGallery/ProofCard/ProofCardFooter";
import ProofCardHeader from "../ProofGallery/ProofCard/ProofCardHeader";
import { SimpleProofType } from "../types";
import classes from "./ProofModalContent.module.css";

type Props = {
  record: SimpleProofType;
  showTrackButton?: boolean;
};

export default function ProofModalContent({ record, showTrackButton }: Props) {
  const router = useRouter();
  const { userDetails } = useContext(UserContext);
  const { club } = userDetails || {};
  const { followingUserId } = club || {};

  const { icon, createdAt, userId, mainUrl, mainThumbnail, concern, taskName } = record || {};

  const isTracked = followingUserId === userId;
  const isSelf = userDetails?._id === userId;

  const formattedDate = formatDate({ date: createdAt });
  const concernName = normalizeString(concern);

  const redirectUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}/club/proof?followingUserId=${userId}`;

  const handleRedirect = () => {
    router.push(redirectUrl);
    modals.closeAll();
  };

  return (
    <Stack className={classes.container}>
      <ProofCardHeader
        concernName={concernName}
        icon={icon}
        taskName={taskName}
        customStyles={{ paddingBottom: rem(16) }}
      />
      {record.contentType === "image" ? (
        <ImageCard
          date={formattedDate}
          image={mainUrl.url}
          datePosition="bottom-right"
          showDate={!isSelf}
          isStatic
        />
      ) : (
        <VideoPlayer
          url={mainUrl.url}
          createdAt={createdAt}
          thumbnail={mainThumbnail.url}
          showDate
          isStatic
        />
      )}
      <ProofCardFooter isTracked={isTracked} handleTrack={handleRedirect} />
    </Stack>
  );
}
