"use client";

import React, { useCallback, useContext, useEffect } from "react";
import { Overlay, rem, Stack, Text, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import SkeletonWrapper from "@/app/SkeletonWrapper";
import GlowingButton from "@/components/GlowingButton";
import PageHeader from "@/components/PageHeader";
import { UserContext } from "@/context/UserContext";
import joinClub from "@/functions/joinClub";
import { formatDate } from "@/helpers/formatDate";
import openErrorModal from "@/helpers/openErrorModal";
import { UserDataType } from "@/types/global";
import JoinClubConfirmation from "./JoinClubConfirmation";
import SlidingImages from "./SlidingImages";
import classes from "./join.module.css";
import { useRouter } from "next/navigation";

export const runtime = "edge";

export default function ClubJoin() {
  const router = useRouter();
  const { userDetails, setUserDetails } = useContext(UserContext);
  const { club, canRejoinClubAfter } = userDetails || {};

  const cantJoinClubNow = new Date(canRejoinClubAfter || 0) > new Date();

  const handleJoinClub = useCallback(async () => {
    if (cantJoinClubNow) {
      const rejoinDate = formatDate({ date: new Date(canRejoinClubAfter || 0) });
      openErrorModal({ description: `You can rejoin the Club after ${rejoinDate}.` });
      return;
    }

    const message = await joinClub();

    if (message) {
      setUserDetails((prev: UserDataType) => ({ ...prev, ...message }));
      router.replace("/club");
      modals.closeAll();
    }
  }, [userDetails, router]);

  const onStart = useCallback(() => {
    modals.openContextModal({
      centered: true,
      modal: "general",
      size: "sm",
      classNames: { overlay: "overlay" },
      innerProps: <JoinClubConfirmation handleJoinClub={handleJoinClub} type="start" />,
      title: (
        <Title order={5} component={"p"}>
          When you join the Club
        </Title>
      ),
    });
  }, [userDetails, handleJoinClub]);

  useEffect(() => {
    if (!club || !club.isActive) return;
    router.replace("/club");
  }, [club]);

  return (
    <Stack className={`${classes.container} smallPage`}>
      <SkeletonWrapper>
        <PageHeader title="Join the Club" />
        <Stack className={classes.wrapper}>
          <Stack className={classes.announcement}>
            <Title order={2}>Welcome</Title>
            <Text ta="center">
              Club is a place where people share their routines, progress and feedback. Here you can
              see what worked for others and monetize your achievements.
            </Text>
            <GlowingButton
              text="Join the Club"
              disabled={club?.isActive}
              containerStyles={{ margin: "0.5rem auto 0", width: "100%", maxWidth: rem(300) }}
              onClick={onStart}
            />
          </Stack>
          <SlidingImages />
        </Stack>
      </SkeletonWrapper>
    </Stack>
  );
}
