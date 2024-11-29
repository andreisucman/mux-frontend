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
import classes from "./club-about.module.css";

export const runtime = "edge";

type Props = {
  children: React.ReactNode;
};

export default function ClubAboutLayout({ children }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { userDetails } = useContext(UserContext);
  const { youData, youTrackData } = useContext(ClubContext);
  const [showComponent, setShowComponent] = useState("followOverlay");

  const trackedUserId = searchParams.get("trackedUserId");
  const isRoutine = pathname.includes("/routine");

  const { subscriptions, club } = userDetails || {};
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

  const peekText = `Add the 👀 Peek License to view ${
    isRoutine ? "the routines" : "the details"
  } of the Club members.`;

  const followText = `Follow to see ${isRoutine ? "their routines" : "their details"}.`;

  return (
    <Stack className={`${classes.container} smallPage`}>
      <ClubHeader
        title={`Club ${isRoutine ? "routine" : "about"}`}
        hideTypeDropdown={!isRoutine}
        showReturn
      />
      <ClubProfilePreview
        type={trackedUserId ? "peek" : "you"}
        data={trackedUserId ? youTrackData : youData}
        isMini={true}
        showButtons
      />
      <Skeleton className="skeleton" visible={showComponent === "loading"}>
        {showComponent === "children" && children}
        {showComponent === "subscriptionOverlay" && <PeekOverlay description={peekText} />}
        {showComponent === "followOverlay" && (
          <FollowOverlay trackedUserId={trackedUserId} description={followText} />
        )}
        <ClubChatContainer disabled={showComponent !== "children"} />
      </Skeleton>
    </Stack>
  );
}
