"use client";

import React, { useCallback, useContext, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { IconCircleOff } from "@tabler/icons-react";
import InfiniteScroll from "react-infinite-scroller";
import { Loader, rem, Stack } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import MasonryComponent from "@/components/MasonryComponent";
import OverlayWithText from "@/components/OverlayWithText";
import { BlurChoicesContext } from "@/context/BlurChoicesContext";
import { HandleFetchProgressType, HandleUpdateProgressType, SimpleProgressType } from "../types";
import ProgressCard from "./ProgressCard";
import classes from "./ProgressGallery.module.css";

type Props = {
  hasMore: boolean;
  progress?: SimpleProgressType[];
  handleFetchProgress: (props: HandleFetchProgressType) => void;
  handleUpdateProgress?: ({ contentId, images, initialImages }: HandleUpdateProgressType) => void;
};

export default function ProgressGallery({
  progress,
  hasMore,
  handleUpdateProgress,
  handleFetchProgress,
}: Props) {
  const { blurType } = useContext(BlurChoicesContext);
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "head";
  const part = searchParams.get("part");
  const position = searchParams.get("position") || "front";
  const isMobile = useMediaQuery("(max-width: 36em)");

  const modelObject = progress && progress[0];
  const appliedBlurType = modelObject?.images[0].mainUrl.name;

  const processedProgress = useMemo(
    () =>
      progress
        ? progress.map((p) => ({
            ...p,
            images: p.images.filter((io) => io.position === position),
            initialImages: p.initialImages.filter((io) => io.position === position),
          }))
        : [],
    [position, appliedBlurType]
  );

  const memoizedProgressCard = useCallback(
    (props: any) => (
      <ProgressCard
        data={props.data}
        key={props.index}
        handleUpdateProgress={handleUpdateProgress}
      />
    ),
    [position, blurType]
  );

  const gridColumnWidth = useMemo(() => (isMobile ? 125 : 200), []);

  return (
    <Stack className={classes.container}>
      {progress && progress.length > 0 ? (
        <InfiniteScroll
          loader={
            <Stack mb={rem(16)} key={0}>
              <Loader m="auto" />
            </Stack>
          }
          loadMore={() => handleFetchProgress({ type, part, skip: hasMore })}
          hasMore={hasMore}
          pageStart={0}
        >
          <MasonryComponent
            maxColumnCount={3}
            columnGutter={16}
            columnWidth={gridColumnWidth}
            render={memoizedProgressCard}
            items={processedProgress}
          />
        </InfiniteScroll>
      ) : (
        <OverlayWithText
          icon={<IconCircleOff className="icon" />}
          text="Nothing found"
          outerStyles={{
            backgroundColor: "var(--mantine-color-dark-6)",
            border: "1px solid var(--mantine-color-dark-5)",
            borderRadius: "var(--mantine-radius-lg)",
          }}
        />
      )}
    </Stack>
  );
}
