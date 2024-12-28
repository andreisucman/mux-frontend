"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useShallowEffect } from "@mantine/hooks";
import callTheServer from "@/functions/callTheServer";
import fetchQuestions from "@/functions/fetchQuestions";
import { ClubUserType } from "@/types/global";
import { UserContext } from "../UserContext";

const defaultClubContext = {
  hasNewAboutQuestions: false,
  setHasNewAboutQuestions: (args: any) => {},
  youFollowDataFetched: false,
  youFollowData: null as ClubUserType | null | undefined,
  setYouFollowData: (args: any) => {},
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
  const [youFollowDataFetched, setYouTrackDataFetched] = useState(false);
  const [youFollowData, setYouFollowData] = useState<ClubUserType | null | undefined>();
  const [youData, setYouData] = useState<ClubUserType | null>(null);
  const [hasNewAboutQuestions, setHasNewAboutQuestions] = useState(false);

  const { club, latestScores, latestScoresDifference, _id: userId } = userDetails || {};

  const fetchYouFollow = useCallback(async (userName?: string) => {
    try {
      const response = await callTheServer({
        endpoint: `getYouFollow${userName ? `/${userName}` : ""}`,
        method: "GET",
      });

      if (response.status === 200) {
        setYouFollowData(response.message);
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

  useEffect(() => {
    fetchQuestions({ userName, onlyCheck: true, setHasQuestions: setHasNewAboutQuestions });
  }, [userName]);

  return (
    <ClubContext.Provider
      value={{
        youData,
        setYouData,
        youFollowData,
        setYouFollowData,
        youFollowDataFetched,
        hasNewAboutQuestions,
        setHasNewAboutQuestions,
      }}
    >
      {children}
    </ClubContext.Provider>
  );
}
