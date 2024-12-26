"use client";

import React, { useContext } from "react";
import { Group, Stack, Text } from "@mantine/core";
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
  const { youTrackData, youData, youTrackDataFetched } = useContext(ClubContext);

  const { club } = userDetails || {};
  const { followingUserName, payouts, totalFollowers } = club || {};
  const { balance, payoutsEnabled } = payouts || {};

  return (
    <Stack className={`${classes.container} smallPage`}>
      <SkeletonWrapper show={!youTrackDataFetched}>
        <ClubProfileHeader />
        <Group className={classes.top}>
          <ClubProfilePreview data={youData} type="you" showButtons />
          {followingUserName && (
            <ClubProfilePreview data={youTrackData} type="member" showButtons />
          )}
        </Group>
        <BalancePane balance={balance} payoutsEnabled={payoutsEnabled} />
        <Stack className={classes.followYou}>
          <Text c="dimmed" size="sm">
            Follow you ({totalFollowers || 0})
          </Text>
          <FollowersList />
        </Stack>
      </SkeletonWrapper>
    </Stack>
  );
}
