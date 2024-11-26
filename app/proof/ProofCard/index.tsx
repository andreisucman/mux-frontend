import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Group, Skeleton, Stack, Text, Title, UnstyledButton } from "@mantine/core";
import { modals } from "@mantine/modals";
import AvatarComponent from "@/components/AvatarComponent";
import CardMetaPanel from "@/components/CardMetaPanel";
import ImageCard from "@/components/ImageCard";
import VideoPlayer from "@/components/VideoPlayer";
import { formatDate } from "@/helpers/formatDate";
import openResultModal from "@/helpers/openResultModal";
import { normalizeString } from "@/helpers/utils";
import { UserDataType, UserSubscriptionsType } from "@/types/global";
import ProofCardFooter from "./ProofCardFooter";
import { ProofCardType } from "./types";
import classes from "./ProofCard.module.css";

type Props = {
  data: ProofCardType;
  isMobile?: boolean;
  isSelf?: boolean;
  contentChildren?: React.ReactNode;
  handleTrack?: (
    trackedUserId: string,
    setUserDetails: React.Dispatch<React.SetStateAction<UserDataType>>,
    subscriptions?: UserSubscriptionsType | null
  ) => void;
};

function ProofCard({ data, isSelf, isMobile, contentChildren, handleTrack }: Props) {
  const [showSkeleton, setShowSkeleton] = useState(true);
  const { taskName, icon, isLite } = data;

  const formattedDate = useMemo(() => formatDate({ date: data.createdAt }), [data.createdAt]);

  const concernName = useMemo(() => normalizeString(data.concern), [data.concern]);

  const handleClick = useCallback(() => {
    const title = isSelf ? (
      <Title order={5} lineClamp={1}>
        {`${data.icon} ${data.taskName}`}
      </Title>
    ) : (
      <UnstyledButton
        className={classes.modalTitle}
        component={Link}
        href={`/club/about?trackedUserId=${data.userId}`}
        onClick={() => modals.closeAll()}
      >
        <AvatarComponent avatar={data.avatar} size="sm" />
        <Title order={5}>{data.clubName}</Title>
      </UnstyledButton>
    );
    openResultModal({
      record: data,
      isFullScreen: isMobile,
      type: "proof",
      handleTrack,
      title,
    });
  }, [icon, data?.mainUrl?.name, concernName, isMobile, isSelf]);

  useEffect(() => {
    const tId = setTimeout(() => {
      setShowSkeleton(false);
      clearTimeout(tId);
    }, Number(process.env.NEXT_PUBLIC_SKELETON_DURATION));
  }, []);

  return (
    <Skeleton visible={showSkeleton} className="skeleton">
      <Stack className={classes.container}>
        <Group className={classes.heading}>
          <Text>{icon}</Text>
          <Title order={4} className={classes.taskName} lineClamp={1}>
            {taskName}
          </Title>
        </Group>
        <Stack className={classes.content}>
          {contentChildren}
          {data.contentType === "video" ? (
            <VideoPlayer
              url={data?.mainUrl?.url}
              createdAt={data.createdAt}
              thumbnail={data?.mainThumbnail?.url}
              onClick={handleClick}
              disabled
            />
          ) : (
            <ImageCard
              image={data?.mainUrl?.url}
              date={formattedDate}
              datePosition="bottom-right"
              onClick={handleClick}
              showDate={false}
            />
          )}
        </Stack>
        <ProofCardFooter
          showButton={false}
          showConcern={false}
          metaPanel={
            isLite ? (
              <></>
            ) : (
              <CardMetaPanel
                avatar={data.avatar}
                userId={data.userId}
                name={data.clubName}
                bodyProgress={data?.latestBodyScoreDifference?.overall || 0}
                faceProgress={data?.latestFaceScoreDifference?.overall || 0}
              />
            )
          }
          concernName={concernName}
          formattedDate={formattedDate}
        />
      </Stack>
    </Skeleton>
  );
}

export default memo(ProofCard);
