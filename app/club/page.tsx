"use client";

import React, { useCallback, useContext } from "react";
import { Button, Group, rem, Stack, Text, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import PageHeader from "@/components/PageHeader";
import { ClubContext } from "@/context/ClubDataContext";
import { UserContext } from "@/context/UserContext";
import SkeletonWrapper from "../SkeletonWrapper";
import BalancePane from "./BalancePane";
import ClubProfilePreview from "./ClubProfilePreview";
import FollowersList from "./FollowersList";
import FollowHistoryModalContent from "./FollowHistoryModalContent";
import classes from "./club.module.css";

export const runtime = "edge";

export default function Club() {
  const { userDetails } = useContext(UserContext);
  const { youFollowData, youData, youFollowDataFetched } = useContext(ClubContext);

  const { club, name } = userDetails || {};
  const { followingUserName, totalFollowers } = club || {};

  const openFollowHistory = useCallback(() => {
    modals.openContextModal({
      modal: "general",
      title: (
        <Title order={5} component={"p"}>
          Follow history
        </Title>
      ),
      centered: true,
      size: "sm",
      styles: { body: { minHeight: rem(80) } },
      innerProps: <FollowHistoryModalContent />,
    });
  }, []);

  return (
    <Stack className={`${classes.container} smallPage`}>
      <SkeletonWrapper show={!youFollowDataFetched}>
        <PageHeader
          title="Club"
          children={
            <Button onClick={openFollowHistory} size="compact-sm" variant="default">
              Follow history
            </Button>
          }
          showReturn
        />
        <Group className={classes.top}>
          {name && (
            <ClubProfilePreview data={youData} type="you" showCollapseKey={name} showButtons />
          )}
          {followingUserName && (
            <ClubProfilePreview
              data={youFollowData}
              type="member"
              showCollapseKey={followingUserName}
              showButtons
            />
          )}
        </Group>
        <BalancePane />
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
