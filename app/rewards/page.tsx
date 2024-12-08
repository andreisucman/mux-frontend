"use client";

import React, { useCallback, useEffect, useState } from "react";
import { IconCircleOff } from "@tabler/icons-react";
import InfiniteScroll from "react-infinite-scroller";
import { Loader, rem, Skeleton, Stack, Title } from "@mantine/core";
import MasonryComponent from "@/components/MasonryComponent";
import OverlayWithText from "@/components/OverlayWithText";
import callTheServer from "@/functions/callTheServer";
import openErrorModal from "@/helpers/openErrorModal";
import RewardCard from "./RewardCard";
import { RewardCardType } from "./types";
import classes from "./rewards.module.css";

export const runtime = "edge";

export default function Rewards() {
  const [rewards, setRewards] = useState<RewardCardType[]>();
  const [hasMore, setHasMore] = useState(false);

  const fetchRewards = useCallback(
    async (skip?: boolean) => {
      try {
        let finalEndpoint = "getRewards";
        const queryParams = [];

        if (skip && rewards && rewards.length > 0) {
          queryParams.push(`skip=${rewards.length}`);
        }

        const response = await callTheServer({
          endpoint: finalEndpoint,
          method: "GET",
        });

        if (response.status === 200) {
          if (skip) {
            setRewards([...(rewards || []), ...response.message.slice(0, 6)]);
          } else {
            setRewards(response.message.slice(0, 6));
          }
          setHasMore(response.message.length === 7);
        } else {
          openErrorModal();
        }
      } catch (err) {
        console.log("Error in fetchRewards: ", err);
      }
    },
    [rewards && rewards.length]
  );

  const memoizedRewardCard = useCallback(
    (props: any) => <RewardCard data={props.data} key={props.index} />,
    []
  );

  useEffect(() => {
    fetchRewards();
  }, []);

  return (
    <Stack className={`${classes.container} largePage`}>
      <Title order={1}>Rewards</Title>
      {rewards ? (
        <>
          {rewards.length > 0 ? (
            <InfiniteScroll
              loader={
                <Stack mb={rem(16)} key={0}>
                  <Loader m="auto" />
                </Stack>
              }
              loadMore={() => fetchRewards(hasMore)}
              useWindow={true}
              hasMore={hasMore}
              pageStart={0}
            >
              <MasonryComponent
                maxColumnCount={3}
                columnGutter={16}
                columnWidth={300}
                render={memoizedRewardCard}
                items={rewards}
              />
            </InfiniteScroll>
          ) : (
            <OverlayWithText text="Nothing found" icon={<IconCircleOff className="icon" />} />
          )}
        </>
      ) : (
        <Skeleton className="skeleton" flex={1}></Skeleton>
      )}
    </Stack>
  );
}
