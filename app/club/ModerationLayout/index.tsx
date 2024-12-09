"use client";

import React, { useContext, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { IconUserOff } from "@tabler/icons-react";
import { Skeleton, Stack } from "@mantine/core";
import OverlayWithText from "@/components/OverlayWithText";
import { ClubContext } from "@/context/ClubDataContext";
import { UserContext } from "@/context/UserContext";
import checkSubscriptionActivity from "@/helpers/checkSubscriptionActivity";
import ClubProfilePreview from "../ClubProfilePreview";
import ClubChatContainer from "./ClubChatContainer";
import FollowOverlay from "./FollowOverlay";
import PeekOverlay from "./PeekOverlay";
import classes from "./ClubModerationLayout.module.css";

export const runtime = "edge";

type Props = {
  pageHeader: React.ReactNode;
  children: React.ReactNode;
  showChat?: boolean;
  showHeader?: boolean;
};

export default function ClubModerationLayout({ children, showChat, pageHeader }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { userDetails } = useContext(UserContext);
  const clubContextData = useContext(ClubContext);
  const { youData, youTrackData } = clubContextData;

  const [showComponent, setShowComponent] = useState("followOverlay");

  const followingUserId = searchParams.get("followingUserId");
  const isRoutine = pathname.includes("/club/routine");

  const { subscriptions, club } = userDetails || {};
  const { followingUserId: localFollowingUserId } = club || {};

  const { isSubscriptionActive } = checkSubscriptionActivity(["peek"], subscriptions);

  useEffect(() => {
    if (!clubContextData) return;

    if (followingUserId) {
      if (!youTrackData) {
        setShowComponent("userNotFound");
        return;
      }
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
  }, [isSubscriptionActive, localFollowingUserId, followingUserId, youTrackData]);

  const followText = `Follow to see ${isRoutine ? "their routines" : "their details"}.`;

  return (
    <Stack className={`${classes.container} smallPage`}>
      {pageHeader}
      <Skeleton className={`skeleton ${classes.skeleton}`} visible={!youData && !youTrackData}>
        {showComponent === "userNotFound" ? (
          <OverlayWithText text="User not found" icon={<IconUserOff className="icon" />} />
        ) : (
          <>
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
          </>
        )}
      </Skeleton>
    </Stack>
  );
}
