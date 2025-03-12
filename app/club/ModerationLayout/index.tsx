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
import PeekOverlay from "./PeekOverlay";
import classes from "./ClubModerationLayout.module.css";

export const runtime = "edge";

type Props = {
  children: React.ReactNode;
  header: React.ReactNode;
  showChat?: boolean;
  showHeader?: boolean;
  userName?: string;
};

export default function ClubModerationLayout({ children, header, userName }: Props) {
  const searchParams = useSearchParams();
  const { userDetails } = useContext(UserContext);
  const { youData, youFollowData, youFollowDataFetched } = useContext(ClubContext);
  const [showComponent, setShowComponent] = useState("loading");

  const code = searchParams.get("code");

  const { name, subscriptions, club } = userDetails || {};
  const { followingUserName } = club || {};

  const isSelf = name === userName;

  const { isSubscriptionActive } = checkSubscriptionActivity(["peek"], subscriptions);

  useEffect(() => {
    if (!youFollowDataFetched || code) return;

    if (youFollowData === null || !userName) {
      setShowComponent("userNotFound");
      return;
    }

    if (isSelf) {
      setShowComponent("children");
    } else {
      setShowComponent("subscriptionOverlay");
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
          </>
        )}
      </Skeleton>
    </Stack>
  );
}
