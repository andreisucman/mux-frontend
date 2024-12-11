"use client";

import React, { useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { IconCircleOff } from "@tabler/icons-react";
import InfiniteScroll from "react-infinite-scroller";
import { Loader, rem, Stack } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import MasonryComponent from "@/components/MasonryComponent";
import OverlayWithText from "@/components/OverlayWithText";
import { FetchProgressProps } from "@/functions/fetchProgress";
import { SimpleProgressType } from "../types";
import ProgressCard from "./ProgressCard";
import classes from "./ProgressGallery.module.css";

interface HandleFetchProgressProps extends FetchProgressProps {
  currentArray?: SimpleProgressType[];
}

type Props = {
  hasMore: boolean;
  isSelfPage?: boolean;
  progress?: SimpleProgressType[];
  handleContainerClick: (data: any, showTrackButton: boolean) => void;
  handleFetchProgress: (props: HandleFetchProgressProps) => void;
  setProgress: React.Dispatch<React.SetStateAction<SimpleProgressType[] | undefined>>;
};

export default function ProgressGallery({
  progress,
  hasMore,
  isSelfPage,
  setProgress,
  handleContainerClick,
  handleFetchProgress,
}: Props) {
  const searchParams = useSearchParams();
  const isMobile = useMediaQuery("(max-width: 36em)");
  const type = searchParams.get("type") || "head";
  const part = searchParams.get("part");
  const position = searchParams.get("position") || "front";
  const followingUserId = searchParams.get("followingUserId") || "front";

  const modelObject = progress && progress[0];
  const appliedBlurType = modelObject?.images[0].mainUrl.name;

  const memoizedProgressCard = useCallback(
    (props: any) => (
      <ProgressCard
        data={props.data}
        key={props.index}
        showTrackButton={!isSelfPage}
        setProgress={setProgress}
        handleContainerClick={handleContainerClick}
      />
    ),
    [position, isSelfPage, appliedBlurType, typeof progress]
  );

  const gridColumnWidth = useMemo(() => (isMobile ? 125 : 200), [isMobile]);

  return (
    <Stack className={classes.container}>
      {progress && progress.length > 0 ? (
        <InfiniteScroll
          loader={
            <Stack mb={rem(16)} key={0}>
              <Loader m="auto" />
            </Stack>
          }
          loadMore={() =>
            handleFetchProgress({
              type,
              part,
              skip: hasMore,
              currentArray: progress,
              followingUserId,
            })
          }
          hasMore={hasMore}
          pageStart={0}
        >
          <MasonryComponent
            maxColumnCount={3}
            columnGutter={16}
            columnWidth={gridColumnWidth}
            render={memoizedProgressCard}
            items={progress}
          />
        </InfiniteScroll>
      ) : (
        <OverlayWithText icon={<IconCircleOff className="icon" />} text="Nothing found" />
      )}
    </Stack>
  );
}
