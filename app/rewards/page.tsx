"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IconCircleOff } from "@tabler/icons-react";
import cn from "classnames";
import InfiniteScroll from "react-infinite-scroller";
import { Loader, rem, Stack, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import MasonryComponent from "@/components/MasonryComponent";
import OverlayWithText from "@/components/OverlayWithText";
import PageHeader from "@/components/PageHeader";
import { UserContext } from "@/context/UserContext";
import { AuthStateEnum } from "@/context/UserContext/types";
import callTheServer from "@/functions/callTheServer";
import openAuthModal from "@/helpers/openAuthModal";
import openErrorModal from "@/helpers/openErrorModal";
import openInfoModal from "@/helpers/openInfoModal";
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
  const { status, userDetails } = useContext(UserContext);
  const [rewards, setRewards] = useState<RewardCardType[]>();
  const [hasMore, setHasMore] = useState(false);

  const { _id: userId } = userDetails || {};

  const handleRedirect = (url: string) => {
    modals.closeAll();
    router.push(url);
  };

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

      const response = await callTheServer({
        endpoint: "claimReward",
        method: "POST",
        body: { rewardId },
      });

      if (response.status === 200) {
        if (response.error) {
          const style = {
            textDecoration: "underline",
            cursor: "pointer",
          };
          let description = <Text>{response.error}</Text>;
          if (response.error === "no club") {
            description = (
              <Text>
                You have to{" "}
                <span style={style} onClick={() => handleRedirect("/club/join")}>
                  join the Club
                </span>{" "}
                to claim rewards.
              </Text>
            );
          }
          if (response.error === "no bank") {
            description = (
              <Text>
                You have to add a bank account on your{" "}
                <span style={style} onClick={() => handleRedirect("/club")}>
                  Club profile page
                </span>{" "}
                to claim rewards.
              </Text>
            );
          }

          openErrorModal({
            description,
          });
          setIsLoading(false);
          return;
        }

        setRewards(response.message);
        openInfoModal({
          title: "✔️ Success!",
          description: (
            <Text>
              Reward transfer initiated. It should be added to your{" "}
              <span
                style={{ cursor: "pointer", textDecoration: "underline" }}
                onClick={() => {
                  router.push("/club");
                  modals.closeAll();
                }}
              >
                Club balance{" "}
              </span>
              within minutes.
            </Text>
          ),
        });
      }
      setIsLoading(false);
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
    <Stack className={cn(classes.container, "mediumPage")}>
      <PageHeader title="Rewards" />
      {rewards ? (
        <>
          {rewards.length > 0 ? (
            <InfiniteScroll
              loader={
                <Stack mb={rem(16)} key={0}>
                  <Loader
                    m="auto"
                    color="light-dark(var(--mantine-color-gray-4), var(--mantine-color-dark-4))"
                  />
                </Stack>
              }
              loadMore={() => fetchRewards(hasMore)}
              useWindow={true}
              hasMore={hasMore}
              pageStart={0}
            >
              <MasonryComponent
                maxColumnCount={2}
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
        <Loader
          m="0 auto"
          pt="20%"
          color="light-dark(var(--mantine-color-gray-4), var(--mantine-color-dark-4))"
        />
      )}
    </Stack>
  );
}
