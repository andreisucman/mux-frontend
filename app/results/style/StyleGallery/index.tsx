"use client";

import React, { useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { IconCircleOff } from "@tabler/icons-react";
import InfiniteScroll from "react-infinite-scroller";
import { Loader, rem, Stack } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
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
  hasMore: boolean;
  isSelfPage?: boolean;
  styles?: SimpleStyleType[];
  handleFetchStyles: (props: HandleFetchStyleProps) => void;
  setStyles: React.Dispatch<React.SetStateAction<SimpleStyleType[] | undefined>>;
};

export default function StyleGallery({
  styles,
  hasMore,
  isSelfPage,
  setStyles,
  handleFetchStyles,
}: Props) {
  const searchParams = useSearchParams();
  const isMobile = useMediaQuery("(max-width: 36em)");

  const type = searchParams.get("type") || "head";
  const styleName = searchParams.get("styleName");
  const followingUserId = searchParams.get("followingUserId");

  const modelObject = styles && styles[0];
  const appliedBlurType = modelObject?.mainUrl.name;

  const memoizedStyleCard = useCallback(
    (props: any) => (
      <StyleCard
        data={props.data}
        key={props.index}
        setStyles={setStyles}
        showTrackButton={!isSelfPage}
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
              followingUserId,
              styleName,
              type,
            })
          }
          hasMore={hasMore}
          pageStart={0}
        >
          <MasonryComponent
            maxColumnCount={2}
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
