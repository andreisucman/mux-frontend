"use client";

import React, { useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { IconUserOff } from "@tabler/icons-react";
import { SegmentedControl, Skeleton, Stack } from "@mantine/core";
import OverlayWithText from "@/components/OverlayWithText";
import { ClubContext } from "@/context/ClubDataContext";
import { UserContext } from "@/context/UserContext";
import { diarySortItems, routineSortItems } from "@/data/sortItems";
import checkSubscriptionActivity from "@/helpers/checkSubscriptionActivity";
import { useRouter } from "@/helpers/custom-router";
import modifyQuery from "@/helpers/modifyQuery";
import { routineSegments } from "../[userName]/data";
import ClubHeader from "../ClubHeader";
import ClubProfilePreview from "../ClubProfilePreview";
import ClubProgressHeader from "../progress/ClubProgressHeader";
import ClubProofHeader from "../proof/ClubProofHeader";
import ClubStyleHeader from "../style/ClubStyleHeader";
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

export default function ClubModerationLayout({ children, pageType, userName }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { userDetails } = useContext(UserContext);
  const { youData, youFollowData, hasNewAboutQuestions, youFollowDataFetched } =
    useContext(ClubContext);
  const [showComponent, setShowComponent] = useState("loading");

  const code = searchParams.get("code");
  const routineStatus = searchParams.get("status") || "active";

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

  const handleChangeSegment = (segmentName: string) => {
    const query = modifyQuery({
      params: [{ name: "status", value: segmentName, action: "replace" }],
    });

    router.replace(`${pathname}${query ? `?${query}` : ""}`);
  };

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
          hideTypeDropdown={true}
          pageType={pageType}
          sortItems={diarySortItems}
          showReturn
        />
      ),
      routines: (
        <ClubHeader
          title={"Club"}
          hideTypeDropdown={showComponent !== "children"}
          pageType={pageType}
          sortItems={routineSortItems}
          children={
            showComponent === "children" && (
              <SegmentedControl
                size="xs"
                data={routineSegments}
                value={routineStatus}
                onChange={handleChangeSegment}
              />
            )
          }
          showReturn
        />
      ),
    }),
    [showComponent, routineStatus]
  );

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

  const showCollapseKey = `${pathname}-${isSelf ? name : followingUserName}`;

  return (
    <Stack className={`${classes.container} smallPage`}>
      {headers[pageType]}
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
              hasNewAboutQuestions={hasNewAboutQuestions}
              showCollapseKey={showCollapseKey}
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
