import React, { useContext } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Stack, Text } from "@mantine/core";
import ContentPublicityIndicator from "@/components/ContentPublicityIndicator";
import ImageCard from "@/components/ImageCard";
import VideoPlayer from "@/components/VideoPlayer";
import { UserContext } from "@/context/UserContext";
import handleTrackUser from "@/functions/handleTrackUser";
import { useRouter } from "@/helpers/custom-router";
import { formatDate } from "@/helpers/formatDate";
import { normalizeString } from "@/helpers/utils";
import ProofCardFooter from "../ProofGallery/ProofCard/ProofCardFooter";
import { SimpleProofType } from "../types";
import classes from "./ProofModalContent.module.css";

type Props = {
  record: SimpleProofType;
  showTrackButton?: boolean;
};

export default function ProofModalContent({ record, showTrackButton }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { status, userDetails, setUserDetails } = useContext(UserContext);
  const { club, subscriptions } = userDetails || {};
  const { trackedUserId } = club || {};

  const isTracked = trackedUserId === record.userId;
  const isSelf = userDetails?._id === record.userId;

  const formattedDate = formatDate({ date: record.createdAt });
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
          isStatic
        />
      ) : (
        <VideoPlayer
          url={record.mainUrl.url}
          createdAt={record.createdAt}
          thumbnail={record.mainThumbnail.url}
          showDate={!isSelf}
          isStatic
        />
      )}
      <ProofCardFooter
        showConcern={true}
        disclaimer={<ContentPublicityIndicator isPublic={record.isPublic} />}
        concernName={concernName}
        formattedDate={formattedDate}
        isTracked={isTracked}
        handleTrack={() => {
          if (showTrackButton && club) {
            handleTrackUser({
              router,
              status,
              clubData: club,
              redirectPath: `/club/proof?trackedUserId=${record.userId}`,
              cancelPath: `/${pathname}?${searchParams.toString()}`,
              trackedUserId: record.userId,
              setUserDetails,
              subscriptions,
            });
          }
        }}
        isModal={true}
      />
    </Stack>
  );
}
