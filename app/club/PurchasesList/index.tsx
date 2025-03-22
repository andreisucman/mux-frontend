import React, { useCallback } from "react";
import { IconCircleOff } from "@tabler/icons-react";
import { Masonry } from "masonic";
import InfiniteScroll from "react-infinite-scroller";
import { Loader, rem, Stack } from "@mantine/core";
import OverlayWithText from "@/components/OverlayWithText";
import { PurchaseType } from "@/types/global";
import PurchaseRow from "../PurchaseRow";
import SellerRow from "../PurchaseRow";
import classes from "./PurchasesList.module.css";

type Props = {
  pageType: "buyer" | "seller";
  hasMore: boolean;
  data?: PurchaseType[];
  handleFetchPurchases: () => void;
  onRowClick: (args: any) => void;
  onSubscribeClick: (sellerId: string, sellerName: string, part: string) => void;
  onUnsubscribeClick: () => void;
};

export default function PurchasesList({
  pageType,
  hasMore,
  data,
  onRowClick,
  onSubscribeClick,
  onUnsubscribeClick,
  handleFetchPurchases,
}: Props) {
  const memoizedPurchaseRow = useCallback(
    (props: any) => (
      <PurchaseRow
        variant={pageType}
        data={props.data}
        onRowClick={onRowClick}
        onSubscribeClick={onSubscribeClick}
        onUnsubscribeClick={onUnsubscribeClick}
      />
    ),
    [onRowClick, pageType, data?.length]
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
          <Loader style={{ margin: "auto" }} />
        </Stack>
      )}
    </Stack>
  );
}
