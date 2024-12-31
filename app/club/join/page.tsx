"use client";

import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { IconTargetArrow } from "@tabler/icons-react";
import { rem, Stack, Table, Text, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import SkeletonWrapper from "@/app/SkeletonWrapper";
import GlowingButton from "@/components/GlowingButton";
import PageHeader from "@/components/PageHeader";
import TosCheckbox from "@/components/TosCheckbox";
import { UserContext } from "@/context/UserContext";
import joinClub from "@/functions/joinClub";
import { useRouter } from "@/helpers/custom-router";
import { formatDate } from "@/helpers/formatDate";
import openErrorModal from "@/helpers/openErrorModal";
import openLegalBody from "@/helpers/openLegalBody";
import Confirmation from "./Confirmation";
import classes from "./join.module.css";

export const runtime = "edge";

const tableData = {
  caption: "From their monthly subscription payment",
  head: ["Event", "Reward"],
  body: [["Follower", "50%"]],
};

export default function ClubJoin() {
  const router = useRouter();
  const [tosAccepted, setTosAccepted] = useState(false);
  const [highlightTos, setHighlightTos] = useState(false);
  const { userDetails, setUserDetails } = useContext(UserContext);
  const { club, canRejoinClubAfter } = userDetails || {};
  const { payouts } = club || {};

  const cantJoinClubNow = new Date(canRejoinClubAfter || 0) > new Date();

  const handleJoinClub = useCallback(async () => {
    if (cantJoinClubNow) {
      const rejoinDate = formatDate({ date: new Date(canRejoinClubAfter || 0) });
      openErrorModal({ description: `You can rejoin the Club after ${rejoinDate}.` });
      return;
    }

    joinClub({
      router,
      userDetails,
      setUserDetails,
      redirectPath: "/club/admission",
      closeModal: true,
    });
  }, [userDetails]);

  const onStart = useCallback(() => {
    if (!tosAccepted) {
      setHighlightTos(true);

      const tId = setTimeout(() => {
        setHighlightTos(false);
        clearTimeout(tId);
      }, 6000);
      return;
    }

    modals.openContextModal({
      centered: true,
      modal: "general",
      innerProps: <Confirmation handleJoinClub={handleJoinClub} />,
      title: (
        <Title order={5} component={"p"}>
          When you join the Club
        </Title>
      ),
    });
  }, [tosAccepted, userDetails, handleJoinClub]);

  const checkboxLabel = useMemo(
    () => (
      <Text lineClamp={2} size="sm">
        I have read, understood and accept the{" "}
        <span
          onClickCapture={() => openLegalBody("club")}
          style={{ cursor: "pointer", fontWeight: 600 }}
        >{`Club's Terms of Service`}</span>
      </Text>
    ),
    []
  );

  useEffect(() => {
    if (!club) return;

    if (payouts?.detailsSubmitted) {
      router.replace("/club");
    } else {
      router.replace("/club/admission");
    }
  }, [club]);

  return (
    <Stack className={`${classes.container} smallPage`}>
      <SkeletonWrapper>
        <PageHeader title="Join the Club" hidePartDropdown hideTypeDropdown showReturn />
        <Stack className={classes.wrapper}>
          <Stack className={classes.announcement}>
            <Title order={2}>Welcome</Title>
            <Text ta="center">
              When you join the Club you let other people see your progress to get inspired.
            </Text>
            <Text ta="center">You are rewarded for every user who follows you.</Text>
          </Stack>
          <Table data={tableData} ta={"center"} classNames={{ th: classes.th, td: classes.td }} />
          <TosCheckbox
            label={checkboxLabel}
            highlightTos={highlightTos}
            setHighlightTos={setHighlightTos}
            setTosAccepted={setTosAccepted}
            tosAccepted={tosAccepted}
          />
          <GlowingButton
            text="Join the Club"
            disabled={!!club}
            icon={<IconTargetArrow className="icon" style={{ marginRight: rem(6) }} />}
            containerStyles={{ margin: "auto" }}
            onClick={onStart}
          />
        </Stack>
      </SkeletonWrapper>
    </Stack>
  );
}
