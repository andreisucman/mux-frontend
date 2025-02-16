import React, { memo, useMemo, useState } from "react";
import { Image, Skeleton } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import ContentModerationButtons from "@/components/ContentModerationButtons";
import ContentPublicityIndicator from "@/components/ContentPublicityIndicator";
import { formatDate } from "@/helpers/formatDate";
import useShowSkeleton from "@/helpers/useShowSkeleton";
import { SimpleProgressType } from "../../types";
import ProgressIndicator from "../ProgressIndicator";
import classes from "./ProgressCard.module.css";

type Props = {
  data: SimpleProgressType;
  isPublicPage?: boolean;
  isSelf?: boolean;
  setProgress: React.Dispatch<React.SetStateAction<SimpleProgressType[] | undefined>>;
  handleContainerClick: (data: any, showTrackButton: boolean) => void;
};

function ProgressCard({ data, isPublicPage, isSelf, setProgress, handleContainerClick }: Props) {
  const { width: containerWidth, ref } = useElementSize();
  const { images, createdAt } = data;
  const firstImage = images[0];

  const ringSize = useMemo(() => containerWidth * 0.35, [containerWidth]);
  const formattedDate = useMemo(() => formatDate({ date: createdAt }), [createdAt]);

  const showSkeleton = useShowSkeleton();

  return (
    <Skeleton visible={showSkeleton} className="skeleton">
      <div className={classes.imageWrapper} ref={ref}>
        {isSelf && (
          <>
            <ContentModerationButtons
              collectionKey="progress"
              contentId={data._id}
              setContent={setProgress}
              currentMain={firstImage.mainUrl}
              showBlur
              showDelete
            />
            <span className={classes.date}>{formattedDate}</span>
            <ContentPublicityIndicator isPublic={data.isPublic} />
          </>
        )}
        <Image
          className={classes.image}
          src={(firstImage && firstImage.mainUrl.url) || "/"}
          width={100}
          height={100}
          alt=""
          onClick={() => handleContainerClick(data, !!isPublicPage)}
        />
        <ProgressIndicator record={data} ringSize={ringSize} />
      </div>
    </Skeleton>
  );
}

export default memo(ProgressCard);
