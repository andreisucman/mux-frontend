"use client";

import React, { useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { IconCircleOff } from "@tabler/icons-react";
import InfiniteScroll from "react-infinite-scroller";
import { Loader, rem, Stack } from "@mantine/core";
import MasonryComponent from "@/components/MasonryComponent";
import OverlayWithText from "@/components/OverlayWithText";
import { SimpleStyleType } from "@/components/StyleModalContent/types";
import { FetchStyleProps } from "@/functions/fetchStyle";
import StyleCard from "./StyleCard";
import classes from "./StyleGallery.module.css";

interface HandleFetchStyleProps extends FetchStyleProps {
  currentArray?: SimpleStyleType[];
}

type Props = {
  userName?: string | string[];
  hasMore: boolean;
  columns?: number;
  isSelf?: boolean;
  isPublic?: boolean;
  showMeta?: boolean;
  styles?: SimpleStyleType[];
  handleContainerClick: (data: any, showTrackButton: boolean) => void;
  handleFetchStyles: (props: HandleFetchStyleProps) => void;
  setStyles: React.Dispatch<React.SetStateAction<SimpleStyleType[] | undefined>>;
};

export default function StyleGallery({
  styles,
  hasMore,
  columns,
  showMeta,
  isSelf,
  isPublic,
  userName,
  setStyles,
  handleContainerClick,
  handleFetchStyles,
}: Props) {
  const searchParams = useSearchParams();

  const type = searchParams.get("type");
  const styleName = searchParams.get("styleName");

  const modelObject = styles && styles[0];
  const appliedBlurType = modelObject?.mainUrl.name;

  const memoizedStyleCard = useCallback(
    (props: any) => (
      <StyleCard
        data={props.data}
        key={props.index}
        showMeta={showMeta}
        setStyles={setStyles}
        handleContainerClick={handleContainerClick}
        showTrackButton={!!isPublic}
        showBlur={!isPublic && !!isSelf}
        showDate={!isPublic}
        showPublicity={!isPublic && !!isSelf}
        showVotes={!isPublic}
      />
    ),
    [styleName, appliedBlurType]
  );

  return (
    <Stack className={classes.container}>
      {styles && styles.length > 0 ? (
        <InfiniteScroll
          loader={
            <Stack mb={rem(16)} key={0}>
              <Loader m="auto" />
            </Stack>
          }
          loadMore={() =>
            handleFetchStyles({
              skip: hasMore,
              currentArray: styles,
              followingUserName: userName,
              styleName,
              type,
            })
          }
          hasMore={hasMore}
          pageStart={0}
        >
          <MasonryComponent
            maxColumnCount={columns || 1}
            columnGutter={16}
            render={memoizedStyleCard}
            items={styles}
          />
        </InfiniteScroll>
      ) : (
        <OverlayWithText icon={<IconCircleOff className="icon" />} text="Nothing found" />
      )}
    </Stack>
  );
}
