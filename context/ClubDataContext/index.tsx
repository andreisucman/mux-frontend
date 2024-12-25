"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useShallowEffect } from "@mantine/hooks";
import callTheServer from "@/functions/callTheServer";
import { ClubUserType } from "@/types/global";
import { UserContext } from "../UserContext";

const defaultClubContext = {
  youTrackDataFetched: false,
  youTrackData: null as ClubUserType | null | undefined,
  setYouTrackData: (args: any) => {},
  youData: null as ClubUserType | null,
  setYouData: (args: any) => {},
};

export const ClubContext = createContext(defaultClubContext);

type Props = {
  children: React.ReactNode;
};

export default function ClubDataContextProvider({ children }: Props) {
  const { userName } = useParams();
  const { userDetails } = useContext(UserContext);
  const [youTrackDataFetched, setYouTrackDataFetched] = useState(false);
  const [youTrackData, setYouTrackData] = useState<ClubUserType | null | undefined>();
  const [youData, setYouData] = useState<ClubUserType | null>(null);

  const { club, latestScores, latestScoresDifference, _id: userId } = userDetails || {};

  const fetchYouFollow = useCallback(async (userName?: string) => {
    try {
      const response = await callTheServer({
        endpoint: `getYouFollow${userName ? `/${userName}` : ""}`,
        method: "GET",
      });

      if (response.status === 200) {
        setYouTrackData(response.message);
      }
      setYouTrackDataFetched(true);
    } catch (err) {
      console.log("Error in fetchYouFollow: ", err);
    }
  }, []);

  useShallowEffect(() => {
    if (!userDetails) return;

    const { name, avatar } = userDetails || {};
    const { bio } = club || {};

    if (!name) return;

    const headCurrentScore = latestScores?.head?.overall || 0;
    const bodyCurrentScore = latestScores?.body?.overall || 0;
    const headTotalProgress = latestScoresDifference?.head?.overall || 0;
    const bodyTotalProgress = latestScoresDifference?.body?.overall || 0;

    const data: ClubUserType = {
      _id: userId as string,
      name,
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
  }, [userDetails]);

  useEffect(() => {
    fetchYouFollow(userName as string);
  }, [userName]);

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
