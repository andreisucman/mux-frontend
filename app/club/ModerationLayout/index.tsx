"use client";

import React, { useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconUserOff } from "@tabler/icons-react";
import { Skeleton, Stack } from "@mantine/core";
import OverlayWithText from "@/components/OverlayWithText";
import { ClubContext } from "@/context/ClubDataContext";
import { UserContext } from "@/context/UserContext";
import checkSubscriptionActivity from "@/helpers/checkSubscriptionActivity";
import ClubProfilePreview from "../ClubProfilePreview";
import FollowOverlay from "./FollowOverlay";
import PeekOverlay from "./PeekOverlay";
import classes from "./ClubModerationLayout.module.css";

export const runtime = "edge";

type Props = {
  children: React.ReactNode;
  header: React.ReactNode;
  showChat?: boolean;
  showHeader?: boolean;
  userName?: string;
  pageType: "about" | "routines" | "diary" | "progress" | "proof" | "answers";
};

export default function ClubModerationLayout({ children, header, pageType, userName }: Props) {
  const searchParams = useSearchParams();
  const { userDetails } = useContext(UserContext);
  const { youData, youFollowData, youFollowDataFetched } = useContext(ClubContext);
  const [showComponent, setShowComponent] = useState("loading");

  const code = searchParams.get("code");

  const { name, subscriptions, club } = userDetails || {};
  const { followingUserName } = club || {};

  const isSelf = name === userName;

  const { isSubscriptionActive } = checkSubscriptionActivity(["peek"], subscriptions);

  const followText = `Follow ${userName} to see ${pageType === "routines" ? "their routines" : "their details"}.`;

  useEffect(() => {
    if (!youFollowDataFetched || code) return;

    if (youFollowData === null || !userName) {
      setShowComponent("userNotFound");
      return;
    }

    if (isSelf) {
      setShowComponent("children");
    } else {
      if (isSubscriptionActive) {
        const follows = followingUserName === userName;
        if (follows) {
          setShowComponent("children");
        } else {
          setShowComponent("followOverlay");
        }
      } else {
        setShowComponent("subscriptionOverlay");
      }
    }
  }, [
    code,
    isSelf,
    followingUserName,
    userDetails,
    youFollowData,
    isSubscriptionActive,
    youFollowDataFetched,
  ]);

  const showCollapseKey = isSelf ? name : followingUserName;

  return (
    <Stack className={`${classes.container} smallPage`}>
      {header}
      <Skeleton
        className={`skeleton ${classes.skeleton}`}
        visible={showComponent === "loading" || !!code}
      >
        {showComponent === "userNotFound" ? (
          <OverlayWithText text="User not found" icon={<IconUserOff className="icon" />} />
        ) : (
          <>
            <ClubProfilePreview
              type={isSelf ? "you" : "member"}
              data={isSelf ? youData : youFollowData}
              showCollapseKey={showCollapseKey || ""}
              customStyles={{ flex: 0 }}
            />
            {showComponent === "children" && children}
            {showComponent === "subscriptionOverlay" && <PeekOverlay userName={userName} />}
            {showComponent === "followOverlay" && (
              <FollowOverlay userName={userName as string} description={followText} />
            )}
          </>
        )}
      </Skeleton>
    </Stack>
  );
}
