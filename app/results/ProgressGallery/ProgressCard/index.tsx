import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Image, Skeleton, Title } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import ContentBlurTypeButton from "@/components/ContentBlurTypeButton";
import { formatDate } from "@/helpers/formatDate";
import openResultModal from "@/helpers/openResultModal";
import ContentPublicityIndicator from "@/components/ContentPublicityIndicator";
import { HandleUpdateProgressType, SimpleProgressType } from "../../types";
import ProgressIndicator from "../ProgressIndicator";
import classes from "./ProgressCard.module.css";

type Props = {
  data: SimpleProgressType;
  handleUpdateProgress?: ({ contentId, images, initialImages }: HandleUpdateProgressType) => void;
};

function ProgressCard({ data, handleUpdateProgress }: Props) {
  const { width: containerWidth, ref } = useElementSize();
  const [showSkeleton, setShowSkeleton] = useState(true);
  const { images, createdAt } = data;
  const firstImage = images[0];

  const ringSize = useMemo(() => containerWidth * 0.35, [containerWidth]);

  const formattedDate = useMemo(() => formatDate({ date: createdAt }), [createdAt]);

  const handleContainerClick = useCallback(
    () =>
      openResultModal({
        record: data,
        type: "progress",
        title: (
          <Title order={5} component={"p"}>
            {formattedDate} - {data.part} progress preview
          </Title>
        ),
      }),
    [data.part]
  );

  useEffect(() => {
    const tId = setTimeout(() => {
      setShowSkeleton(false);
      clearTimeout(tId);
    }, Number(process.env.NEXT_PUBLIC_SKELETON_DURATION));
  }, []);

  return (
    <Skeleton visible={showSkeleton} className="skeleton">
      <div className={classes.imageWrapper} ref={ref}>
        <ContentBlurTypeButton
          contentId={data._id}
          currentMain={firstImage.mainUrl}
          contentCategory={"progress"}
          position="top-left"
          updateRecord={handleUpdateProgress}
        />
        <span className={classes.date}>{formattedDate}</span>
        <ContentPublicityIndicator isPublic={data.isPublic} />
        <Image
          className={classes.image}
          src={firstImage.mainUrl.url || "/"}
          width={100}
          height={100}
          alt=""
          onClick={handleContainerClick}
        />
        <ProgressIndicator record={data} ringSize={ringSize} />
      </div>
    </Skeleton>
  );
}

export default memo(ProgressCard);
