"use client";

import React, { useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { IconUserOff } from "@tabler/icons-react";
import { Skeleton, Stack } from "@mantine/core";
import OverlayWithText from "@/components/OverlayWithText";
import { ClubContext } from "@/context/ClubDataContext";
import { UserContext } from "@/context/UserContext";
import checkSubscriptionActivity from "@/helpers/checkSubscriptionActivity";
import ClubHeader from "../ClubHeader";
import ClubProfilePreview from "../ClubProfilePreview";
import { clubResultTitles } from "../clubResultTitles";
import ClubProgressHeader from "../progress/ClubProgressHeader";
import ClubProofHeader from "../proof/ClubProofHeader";
import ClubStyleHeader from "../style/ClubStyleHeader";
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

export default function ClubModerationLayout({ children, showChat }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { userDetails } = useContext(UserContext);
  const { youData, youTrackData, youTrackDataFetched } = useContext(ClubContext);
  const [showComponent, setShowComponent] = useState("loading");

  const pathnameParts = pathname.split("/");
  const pageType = pathnameParts[pathnameParts.length - 1];

  const { _id: userId, subscriptions, club } = userDetails || {};
  const { followingUserId: localFollowingUserId } = club || {};

  const followingUserId = searchParams.get("id");
  const isSelf = userId === followingUserId;

  const { isSubscriptionActive } = checkSubscriptionActivity(["peek"], subscriptions);

  const headers: { [key: string]: React.ReactNode } = useMemo(
    () => ({
      style: (
        <ClubStyleHeader
          titles={clubResultTitles}
          isDisabled={showComponent !== "children"}
          showReturn
        />
      ),
      progress: (
        <ClubProgressHeader
          titles={clubResultTitles}
          isDisabled={showComponent !== "children"}
          showReturn
        />
      ),
      proof: (
        <ClubProofHeader
          showReturn
          isDisabled={showComponent !== "children"}
          titles={clubResultTitles}
        />
      ),
      about: <ClubHeader title={"Club"} hideTypeDropdown={true} showReturn />,
      diary: (
        <ClubHeader title={"Club"} hideTypeDropdown={showComponent !== "children"} showReturn />
      ),
      routines: (
        <ClubHeader title={"Club"} showReturn hideTypeDropdown={showComponent !== "children"} />
      ),
    }),
    [showComponent]
  );

  const followText = `Follow to see ${pageType === "routine" ? "their routines" : "their details"}.`;

  useEffect(() => {
    if (!youTrackDataFetched) return;

    if (youTrackData === null || !followingUserId) {
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
  }, [
    isSubscriptionActive,
    localFollowingUserId,
    followingUserId,
    youTrackData,
    youTrackDataFetched,
  ]);

  return (
    <Stack className={`${classes.container} smallPage`}>
      {headers[pageType]}
      <Skeleton className={`skeleton ${classes.skeleton}`} visible={showComponent === "loading"}>
        {showComponent === "userNotFound" ? (
          <OverlayWithText text="User not found" icon={<IconUserOff className="icon" />} />
        ) : (
          <>
            <ClubProfilePreview
              type={isSelf ? "you" : "member"}
              data={isSelf ? youData : youTrackData}
              customStyles={{ flex: 0 }}
            />
            {showComponent === "children" && children}
            {showComponent === "subscriptionOverlay" && <PeekOverlay />}
            {showComponent === "followOverlay" && (
              <FollowOverlay followingUserId={followingUserId as string} description={followText} />
            )}
            {showComponent === "children" && showChat && (
              <ClubChatContainer disabled={showComponent !== "children"} />
            )}
          </>
        )}
      </Skeleton>
    </Stack>
  );
}
