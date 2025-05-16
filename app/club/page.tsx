"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import cn from "classnames";
import { Skeleton, Stack, Text } from "@mantine/core";
import PageHeader from "@/components/PageHeader";
import { UserContext } from "@/context/UserContext";
import fetchViews from "@/functions/fetchViews";
import { PurchaseType } from "@/types/global";
import BalancePane from "./BalancePane";
import ClubProfilePreview from "./ClubProfilePreview";
import ViewsList from "./ViewsList";
import classes from "./club.module.css";

export const runtime = "edge";

export default function Club() {
  const [hasMore, setHasMore] = useState(false);
  const [views, setViews] = useState<PurchaseType[]>();
  const { userDetails } = useContext(UserContext);
  const { name, avatar, club } = userDetails || {};
  const { intro, socials } = club || { socials: [] };

  const handleFetchViews = useCallback(
    async (skip: boolean, existingCount?: number) => {
      const items = await fetchViews({ skip, existingCount });

      if (skip) {
        setViews((prev) => [...(prev || []), ...items.slice(0, 20)]);
      } else {
        setViews(items.slice(0, 20));
      }
      setHasMore(items.length === 21);
    },
    [views]
  );

  useEffect(() => {
    handleFetchViews(false, 0);
  }, []);
  return (
    <Stack className={cn(classes.container, "smallPage")}>
      <PageHeader title="Club profile" />
      <Skeleton className={classes.container} visible={!userDetails}>
        <ClubProfilePreview data={{ name, avatar, intro, socials }} type="you" showButton />
        <BalancePane />
        <Stack className={classes.list}>
          <Text c="dimmed" size="sm">
           Routine views
          </Text>
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
