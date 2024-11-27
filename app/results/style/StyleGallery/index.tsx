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
import { HandleFetchStylesType, HandleUpdateStylesType } from "../types";
import StyleCard from "./StyleCard";
import classes from "./ProgressGallery.module.css";

type Props = {
  hasMore: boolean;
  styles?: SimpleStyleType[];
  handleFetchStyles: (props: HandleFetchStylesType) => void;
  handleUpdateStyles?: ({ contentId, mainUrl, initialMainUrl }: HandleUpdateStylesType) => void;
};

export default function StyleGallery({
  styles,
  hasMore,
  handleUpdateStyles,
  handleFetchStyles,
}: Props) {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "head";
  const styleName = searchParams.get("styleName");
  const isMobile = useMediaQuery("(max-width: 36em)");

  const modelObject = styles && styles[0];
  const appliedBlurType = modelObject?.mainUrl.name;

  const memoizedStyleCard = useCallback(
    (props: any) => <StyleCard data={props.data} key={props.index} handleUpdateStyles={handleUpdateStyles} />,
    [styleName, appliedBlurType]
  );

  const gridColumnWidth = useMemo(() => (isMobile ? 125 : 200), [isMobile]);

  return (
    <Stack className={classes.container}>
      {styles && styles.length > 0 ? (
        <InfiniteScroll
          loader={
            <Stack mb={rem(16)} key={0}>
              <Loader m="auto" />
            </Stack>
          }
          loadMore={() => handleFetchStyles({ type, styleName, skip: hasMore })}
          hasMore={hasMore}
          pageStart={0}
        >
          <MasonryComponent
            maxColumnCount={3}
            columnGutter={16}
            columnWidth={gridColumnWidth}
            render={memoizedStyleCard}
            items={styles}
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
