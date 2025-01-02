import React, { memo, useMemo } from "react";
import { Image, Skeleton, Title } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import CardMetaPanel from "@/components/CardMetaPanel";
import ContentModerationButtons from "@/components/ContentModerationButtons";
import ContentPublicityIndicator from "@/components/ContentPublicityIndicator";
import { SimpleStyleType } from "@/components/StyleModalContent/types";
import VotesCountIndicator from "@/components/VotesCountIndicator";
import { formatDate } from "@/helpers/formatDate";
import useShowSkeleton from "@/helpers/useShowSkeleton";
import classes from "./StyleCard.module.css";

type Props = {
  showTrackButton: boolean;
  data: SimpleStyleType;
  showMeta?: boolean;
  showDate?: boolean;
  isSelf?: boolean;
  showVotes?: boolean;
  handleContainerClick: (data: any, showTrackButton: boolean) => void;
  setStyles: React.Dispatch<React.SetStateAction<SimpleStyleType[] | undefined>>;
};

function StyleCard({
  data,
  showMeta,
  isSelf,
  showDate,
  showVotes,
  showTrackButton,
  handleContainerClick,
  setStyles,
}: Props) {
  const {
    mainUrl,
    styleName,
    styleIcon,
    createdAt,
    votes,
    _id: styleId,
    isPublic,
    userName,
    avatar,
    latestHeadScoreDifference,
    latestBodyScoreDifference,
  } = data;

  const title = useMemo(() => {
    return `${styleIcon} ${upperFirst(styleName || "")}`;
  }, [styleName]);

  const formattedDate = useMemo(() => formatDate({ date: createdAt }), [createdAt]);
  const showSkeleton = useShowSkeleton();

  return (
    <Skeleton visible={showSkeleton} className={`skeleton ${classes.container}`}>
      <Title order={5} className={classes.styleName}>
        {title}
      </Title>
      <div className={classes.imageWrapper}>
        {isSelf && (
          <>
            <ContentModerationButtons
              collectionKey="style"
              contentId={styleId}
              setContent={setStyles}
              currentMain={mainUrl}
              showBlur
              showDelete
            />
            <ContentPublicityIndicator isPublic={isPublic} />
          </>
        )}
        {showDate && <span className={classes.date}>{formattedDate}</span>}
        <Image
          className={classes.image}
          src={mainUrl.url || "/"}
          width={100}
          height={100}
          alt=""
          onClick={() => handleContainerClick(data, showTrackButton)}
        />
        {showVotes && <VotesCountIndicator votes={votes} />}
      </div>
      {showMeta && (
        <CardMetaPanel
          name={userName}
          avatar={avatar}
          formattedDate={formattedDate}
          bodyProgress={latestBodyScoreDifference}
          headProgress={latestHeadScoreDifference}
        />
      )}
    </Skeleton>
  );
}

export default memo(StyleCard);
