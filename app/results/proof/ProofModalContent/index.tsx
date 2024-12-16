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
  isPublic?: boolean;
};

export default function ProofModalContent({ record, isPublic }: Props) {
  const router = useRouter();
  const { userDetails } = useContext(UserContext);
  const { club, name } = userDetails || {};
  const { followingUserName } = club || {};

  const { icon, createdAt, mainUrl, mainThumbnail, concern, taskName, userName } = record || {};

  const isTracked = followingUserName === userName;
  const isSelf = name === userName;

  const formattedDate = formatDate({ date: createdAt });
  const concernName = normalizeString(concern);

  const redirectUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}/club/proof/${userName}`;

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
        hideTitle={!isPublic}
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
      {isPublic && <ProofCardFooter isTracked={isTracked} handleTrack={handleRedirect} />}
    </Stack>
  );
}
