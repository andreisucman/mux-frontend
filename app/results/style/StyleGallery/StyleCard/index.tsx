import React, { memo, useEffect, useMemo, useState } from "react";
import { Image, Skeleton, Title } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import { outlookStyles } from "@/app/analysis/style/SelectStyleGoalModalContent/outlookStyles";
import CardMetaPanel from "@/components/CardMetaPanel";
import ContentBlurTypeButton from "@/components/ContentBlurTypeButton";
import ContentPublicityIndicator from "@/components/ContentPublicityIndicator";
import { SimpleStyleType } from "@/components/StyleModalContent/types";
import VotesCountIndicator from "@/components/VotesCountIndicator";
import { formatDate } from "@/helpers/formatDate";
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
  const [showSkeleton, setShowSkeleton] = useState(true);
  const {
    mainUrl,
    styleName,
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

  const formattedDate = useMemo(() => formatDate({ date: createdAt }), [createdAt]);

  const styleIcon = useMemo(
    () => outlookStyles.find((item) => item.name === styleName.toLowerCase())?.icon,
    [styleName]
  );

  useEffect(() => {
    const tId = setTimeout(() => {
      setShowSkeleton(false);
      clearTimeout(tId);
    }, Number(process.env.NEXT_PUBLIC_SKELETON_DURATION));
  }, []);

  return (
    <Skeleton visible={showSkeleton} className={`skeleton ${classes.container}`}>
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
        <Title order={4} className={classes.styleName}>
          {styleIcon} {upperFirst(styleName || "")}
        </Title>
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
