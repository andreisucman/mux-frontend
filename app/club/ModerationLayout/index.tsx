"use client";

import React, { useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { IconUserOff } from "@tabler/icons-react";
import { Skeleton, Stack } from "@mantine/core";
import ProgressHeader from "@/app/results/ProgressHeader";
import ProofHeader from "@/app/results/proof/ProofHeader";
import StyleHeader from "@/app/results/style/StyleHeader";
import OverlayWithText from "@/components/OverlayWithText";
import { ClubContext } from "@/context/ClubDataContext";
import { UserContext } from "@/context/UserContext";
import checkSubscriptionActivity from "@/helpers/checkSubscriptionActivity";
import ClubProfilePreview from "../ClubProfilePreview";
import { clubResultTitles } from "../clubResultTitles";
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

  const followingUserId = searchParams.get("followingUserId");

  const pathnameParts = pathname.split("/");
  const pageType = pathnameParts[pathnameParts.length - 1];

  const { subscriptions, club } = userDetails || {};
  const { followingUserId: localFollowingUserId } = club || {};

  const { isSubscriptionActive } = checkSubscriptionActivity(["peek"], subscriptions);

  const titles: { [key: string]: React.ReactNode } = useMemo(
    () => ({
      style: (
        <StyleHeader
          titles={clubResultTitles}
          isDisabled={showComponent !== "children"}
          showReturn
        />
      ),
      progress: (
        <ProgressHeader
          titles={clubResultTitles}
          isDisabled={showComponent !== "children"}
          showReturn
        />
      ),
      proof: <ProofHeader showReturn titles={clubResultTitles} />,
    }),
    [showComponent]
  );

  useEffect(() => {
    if (!youTrackData && youTrackDataFetched) {
      setShowComponent("userNotFound");
      return;
    }

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
  }, [
    isSubscriptionActive,
    localFollowingUserId,
    followingUserId,
    youTrackData,
    youTrackDataFetched,
  ]);

  const followText = `Follow to see ${pageType === "routine" ? "their routines" : "their details"}.`;
  const previewData = followingUserId ? youTrackData : youData;

  return (
    <Stack className={`${classes.container} smallPage`}>
      {titles[pageType]}
      <Skeleton
        className={`skeleton ${classes.skeleton}`}
        visible={showComponent === "loading" || !previewData}
      >
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
