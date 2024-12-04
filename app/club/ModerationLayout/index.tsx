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
  showChat?: boolean;
  showHeader?: boolean;
};

export default function ClubModerationLayout({ children, showChat, showHeader }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { userDetails } = useContext(UserContext);
  const { youData, youTrackData } = useContext(ClubContext);
  const [showComponent, setShowComponent] = useState("followOverlay");

  const followingUserId = searchParams.get("followingUserId");
  const isRoutine = pathname.includes("/routine");

  const { subscriptions, club } = userDetails || {};
  const { followingUserId: localFollowingUserId } = club || {};

  const { isSubscriptionActive } = checkSubscriptionActivity(["peek"], subscriptions);

  useEffect(() => {
    if (followingUserId) {
      if (isSubscriptionActive) {
        const follows = localFollowingUserId === followingUserId;
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
  }, [isSubscriptionActive, localFollowingUserId, followingUserId]);

  const followText = `Follow to see ${isRoutine ? "their routines" : "their details"}.`;

  return (
    <Stack className={`${classes.container} smallPage`}>
      {showHeader && <ClubHeader title={"Club"} hideTypeDropdown={!isRoutine} showReturn />}
      <Skeleton className={`skeleton ${classes.skeleton}`} visible={!youData || !youTrackData}>
        <ClubProfilePreview
          type={followingUserId ? "peek" : "you"}
          data={followingUserId ? youTrackData : youData}
          customStyles={{ flex: 0 }}
        />
        {showComponent === "children" && children}
        {showComponent === "subscriptionOverlay" && <PeekOverlay />}
        {showComponent === "followOverlay" && (
          <FollowOverlay followingUserId={followingUserId} description={followText} />
        )}
        {showChat && <ClubChatContainer disabled={showComponent !== "children"} />}
      </Skeleton>
    </Stack>
  );
}
