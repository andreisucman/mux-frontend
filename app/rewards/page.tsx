"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { IconCircleOff } from "@tabler/icons-react";
import InfiniteScroll from "react-infinite-scroller";
import { Group, Loader, rem, Stack, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import MasonryComponent from "@/components/MasonryComponent";
import OverlayWithText from "@/components/OverlayWithText";
import { UserContext } from "@/context/UserContext";
import { AuthStateEnum } from "@/context/UserContext/types";
import callTheServer from "@/functions/callTheServer";
import { useRouter } from "@/helpers/custom-router";
import openAuthModal from "@/helpers/openAuthModal";
import openErrorModal from "@/helpers/openErrorModal";
import openInfoModal from "@/helpers/openInfoModal";
import { UserDataType } from "@/types/global";
import { ReferrerEnum } from "../auth/AuthForm/types";
import RewardCard from "./RewardCard";
import { RewardCardType } from "./types";
import classes from "./rewards.module.css";

export const runtime = "edge";

export type ClaimRewardProps = {
  rewardId: string;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Rewards() {
  const router = useRouter();
  const { status, userDetails, setUserDetails } = useContext(UserContext);
  const [rewards, setRewards] = useState<RewardCardType[]>();
  const [hasMore, setHasMore] = useState(false);

  const { _id: userId } = userDetails || {};

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
            setRewards([...(rewards || []), ...response.message.slice(0, 20)]);
          } else {
            setRewards(response.message.slice(0, 20));
          }
          setHasMore(response.message.length === 21);
        } else {
          openErrorModal();
        }
      } catch (err) {}
    },
    [rewards && rewards.length]
  );

  const claimReward = useCallback(
    async ({ rewardId, isLoading, setIsLoading }: ClaimRewardProps) => {
      if (isLoading) return;
      setIsLoading(true);

      if (status !== AuthStateEnum.AUTHENTICATED) {
        openAuthModal({
          title: "Sign in",
          stateObject: {
            referrer: ReferrerEnum.REWARDS,
            localUserId: userId,
            redirectPath: "/rewards",
          },
        });
        setIsLoading(false);
        return;
      }

      try {
        const response = await callTheServer({
          endpoint: "claimReward",
          method: "POST",
          body: { rewardId },
        });

        if (response.status === 200) {
          if (response.error) {
            openErrorModal({
              description: response.error,
            });
            return;
          }

          const { rewards, rewardValue } = response.message;

          setRewards(rewards);
          openInfoModal({
            title: "✔️ Success!",
            description: (
              <Group gap={8}>
                Reward added to your Club balance.
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    router.push("/club");
                    modals.closeAll();
                  }}
                >
                  Click to see.
                </span>
              </Group>
            ),
          });

          setUserDetails((prev: UserDataType) => ({
            ...prev,
            club: {
              ...prev.club,
              payouts: {
                ...prev?.club?.payouts,
                balance: prev?.club?.payouts?.balance + rewardValue,
              },
            },
          }));
        }
      } catch (err) {
      } finally {
        setIsLoading(false);
      }
    },
    [status, userId, rewards]
  );

  const memoizedRewardCard = useCallback(
    (props: any) => <RewardCard data={props.data} key={props.index} claimReward={claimReward} />,
    [claimReward]
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
        <Loader style={{ margin: "0 auto", paddingTop: "15%" }} />
      )}
    </Stack>
  );
}
