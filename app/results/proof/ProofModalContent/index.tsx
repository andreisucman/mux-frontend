import React, { useContext } from "react";
import { Stack, Text } from "@mantine/core";
import ContentPublicityIndicator from "@/components/ContentPublicityIndicator";
import ImageCard from "@/components/ImageCard";
import VideoPlayer from "@/components/VideoPlayer";
import { UserContext } from "@/context/UserContext";
import { formatDate } from "@/helpers/formatDate";
import { normalizeString } from "@/helpers/utils";
import { UserDataType, UserSubscriptionsType } from "@/types/global";
import ProofCardFooter from "../ProofCard/ProofCardFooter";
import { SimpleProofType } from "../types";
import classes from "./ProofModalContent.module.css";

type Props = {
  record: SimpleProofType;
  handleTrack?: (
    trackedUserId: string,
    setUserDetails: React.Dispatch<React.SetStateAction<UserDataType>>,
    subscriptions?: UserSubscriptionsType | null
  ) => void;
};

export default function ProofModalContent({ record, handleTrack }: Props) {
  const { userDetails, setUserDetails } = useContext(UserContext);
  const { club, subscriptions } = userDetails || {};
  const { trackedUserId } = club || {};

  const isTracked = trackedUserId === record.userId;
  const isSelf = userDetails?._id === record.userId;

  const formattedDate = formatDate({ date: record.createdAt });
  const disclaimer = record.isPublic ? "🔓 Public" : "🔒 Private";
  const concernName = normalizeString(record.concern);

  return (
    <Stack className={classes.container}>
      <Text className={classes.taskName} lineClamp={2}>
        {record.icon} {record.taskName}
      </Text>
      {record.contentType === "image" ? (
        <ImageCard
          date={formattedDate}
          image={record.mainUrl.url}
          datePosition="bottom-right"
          showDate={!isSelf}
        />
      ) : (
        <VideoPlayer
          url={record.mainUrl.url}
          createdAt={record.createdAt}
          thumbnail={record.mainThumbnail.url}
          showDate={!isSelf}
        />
      )}
      <ProofCardFooter
        showConcern={true}
        showButton={true}
        disclaimer={<ContentPublicityIndicator isPublic={record.isPublic} />}
        concernName={concernName}
        formattedDate={formattedDate}
        isTracked={isTracked}
        handleTrack={() => {
          if (handleTrack && trackedUserId)
            handleTrack(trackedUserId, setUserDetails, subscriptions);
        }}
        isModal={true}
      />
    </Stack>
  );
}
