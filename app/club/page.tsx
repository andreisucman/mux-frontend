"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { IconCircleOff } from "@tabler/icons-react";
import { Group, Loader, Skeleton, Stack, Text, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import OverlayWithText from "@/components/OverlayWithText";
import PageHeader from "@/components/PageHeader";
import { ClubContext } from "@/context/ClubDataContext";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import { UserDataType } from "@/types/global";
import BalancePane from "./BalancePane";
import ClubProfilePreview from "./ClubProfilePreview";
import TrackYouRow from "./TrackYouRow";
import classes from "./club.module.css";

export const runtime = "edge";

export default function Club() {
  const { userDetails, setUserDetails } = useContext(UserContext);
  const { trackYouData, youTrackData, youData } = useContext(ClubContext);
  const [showSkeleton, setShowSkeleton] = useState(true);

  console.log("trackYouData", trackYouData);

  const { club } = userDetails || {};
  const { trackedUserId: localTrackedUserId, payouts } = club || {};
  const { rewardEarned, payoutsEnabled } = payouts || {};

  const trackUser = useCallback(async (trackedUserId: string) => {
    try {
      const response = await callTheServer({
        endpoint: "trackUser",
        method: "POST",
        body: { trackedUserId },
      });

      if (response.status === 200) {
        setUserDetails((prev: UserDataType) => ({ ...prev, ...response.message }));
      }
    } catch (err) {
      console.log("Error in trackUser: ", err);
    }
  }, []);

  const openTrackConfirm = useCallback(
    (trackedUserId: string) => {
      if (trackedUserId === localTrackedUserId) {
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
        onConfirm: () => trackUser(trackedUserId),
      });
    },
    [localTrackedUserId]
  );

  useEffect(() => {
    console.log(
      typeof rewardEarned !== "number",
      localTrackedUserId && !youTrackData,
      !trackYouData,
      !youData
    );
    if (typeof rewardEarned !== "number") return;
    if (localTrackedUserId && !youTrackData) return;
    if (!trackYouData) return;
    if (!youData) return;
    setShowSkeleton(false);
  }, [rewardEarned, localTrackedUserId, youTrackData, trackYouData, youData]);

  return (
    <Stack className={`${classes.container} smallPage`}>
      <PageHeader title={"Club profile"} showReturn hidePartDropdown hideTypeDropdown />
      <Skeleton className={`${classes.skeleton} skeleton`} visible={showSkeleton}>
        <Group className={classes.top}>
          <ClubProfilePreview data={youData} type="you" showButtons />
          {localTrackedUserId && <ClubProfilePreview data={youTrackData} type="peek" showButtons />}
        </Group>
        <BalancePane balance={rewardEarned} payoutsEnabled={payoutsEnabled} />
        <Stack className={classes.followYou}>
          <Text c="dimmed" size="sm">
            Follow you
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
                        disabled={record._id === localTrackedUserId}
                      />
                    ))}
                  </Stack>
                ) : (
                  <OverlayWithText text="No followers" icon={<IconCircleOff className="icon" />} />
                )}
              </>
            ) : (
              <Loader m="auto" />
            )}
          </Stack>
        </Stack>
      </Skeleton>
    </Stack>
  );
}
