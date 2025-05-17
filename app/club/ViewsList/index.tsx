import React, { useCallback } from "react";
import { IconCircleOff } from "@tabler/icons-react";
import { Masonry } from "masonic";
import InfiniteScroll from "react-infinite-scroller";
import { Loader, rem, Stack } from "@mantine/core";
import OverlayWithText from "@/components/OverlayWithText";
import { useRouter } from "@/helpers/custom-router";
import { ViewType } from "@/types/global";
import ViewsRow from "../ViewsRow";
import classes from "./ViewsList.module.css";

type Props = {
  data?: ViewType[];
  userName?: string;
  hasMore: boolean;
  handleFetchViews: () => void;
};

export default function ViewsList({ data, userName, hasMore, handleFetchViews }: Props) {
  const router = useRouter();
  const handleRedirect = useCallback(
    (part: string, concern: string) => {
      if (!userName) return;
      router.push(`/club/routines/${userName}?part=${part}&concern=${concern}`);
    },
    [userName]
  );

  const memoizedViewRow = useCallback(
    (props: any) => <ViewsRow data={props.data} onClick={handleRedirect} />,
    [data?.length, handleRedirect]
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
              loadMore={handleFetchViews}
              useWindow={false}
              hasMore={hasMore}
              pageStart={0}
            >
              <Masonry items={data} maxColumnCount={2} rowGutter={16} render={memoizedViewRow} />
            </InfiniteScroll>
          ) : (
            <OverlayWithText text="Nothing found" icon={<IconCircleOff size={20} />} />
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
