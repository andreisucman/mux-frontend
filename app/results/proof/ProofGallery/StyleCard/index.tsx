import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Image, Skeleton, Title } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import ContentBlurTypeButton from "@/components/ContentBlurTypeButton";
import ContentPublicityIndicator from "@/components/ContentPublicityIndicator";
import { SimpleStyleType } from "@/components/StyleModalContent/types";
import { formatDate } from "@/helpers/formatDate";
import openResultModal from "@/helpers/openResultModal";
import classes from "./StyleCard.module.css";

type Props = {
  data: SimpleStyleType;
  setStyles: React.Dispatch<React.SetStateAction<SimpleStyleType[] | undefined>>;
};

function StyleCard({ data, setStyles }: Props) {
  const [showSkeleton, setShowSkeleton] = useState(true);
  const { mainUrl, styleIcon, styleName, createdAt } = data;

  const formattedDate = useMemo(() => formatDate({ date: createdAt }), [createdAt]);

  const handleContainerClick = useCallback(
    () =>
      openResultModal({
        record: data,
        type: "style",
        title: (
          <Title order={5} component={"p"}>
            {formattedDate} - {data.styleName} style preview
          </Title>
        ),
        setRecords: setStyles,
      }),
    [data.styleName]
  );

  useEffect(() => {
    const tId = setTimeout(() => {
      setShowSkeleton(false);
      clearTimeout(tId);
    }, Number(process.env.NEXT_PUBLIC_SKELETON_DURATION));
  }, []);

  return (
    <Skeleton visible={showSkeleton} className="skeleton">
      <div className={classes.imageWrapper}>
        <ContentBlurTypeButton
          contentId={data._id}
          currentMain={mainUrl}
          contentCategory={"style"}
          position="top-left"
          setRecords={setStyles}
        />
        <span className={classes.date}>{formattedDate}</span>
        <ContentPublicityIndicator isPublic={data.isPublic} />
        <Image
          className={classes.image}
          src={mainUrl.url || "/"}
          width={100}
          height={100}
          alt=""
          onClick={handleContainerClick}
        />
      </div>
      <Title order={5} className={classes.styleName}>
        {styleIcon} {upperFirst(styleName || "")}
      </Title>
    </Skeleton>
  );
}

export default memo(StyleCard);
