"use client";

import React, { useContext, useEffect, useMemo, useState } from "react";
import { IconUserOff } from "@tabler/icons-react";
import { Skeleton, Stack } from "@mantine/core";
import OverlayWithText from "@/components/OverlayWithText";
import { ClubContext } from "@/context/ClubDataContext";
import { UserContext } from "@/context/UserContext";
import checkSubscriptionActivity from "@/helpers/checkSubscriptionActivity";
import ClubHeader from "../ClubHeader";
import ClubProfilePreview from "../ClubProfilePreview";
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
  userName?: string;
  pageType: "about" | "routines" | "diary" | "progress" | "proof" | "style" | "answers";
};

export default function ClubModerationLayout({ children, pageType, userName, showChat }: Props) {
  const { userDetails } = useContext(UserContext);
  const { youData, youFollowData, hasNewAboutQuestions, youFollowDataFetched } =
    useContext(ClubContext);
  const [showComponent, setShowComponent] = useState("loading");

  const { name, subscriptions, club } = userDetails || {};
  const { followingUserName } = club || {};

  const isSelf = name === userName;

  const { isSubscriptionActive } = checkSubscriptionActivity(["peek"], subscriptions);

  const clubResultTitles = useMemo(
    () => [
      { label: "Progress", value: `/club/progress${userName ? `/${userName}` : ""}` },
      { label: "Style", value: `/club/style${userName ? `/${userName}` : ""}` },
      { label: "Proof", value: `/club/proof${userName ? `/${userName}` : ""}` },
    ],
    [userName]
  );

  const headers: { [key: string]: React.ReactNode } = useMemo(
    () => ({
      style: (
        <ClubStyleHeader
          titles={clubResultTitles}
          isDisabled={showComponent !== "children"}
          userName={userName}
          showReturn
        />
      ),
      progress: (
        <ClubProgressHeader
          titles={clubResultTitles}
          isDisabled={showComponent !== "children"}
          userName={userName}
          showReturn
        />
      ),
      proof: (
        <ClubProofHeader
          isDisabled={showComponent !== "children"}
          titles={clubResultTitles}
          userName={userName}
          showReturn
        />
      ),
      about: <ClubHeader title={"Club"} pageType={pageType} showReturn hideTypeDropdown />,
      answers: <ClubHeader title={"Club"} pageType={pageType} showReturn hideTypeDropdown />,
      diary: (
        <ClubHeader
          title={"Club"}
          hideTypeDropdown={showComponent !== "children"}
          pageType={pageType}
          showReturn
        />
      ),
      routines: (
        <ClubHeader
          title={"Club"}
          hideTypeDropdown={showComponent !== "children"}
          pageType={pageType}
          showReturn
        />
      ),
    }),
    [showComponent]
  );

  const followText = `Follow to see ${pageType === "routines" ? "their routines" : "their details"}.`;

  useEffect(() => {
    if (!youFollowDataFetched) return;

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
    isSubscriptionActive,
    followingUserName,
    userName,
    isSelf,
    youFollowData,
    youFollowDataFetched,
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
              data={isSelf ? youData : youFollowData}
              hasNewAboutQuestions={hasNewAboutQuestions}
              customStyles={{ flex: 0 }}
            />
            {showComponent === "children" && children}
            {showComponent === "subscriptionOverlay" && <PeekOverlay />}
            {showComponent === "followOverlay" && (
              <FollowOverlay userName={userName as string} description={followText} />
            )}
            {showComponent === "children" && showChat && (
              <ClubChatContainer disabled={showComponent !== "children"} userName={userName} />
            )}
          </>
        )}
      </Skeleton>
    </Stack>
  );
}
