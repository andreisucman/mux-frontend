import React, { memo, useMemo } from "react";
import { Image, Skeleton, Title } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import { outlookStyles } from "@/app/analysis/style/SelectStyleGoalModalContent/outlookStyles";
import CardMetaPanel from "@/components/CardMetaPanel";
import ContentBlurTypeButton from "@/components/ContentBlurTypeButton";
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
  showBlur?: boolean;
  showPublicity?: boolean;
  showVotes?: boolean;
  handleContainerClick: (data: any, showTrackButton: boolean) => void;
  setStyles: React.Dispatch<React.SetStateAction<SimpleStyleType[] | undefined>>;
};

function StyleCard({
  data,
  showMeta,
  showBlur,
  showDate,
  showVotes,
  showPublicity,
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
    userId,
    isPublic,
    clubName,
    avatar,
    latestHeadScoreDifference,
    latestBodyScoreDifference,
  } = data;

  const title = useMemo(() => {
    const styleIcon = outlookStyles.find((item) => item.name === styleName.toLowerCase())?.icon;
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
        {showBlur && (
          <ContentBlurTypeButton
            contentId={styleId}
            currentMain={mainUrl}
            contentCategory={"style"}
            position="top-left"
            setRecords={setStyles}
          />
        )}
        {showDate && <span className={classes.date}>{formattedDate}</span>}
        {showPublicity && <ContentPublicityIndicator isPublic={isPublic} />}
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
          name={clubName}
          avatar={avatar}
          userId={userId}
          formattedDate={formattedDate}
          bodyProgress={latestBodyScoreDifference}
          headProgress={latestHeadScoreDifference}
        />
      )}
    </Skeleton>
  );
}

export default memo(StyleCard);
