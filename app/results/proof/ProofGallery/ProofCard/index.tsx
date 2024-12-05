import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Group, Skeleton, Stack, Text, Title, UnstyledButton } from "@mantine/core";
import { modals } from "@mantine/modals";
import AvatarComponent from "@/components/AvatarComponent";
import CardMetaPanel from "@/components/CardMetaPanel";
import ContentBlurTypeButton from "@/components/ContentBlurTypeButton";
import ContentPublicityIndicator from "@/components/ContentPublicityIndicator";
import ImageCard from "@/components/ImageCard";
import VideoPlayer from "@/components/VideoPlayer";
import Link from "@/helpers/custom-router/patch-router/link";
import { formatDate } from "@/helpers/formatDate";
import openResultModal from "@/helpers/openResultModal";
import { normalizeString } from "@/helpers/utils";
import { SimpleProofType } from "../../types";
import ProofCardFooter from "./ProofCardFooter";
import classes from "./ProofCard.module.css";

type Props = {
  isSelf: boolean;
  isMobile: boolean;
  isLite?: boolean;
  data: SimpleProofType;
  setProof: React.Dispatch<React.SetStateAction<SimpleProofType[] | undefined>>;
  showTrackButton?: boolean;
  contentChildren?: React.ReactNode;
};

function ProofCard({
  data,
  isSelf,
  isLite,
  isMobile,
  contentChildren,
  showTrackButton,
  setProof,
}: Props) {
  const [showSkeleton, setShowSkeleton] = useState(true);
  const {
    mainUrl,
    concern,
    avatar,
    clubName,
    isPublic,
    icon,
    taskName,
    createdAt,
    userId,
    mainThumbnail,
    contentType,
    latestBodyScoreDifference,
    latestFaceScoreDifference,
    _id: proofId,
  } = data;

  const formattedDate = useMemo(() => formatDate({ date: createdAt }), [createdAt]);
  const concernName = useMemo(() => normalizeString(concern), [concern]);

  const handleClick = useCallback(() => {
    const title = isSelf ? (
      <Title order={5} component={"p"} lineClamp={1}>
        {`${icon} ${taskName}`}
      </Title>
    ) : (
      <UnstyledButton
        className={classes.modalTitle}
        component={Link}
        href={`/club/about?followingUserId=${userId}`}
        onClick={() => modals.closeAll()}
      >
        <AvatarComponent avatar={avatar} size="sm" />
        <Title order={5} component={"p"}>
          {clubName}
        </Title>
      </UnstyledButton>
    );

    openResultModal({
      record: data,
      type: "proof",
      title,
      isFullScreen: isMobile,
    });
  }, []);

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
          <Title order={5} className={classes.taskName} lineClamp={1}>
            {taskName}
          </Title>
        </Group>
        <Stack className={classes.content}>
          {contentChildren}
          {contentType === "video" ? (
            <VideoPlayer
              url={mainUrl?.url}
              createdAt={formattedDate}
              thumbnail={mainThumbnail?.url}
              onClick={handleClick}
              disabled
            />
          ) : (
            <ImageCard
              image={mainUrl?.url}
              date={formattedDate}
              datePosition="bottom-right"
              onClick={handleClick}
              showDate={false}
            />
          )}
          {isSelf && (
            <ContentBlurTypeButton
              contentId={proofId}
              currentMain={mainUrl}
              contentCategory={"proof"}
              position="top-left"
              setRecords={setProof}
            />
          )}
          {isSelf && <ContentPublicityIndicator isPublic={isPublic} />}
        </Stack>
        <ProofCardFooter
          showConcern={false}
          metaPanel={
            isLite ? (
              <></>
            ) : (
              <CardMetaPanel
                avatar={avatar}
                userId={userId}
                name={clubName}
                bodyProgress={latestBodyScoreDifference?.overall || 0}
                faceProgress={latestFaceScoreDifference?.overall || 0}
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
