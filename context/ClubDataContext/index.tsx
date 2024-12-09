"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import callTheServer from "@/functions/callTheServer";
import { ClubUserType } from "@/types/global";
import { UserContext } from "../UserContext";

const defaultClubContext = {
  youTrackDataFetched: false,
  youTrackData: null as ClubUserType | null,
  setYouTrackData: (args: any) => {},
  youData: null as ClubUserType | null,
  setYouData: (args: any) => {},
};

export const ClubContext = createContext(defaultClubContext);

type Props = {
  children: React.ReactNode;
};

export default function ClubDataContextProvider({ children }: Props) {
  const searchParams = useSearchParams();
  const { userDetails } = useContext(UserContext);
  const [youTrackDataFetched, setYouTrackDataFetched] = useState(false);
  const [youTrackData, setYouTrackData] = useState<ClubUserType | null>(null);
  const [youData, setYouData] = useState<ClubUserType | null>(null);

  const { club, latestScores, latestScoresDifference, _id: userId } = userDetails || {};
  const { followingUserId: localFollowingUserId } = club || {};

  const followingUserId = searchParams.get("followingUserId") || localFollowingUserId;

  const getClubYouTrack = useCallback(async (followingUserId: string) => {
    try {
      const response = await callTheServer({
        endpoint: `getClubYouTrack/${followingUserId}`,
        method: "GET",
      });

      if (response.status === 200) {
        setYouTrackData(response.message);
        setYouTrackDataFetched(true);
      }
    } catch (err) {
      console.log("Error in getClubYouTrack: ", err);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;
    const { name, bio, avatar } = club || {};

    if (!name) return;

    const headCurrentScore = latestScores?.head?.overall || 0;
    const bodyCurrentScore = latestScores?.body?.overall || 0;
    const headTotalProgress = latestScoresDifference?.head?.overall || 0;
    const bodyTotalProgress = latestScoresDifference?.body?.overall || 0;

    const data: ClubUserType = {
      _id: userId as string,
      name: name,
      bio: bio!,
      avatar: avatar!,
      scores: {
        headCurrentScore,
        headTotalProgress,
        bodyCurrentScore,
        bodyTotalProgress,
      },
    };

    setYouData(data);
  }, [userId]);

  useEffect(() => {
    if (!followingUserId) return;
    getClubYouTrack(followingUserId);
  }, [followingUserId]);

  return (
    <ClubContext.Provider
      value={{
        youTrackDataFetched,
        youTrackData,
        setYouTrackData,
        youData,
        setYouData,
      }}
    >
      {children}
    </ClubContext.Provider>
  );
}
