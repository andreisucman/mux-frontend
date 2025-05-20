import React, { useCallback, useEffect, useState } from "react";
import { IconCircleOff } from "@tabler/icons-react";
import { Masonry } from "masonic";
import InfiniteScroll from "react-infinite-scroller";
import { Group, Loader, rem, SegmentedControl, Stack, Text, Title } from "@mantine/core";
import OverlayWithText from "@/components/OverlayWithText";
import fetchViews from "@/functions/fetchViews";
import { useRouter } from "@/helpers/custom-router";
import { ViewType } from "@/types/global";
import ViewsRow from "../ViewsRow";
import classes from "./ViewsList.module.css";

type Props = {
  userName?: string;
};
type TotalViewReponseType = {
  _id: string;
  earnedDay?: number;
  earnedWeek?: number;
  earnedMonth?: number;
  viewsDay?: number;
  viewsWeek?: number;
  viewsMonth?: number;
  concern: string;
  part: string;
};

const viewSegments = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
];

export default function ViewsList({ userName }: Props) {
  const router = useRouter();
  const [hasMore, setHasMore] = useState(false);
  const [views, setViews] = useState<ViewType[]>();
  const [selectedInterval, setSelectedInterval] = useState<"day" | "week" | "month">("day");

  const handleFetchViews = useCallback(async () => {
    const items: TotalViewReponseType[] = await fetchViews({
      interval: selectedInterval,
      skip: hasMore,
      existingCount: views ? views.length : 0,
    });

    const formattedItems: ViewType[] = items.map((item) => ({
      _id: item._id,
      part: item.part,
      concern: item.concern,
      earned: item.earnedDay || item.earnedWeek || item.earnedMonth || 0,
      views: item.viewsDay || item.viewsWeek || item.viewsMonth || 0,
    }));

    if (hasMore) {
      setViews((prev) => [...(prev || []), ...formattedItems.slice(0, 20)]);
    } else {
      setViews(formattedItems.slice(0, 20));
    }
    setHasMore(items.length === 21);
  }, [views, selectedInterval]);

  useEffect(() => {
    handleFetchViews();
  }, [selectedInterval]);

  const handleRedirect = useCallback(
    (part: string, concern: string) => {
      if (!userName) return;
      router.push(`/club/routines/${userName}?part=${part}&concern=${concern}`);
    },
    [userName]
  );

  const memoizedViewRow = useCallback(
    (props: any) => <ViewsRow data={props.data} onClick={handleRedirect} />,
    [views?.length, handleRedirect]
  );
  return (
    <Stack className={classes.container}>
      <Group align="start" justify="space-between">
        <Text c="dimmed" size="sm">
          Routine views
        </Text>
        <SegmentedControl
          data={viewSegments}
          value={selectedInterval}
          onChange={(value) => setSelectedInterval(value as "day")}
          size="xs"
        />
      </Group>
      {views ? (
        <>
          {views.length > 0 ? (
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
              <Masonry items={views} maxColumnCount={2} rowGutter={12} render={memoizedViewRow} />
            </InfiniteScroll>
          ) : (
            <OverlayWithText
              text="Nothing found"
              outerStyles={{ border: "none" }}
              icon={<IconCircleOff size={20} />}
            />
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
