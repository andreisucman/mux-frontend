"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import callTheServer from "@/functions/callTheServer";
import { ClubUserType } from "@/types/global";
import { UserContext } from "../UserContext";

const defaultClubContext = {
  youTrackData: null as ClubUserType | null,
  setYouTrackData: (args: any) => {},
  trackYouData: null as ClubUserType[] | null,
  setTrackYouData: (args: any) => {},
  youData: null as ClubUserType | null,
  setYouData: (args: any) => {},
};

export const ClubContext = createContext(defaultClubContext);

type Props = {
  children: React.ReactNode;
};

export default function ClubDataContextProvider({ children }: Props) {
  const searchParams = useSearchParams();
  const { status, userDetails } = useContext(UserContext);
  const [youTrackData, setYouTrackData] = useState<ClubUserType | null>(null);
  const [trackYouData, setTrackYouData] = useState<ClubUserType[] | null>(null);
  const [youData, setYouData] = useState<ClubUserType | null>(null);

  const { club, latestScores, latestScoresDifference, _id: userId } = userDetails || {};
  const { trackedUserId: localTrackedUserId } = club || {};

  const trackedUserId = searchParams.get("trackedUserId") || localTrackedUserId;

  const getClubYouTrack = useCallback(async (trackedUserId: string) => {
    try {
      const response = await callTheServer({
        endpoint: `getClubYouTrack/${trackedUserId}`,
        method: "GET",
      });

      if (response.status === 200) {
        setYouTrackData(response.message);
      }
    } catch (err) {
      console.log("Error in getClubYouTrack: ", err);
    }
  }, []);

  const getClubTrackYou = useCallback(async () => {
    try {
      const response = await callTheServer({
        endpoint: "getClubTrackYou",
        method: "GET",
      });

      if (response.status === 200) {
        setTrackYouData(response.message);
      }
    } catch (err) {
      console.log("Error in getClubTrackYou: ", err);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;
    const { name, bio, avatar } = club || {};

    if (!name || !bio || !avatar) return;

    const headCurrentScore = latestScores?.head?.overall || 0;
    const bodyCurrentScore = latestScores?.body?.overall || 0;
    const headTotalProgress = latestScoresDifference?.head?.overall || 0;
    const bodyTotalProgress = latestScoresDifference?.body?.overall || 0;

    const data: ClubUserType = {
      _id: userId as string,
      name: name,
      bio: bio,
      avatar: avatar,
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
    if (!trackedUserId) return;
    getClubYouTrack(trackedUserId);
  }, [trackedUserId]);

  console.log("statu", status);

  useEffect(() => {
    getClubTrackYou();
  }, [status]);

  // useSWR(status, getClubTrackYou);

  return (
    <ClubContext.Provider
      value={{
        youTrackData,
        setYouTrackData,
        trackYouData,
        setTrackYouData,
        youData,
        setYouData,
      }}
    >
      {children}
    </ClubContext.Provider>
  );
}
