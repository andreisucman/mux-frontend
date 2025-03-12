import React, { useCallback } from "react";
import { IconCircleOff } from "@tabler/icons-react";
import { Masonry } from "masonic";
import InfiniteScroll from "react-infinite-scroller";
import { Loader, rem, Stack } from "@mantine/core";
import OverlayWithText from "@/components/OverlayWithText";
import { PurchaseType } from "@/types/global";
import PurchaseRow from "../PurchaseRow";
import classes from "./PurchasesList.module.css";

type Props = {
  hasMore: boolean;
  data?: PurchaseType[];
  onRowClick?: (args: any) => void;
  handleFetchPurchases: () => void;
};

export default function PurchasesList({ hasMore, data, onRowClick, handleFetchPurchases }: Props) {
  const memoizedPurchaseRow = useCallback(
    (props: any) => <PurchaseRow data={props.data} onRowClick={onRowClick} />,
    [onRowClick]
  );
  return (
    <Stack className={classes.container}>
      {data ? (
        <>
          {data.length > 0 ? (
            <InfiniteScroll
              loader={
                <Stack mb={rem(16)} key={0}>
                  <Loader m="auto" />
                </Stack>
              }
              loadMore={handleFetchPurchases}
              useWindow={false}
              hasMore={hasMore}
              pageStart={0}
            >
              <Masonry
                items={data}
                maxColumnCount={2}
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
          <Loader style={{ margin: "auto" }} />
        </Stack>
      )}
    </Stack>
  );
}
