"use client";

import React, { useContext, useEffect, useState } from "react";
import { Group, Skeleton, Stack, Text } from "@mantine/core";
import { ClubContext } from "@/context/ClubDataContext";
import { UserContext } from "@/context/UserContext";
import SkeletonWrapper from "../SkeletonWrapper";
import BalancePane from "./BalancePane";
import ClubProfileHeader from "./ClubProfileHeader";
import ClubProfilePreview from "./ClubProfilePreview";
import FollowersList from "./FollowersList";
import classes from "./club.module.css";

export const runtime = "edge";

export default function Club() {
  const { userDetails } = useContext(UserContext);
  const { youTrackData, youData } = useContext(ClubContext);
  const [showSkeleton, setShowSkeleton] = useState(true);

  const { club } = userDetails || {};
  const { followingUserId: localFollowingUserId, payouts } = club || {};
  const { rewardEarned, payoutsEnabled } = payouts || {};

  useEffect(() => {
    if (typeof rewardEarned !== "number") return;
    if (localFollowingUserId && !youTrackData) return;
    if (!youData) return;
    setShowSkeleton(false);
  }, [rewardEarned, localFollowingUserId, youTrackData, youData]);

  return (
    <Stack className={`${classes.container} smallPage`}>
      <SkeletonWrapper>
        <ClubProfileHeader />
        <Skeleton className={`${classes.skeleton} skeleton`} visible={showSkeleton}>
          <Group className={classes.top}>
            <ClubProfilePreview data={youData} type="you" showButtons />
            {localFollowingUserId && (
              <ClubProfilePreview data={youTrackData} type="peek" showButtons />
            )}
          </Group>
          <BalancePane balance={rewardEarned} payoutsEnabled={payoutsEnabled} />
          <Stack className={classes.followYou}>
            <Text c="dimmed" size="sm">
              Follow you
            </Text>
            <FollowersList />
          </Stack>
        </Skeleton>
      </SkeletonWrapper>
    </Stack>
  );
}
