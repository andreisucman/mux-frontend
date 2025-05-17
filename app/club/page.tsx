"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import cn from "classnames";
import { Group, SegmentedControl, Skeleton, Stack, Text } from "@mantine/core";
import PageHeader from "@/components/PageHeader";
import { UserContext } from "@/context/UserContext";
import fetchViews from "@/functions/fetchViews";
import { ViewType } from "@/types/global";
import BalancePane from "./BalancePane";
import ClubProfilePreview from "./ClubProfilePreview";
import ViewsList from "./ViewsList";
import classes from "./club.module.css";

export const runtime = "edge";

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

export default function Club() {
  const [hasMore, setHasMore] = useState(false);
  const [views, setViews] = useState<ViewType[]>();
  const [selectedInterval, setSelectedInterval] = useState<"day" | "week" | "month">("day");
  const { userDetails } = useContext(UserContext);
  const { name, avatar, club } = userDetails || {};
  const { intro, socials } = club || { socials: [] };

  const handleFetchViews = useCallback(
    async (skip: boolean, existingCount?: number) => {
      const items: TotalViewReponseType[] = await fetchViews({
        interval: selectedInterval,
        skip,
        existingCount,
      });

      const formattedItems: ViewType[] = items.map((item) => ({
        _id: item._id,
        part: item.part,
        concern: item.concern,
        earned: item.earnedDay || item.earnedWeek || item.earnedMonth || 0,
        views: item.viewsDay || item.viewsWeek || item.viewsMonth || 0,
      }));

      if (skip) {
        setViews((prev) => [...(prev || []), ...formattedItems.slice(0, 20)]);
      } else {
        setViews(formattedItems.slice(0, 20));
      }
      setHasMore(items.length === 21);
    },
    [views, selectedInterval]
  );

  useEffect(() => {
    handleFetchViews(false, 0);
  }, [selectedInterval]);

  return (
    <Stack className={cn(classes.container, "smallPage")}>
      <PageHeader title="Club profile" />
      <Skeleton className={classes.container} visible={!userDetails}>
        <ClubProfilePreview data={{ name, avatar, intro, socials }} type="you" showButton />
        <BalancePane />
        <Stack className={classes.list}>
          <Group align="end" justify="space-between">
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
          <ViewsList
            data={views}
            userName={name}
            hasMore={hasMore}
            handleFetchViews={() => handleFetchViews(hasMore, views?.length)}
          />
        </Stack>
      </Skeleton>
    </Stack>
  );
}
