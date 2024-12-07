"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { IconCircleOff } from "@tabler/icons-react";
import { Group, Loader, Skeleton, Stack, Text, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import OverlayWithText from "@/components/OverlayWithText";
import { ClubContext } from "@/context/ClubDataContext";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import { UserDataType } from "@/types/global";
import SkeletonWrapper from "../SkeletonWrapper";
import BalancePane from "./BalancePane";
import ClubProfileHeader from "./ClubProfileHeader";
import ClubProfilePreview from "./ClubProfilePreview";
import TrackYouRow from "./TrackYouRow";
import classes from "./club.module.css";

export const runtime = "edge";

export default function Club() {
  const { userDetails, setUserDetails } = useContext(UserContext);
  const { trackYouData, youTrackData, youData } = useContext(ClubContext);
  const [showSkeleton, setShowSkeleton] = useState(true);

  const { club } = userDetails || {};
  const { followingUserId: localFollowingUserId, payouts } = club || {};
  const { rewardEarned, payoutsEnabled } = payouts || {};

  const handleTrackUser = useCallback(async (followingUserId: string) => {
    try {
      const response = await callTheServer({
        endpoint: "trackUser",
        method: "POST",
        body: { followingUserId },
      });

      if (response.status === 200) {
        setUserDetails((prev: UserDataType) => ({ ...prev, ...response.message }));
      }
    } catch (err) {
      console.log("Error in trackUser: ", err);
    }
  }, []);

  const openTrackConfirm = useCallback(
    (followingUserId: string) => {
      if (followingUserId === localFollowingUserId) {
        return;
      }

      modals.openConfirmModal({
        title: (
          <Title order={5} component={"div"}>
            Please confirm
          </Title>
        ),
        centered: true,
        closeOnCancel: true,
        closeOnConfirm: true,
        children: <Text>This action will untrack the current user. Are you sure?</Text>,
        labels: { confirm: "Yes", cancel: "No" },
        onConfirm: () => handleTrackUser(followingUserId),
      });
    },
    [localFollowingUserId]
  );

  useEffect(() => {
    if (typeof rewardEarned !== "number") return;
    if (localFollowingUserId && !youTrackData) return;
    if (!trackYouData) return;
    if (!youData) return;
    setShowSkeleton(false);
  }, [rewardEarned, localFollowingUserId, youTrackData, trackYouData, youData]);

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
              Peek you
            </Text>
            <Stack className={classes.followYouScrollContainer}>
              {trackYouData ? (
                <>
                  {trackYouData.length > 0 ? (
                    <Stack className={classes.followYouScrollWrapper}>
                      {trackYouData.map((record) => (
                        <TrackYouRow
                          key={record._id}
                          {...record}
                          onClick={(userId: string) => openTrackConfirm(userId)}
                          disabled={record._id === localFollowingUserId}
                        />
                      ))}
                    </Stack>
                  ) : (
                    <OverlayWithText text="No peekers" icon={<IconCircleOff className="icon" />} />
                  )}
                </>
              ) : (
                <Loader m="auto" />
              )}
            </Stack>
          </Stack>
        </Skeleton>
      </SkeletonWrapper>
    </Stack>
  );
}
