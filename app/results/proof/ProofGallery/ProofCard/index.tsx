import React, { memo, useCallback, useMemo, useState } from "react";
import { Group, Skeleton, Stack, Title } from "@mantine/core";
import ContentPublicityIndicator from "@/components/ContentPublicityIndicator";
import DeleteContentButton from "@/components/DeleteContentButton";
import ImageCard from "@/components/ImageCard";
import VideoPlayer from "@/components/VideoPlayer";
import { formatDate } from "@/helpers/formatDate";
import openResultModal from "@/helpers/openResultModal";
import useShowSkeleton from "@/helpers/useShowSkeleton";
import { normalizeString } from "@/helpers/utils";
import { SimpleProofType } from "../../types";
import ProofCardHeader from "./ProofCardHeader";
import classes from "./ProofCard.module.css";

type Props = {
  isPublicPage?: boolean;
  showContentModerationButtons?: boolean;
  data: SimpleProofType;
  setProof?: React.Dispatch<React.SetStateAction<SimpleProofType[] | undefined>>;
  contentChildren?: React.ReactNode;
};

function ProofCard({
  data,
  isPublicPage,
  contentChildren,
  showContentModerationButtons,
  setProof,
}: Props) {
  const {
    _id: proofId,
    mainUrl,
    concern,
    userName,
    icon,
    taskName,
    createdAt,
    mainThumbnail,
    contentType,
  } = data;

  const [isLoading, setIsLoading] = useState(false);
  const formattedDate = useMemo(() => formatDate({ date: createdAt }), [createdAt]);
  const concernName = useMemo(() => normalizeString(concern), [concern]);

  const handleClick = useCallback(() => {
    const title = (
      <Group gap={12}>
        {icon}
        <Title order={5} component={"p"} lineClamp={1}>
          {taskName}
        </Title>
      </Group>
    );

    openResultModal({
      record: data,
      type: "proof",
      title,
    });
  }, [isPublicPage, data, userName]);

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
            playOnBufferEnd
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
        {showContentModerationButtons && (
          <>
            <DeleteContentButton
              contentId={proofId}
              collectionKey={"proof"}
              setContent={setProof}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              isDisabled={isLoading}
              position="top-left"
            />
            <ContentPublicityIndicator isPublic={!!isPublicPage} withIcon position="bottom-right" />
          </>
        )}
      </Stack>
    </Skeleton>
  );
}

export default memo(ProofCard);
