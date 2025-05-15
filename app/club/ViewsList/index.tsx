import React, { useCallback, useState } from "react";
import { IconCircleOff } from "@tabler/icons-react";
import { Masonry } from "masonic";
import InfiniteScroll from "react-infinite-scroller";
import { Loader, rem, Stack } from "@mantine/core";
import OverlayWithText from "@/components/OverlayWithText";
import { PurchaseType } from "@/types/global";
import ViewsRow from "../ViewsRow";
import classes from "./ViewsList.module.css";

type Props = {
  data?: PurchaseType[];
  hasMore: boolean;
  handleFetchPurchases: () => void;
};

export default function ViewsList({ data, hasMore, handleFetchPurchases }: Props) {
  const memoizedPurchaseRow = useCallback(
    (props: any) => <ViewsRow data={props.data} />,
    [data?.length]
  );
  return (
    <Stack className={classes.container}>
      {data ? (
        <>
          {data.length > 0 ? (
            <InfiniteScroll
              loader={
                <Stack mb={rem(16)} key={0}>
                  <Loader
                    m="0 auto"
                    pt="20%"
                    color="light-dark(var(--mantine-color-gray-4), var(--mantine-color-dark-4))"
                  />
                </Stack>
              }
              loadMore={handleFetchPurchases}
              useWindow={false}
              hasMore={hasMore}
              pageStart={0}
            >
              <Masonry
                items={data}
                maxColumnCount={1}
                rowGutter={16}
                render={memoizedPurchaseRow}
              />
            </InfiniteScroll>
          ) : (
            <OverlayWithText text="Nobody found" icon={<IconCircleOff className="icon" />} />
          )}
        </>
      ) : (
        <Stack flex={1}>
          <Loader
            m="0 auto"
            pt="20%"
            color="light-dark(var(--mantine-color-gray-4), var(--mantine-color-dark-4))"
          />
        </Stack>
      )}
    </Stack>
  );
}
