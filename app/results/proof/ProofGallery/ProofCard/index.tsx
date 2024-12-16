import React, { memo, useCallback, useMemo } from "react";
import { Skeleton, Stack, Title } from "@mantine/core";
import CardMetaPanel from "@/components/CardMetaPanel";
import ContentBlurTypeButton from "@/components/ContentBlurTypeButton";
import ContentPublicityIndicator from "@/components/ContentPublicityIndicator";
import ImageCard from "@/components/ImageCard";
import VideoPlayer from "@/components/VideoPlayer";
import { formatDate } from "@/helpers/formatDate";
import openResultModal, { getRedirectModalTitle } from "@/helpers/openResultModal";
import useShowSkeleton from "@/helpers/useShowSkeleton";
import { normalizeString } from "@/helpers/utils";
import { SimpleProofType } from "../../types";
import ProofCardFooter from "./ProofCardFooter";
import ProofCardHeader from "./ProofCardHeader";
import classes from "./ProofCard.module.css";

type Props = {
  isMobile: boolean;
  isLite?: boolean;
  showFooter?: boolean;
  isPublicPage?: boolean;
  showContentBlurType?: boolean;
  showContentPublicity?: boolean;
  data: SimpleProofType;
  setProof?: React.Dispatch<React.SetStateAction<SimpleProofType[] | undefined>>;
  contentChildren?: React.ReactNode;
};

function ProofCard({
  data,
  isLite,
  isMobile,
  showFooter,
  isPublicPage,
  showContentBlurType,
  showContentPublicity,
  contentChildren,
  setProof,
}: Props) {
  const {
    mainUrl,
    concern,
    avatar,
    userName,
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
    const title = isPublicPage ? (
      getRedirectModalTitle({
        avatar,
        redirectUrl: `/club/about?id=${userId}`,
        title: userName,
      })
    ) : (
      <Title order={5} component={"p"} lineClamp={1}>
        {`${icon} ${taskName}`}
      </Title>
    );

    openResultModal({
      record: data,
      type: "proof",
      title,
      isFullScreen: isMobile,
    });
  }, []);

  const showSkeleton = useShowSkeleton();

  return (
    <Skeleton visible={showSkeleton} className={`${classes.container} skeleton`}>
      <ProofCardHeader concernName={concernName} icon={icon} taskName={taskName} />
      <Stack className={classes.content}>
        {contentChildren}
        {contentType === "video" ? (
          <VideoPlayer
            url={mainUrl?.url}
            createdAt={createdAt}
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
        {showContentBlurType && (
          <ContentBlurTypeButton
            contentId={proofId}
            currentMain={mainUrl}
            contentCategory={"proof"}
            position="top-left"
            setRecords={setProof}
          />
        )}
        {showContentPublicity && <ContentPublicityIndicator isPublic={isPublic} />}
      </Stack>
      {showFooter && (
        <ProofCardFooter
          metaPanel={
            isLite ? (
              <></>
            ) : (
              <CardMetaPanel
                avatar={avatar}
                userId={userId}
                name={userName}
                formattedDate={formattedDate}
                bodyProgress={latestBodyScoreDifference || 0}
                headProgress={latestFaceScoreDifference || 0}
              />
            )
          }
        />
      )}
    </Skeleton>
  );
}

export default memo(ProofCard);
