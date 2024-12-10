import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Image, Skeleton, Title } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import { outlookStyles } from "@/app/analysis/style/SelectStyleGoalModalContent/outlookStyles";
import ContentBlurTypeButton from "@/components/ContentBlurTypeButton";
import ContentPublicityIndicator from "@/components/ContentPublicityIndicator";
import { SimpleStyleType } from "@/components/StyleModalContent/types";
import VotesCountIndicator from "@/components/VotesCountIndicator";
import { formatDate } from "@/helpers/formatDate";
import openResultModal from "@/helpers/openResultModal";
import classes from "./StyleCard.module.css";

type Props = {
  showTrackButton: boolean;
  data: SimpleStyleType;
  showDate?: boolean;
  showBlur?: boolean;
  showPublicity?: boolean;
  showVotes?: boolean;
  setStyles: React.Dispatch<React.SetStateAction<SimpleStyleType[] | undefined>>;
};

function StyleCard({
  data,
  showBlur,
  showDate,
  showVotes,
  showPublicity,
  showTrackButton,
  setStyles,
}: Props) {
  const [showSkeleton, setShowSkeleton] = useState(true);
  const { mainUrl, styleName, createdAt, votes, _id: styleId, isPublic } = data;

  const formattedDate = useMemo(() => formatDate({ date: createdAt }), [createdAt]);

  const styleIcon = useMemo(
    () => outlookStyles.find((item) => item.name === styleName.toLowerCase())?.icon,
    [styleName]
  );

  const handleContainerClick = useCallback(
    () =>
      openResultModal({
        record: data,
        type: "style",
        title: (
          <Title order={5} component={"p"}>
            {formattedDate} - {styleName} style
          </Title>
        ),
        showTrackButton,
        setRecords: setStyles,
      }),
    [styleName, showTrackButton]
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
          onClick={handleContainerClick}
        />
        {showVotes && <VotesCountIndicator votes={votes} />}
        <Title order={4} className={classes.styleName}>
          {styleIcon} {upperFirst(styleName || "")}
        </Title>
      </div>
    </Skeleton>
  );
}

export default memo(StyleCard);
