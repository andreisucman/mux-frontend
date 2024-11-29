"use client";

import React, { useContext, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Skeleton, Stack } from "@mantine/core";
import { ClubContext } from "@/context/ClubDataContext";
import { UserContext } from "@/context/UserContext";
import checkSubscriptionActivity from "@/helpers/checkSubscriptionActivity";
import ClubHeader from "../ClubHeader";
import ClubProfilePreview from "../ClubProfilePreview";
import ClubChatContainer from "./ClubChatContainer";
import FollowOverlay from "./FollowOverlay";
import PeekOverlay from "./PeekOverlay";
import classes from "./ClubModerationLayout.module.css";

export const runtime = "edge";

type Props = {
  children: React.ReactNode;
};

export default function ClubModerationLayout({ children }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { userDetails } = useContext(UserContext);
  const { youData, youTrackData } = useContext(ClubContext);
  const [showComponent, setShowComponent] = useState("followOverlay");

  const trackedUserId = searchParams.get("trackedUserId");
  const isRoutine = pathname.includes("/routine");

  const { _id: userId, subscriptions, club } = userDetails || {};
  const { trackedUserId: localTrackedUserId } = club || {};

  const { isSubscriptionActive } = checkSubscriptionActivity(["peek"], subscriptions);

  useEffect(() => {
    if (trackedUserId) {
      if (isSubscriptionActive) {
        const follows = localTrackedUserId === trackedUserId;
        if (follows) {
          setShowComponent("children");
        } else {
          setShowComponent("followOverlay");
        }
      } else {
        setShowComponent("subscriptionOverlay");
      }
    } else {
      setShowComponent("children");
    }
  }, [isSubscriptionActive, localTrackedUserId, trackedUserId]);

  const followText = `Follow to see ${isRoutine ? "their routines" : "their details"}.`;

  return (
    <Stack className={`${classes.container} smallPage`}>
      <ClubHeader title={"Club"} hideTypeDropdown={!isRoutine} showReturn />
      <Skeleton className={`skeleton ${classes.skeleton}`} visible={!youData || !youTrackData}>
        <ClubProfilePreview
          type={trackedUserId ? "peek" : "you"}
          data={trackedUserId ? youTrackData : youData}
          customStyles={{ flex: 0 }}
          showButtons
        />
        {showComponent === "children" && children}
        {showComponent === "subscriptionOverlay" && <PeekOverlay />}
        {showComponent === "followOverlay" && (
          <FollowOverlay trackedUserId={trackedUserId} description={followText} />
        )}
        <ClubChatContainer disabled={showComponent !== "children"} />
      </Skeleton>
    </Stack>
  );
}
