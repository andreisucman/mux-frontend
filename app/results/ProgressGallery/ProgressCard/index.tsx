import React, { memo, useMemo } from "react";
import { Image, Skeleton } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import ContentBlurTypeButton from "@/components/ContentBlurTypeButton";
import ContentPublicityIndicator from "@/components/ContentPublicityIndicator";
import { formatDate } from "@/helpers/formatDate";
import useShowSkeleton from "@/helpers/useShowSkeleton";
import { SimpleProgressType } from "../../types";
import ProgressIndicator from "../ProgressIndicator";
import classes from "./ProgressCard.module.css";

type Props = {
  data: SimpleProgressType;
  showTrackButton: boolean;
  setProgress: React.Dispatch<React.SetStateAction<SimpleProgressType[] | undefined>>;
  handleContainerClick: (data: any, showTrackButton: boolean) => void;
};

function ProgressCard({ data, showTrackButton, setProgress, handleContainerClick }: Props) {
  const { width: containerWidth, ref } = useElementSize();
  const { images, createdAt } = data;
  const firstImage = images[0];

  const ringSize = useMemo(() => containerWidth * 0.35, [containerWidth]);
  const formattedDate = useMemo(() => formatDate({ date: createdAt }), [createdAt]);

  const showSkeleton = useShowSkeleton();
  
  return (
    <Skeleton visible={showSkeleton} className="skeleton">
      <div className={classes.imageWrapper} ref={ref}>
        {firstImage && (
          <ContentBlurTypeButton
            contentId={data._id}
            currentMain={firstImage.mainUrl}
            contentCategory={"progress"}
            position="top-left"
            setRecords={setProgress}
          />
        )}
        <span className={classes.date}>{formattedDate}</span>
        <ContentPublicityIndicator isPublic={data.isPublic} />
        <Image
          className={classes.image}
          src={(firstImage && firstImage.mainUrl.url) || "/"}
          width={100}
          height={100}
          alt=""
          onClick={() => handleContainerClick(data, showTrackButton)}
        />
        <ProgressIndicator record={data} ringSize={ringSize} />
      </div>
    </Skeleton>
  );
}

export default memo(ProgressCard);
