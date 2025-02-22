"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { useShallowEffect } from "@mantine/hooks";
import callTheServer from "@/functions/callTheServer";
import fetchQuestions from "@/functions/fetchQuestions";
import { ClubUserType } from "@/types/global";
import { UserContext } from "../UserContext";
import { AuthStateEnum } from "../UserContext/types";

const defaultClubContext = {
  hasAboutAnswers: undefined,
  setHasAboutAnswers: (args: any) => {},
  hasNewAboutQuestions: undefined,
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
  const pathname = usePathname();
  const params = useParams();
  const userName = Array.isArray(params?.userName) ? params.userName?.[0] : params.userName;

  const { status, userDetails } = useContext(UserContext);
  const [youFollowDataFetched, setYouTrackDataFetched] = useState(false);
  const [youFollowData, setYouFollowData] = useState<ClubUserType | null | undefined>();
  const [youData, setYouData] = useState<ClubUserType | null>(null);
  const [hasNewAboutQuestions, setHasNewAboutQuestions] = useState();
  const [hasAboutAnswers, setHasAboutAnswers] = useState();

  const { club, name, latestScores, latestScoresDifference, _id: userId } = userDetails || {};
  const { followingUserName } = club || {};

  const onAboutPage = pathname === `/club/${name}`;

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
    } catch (err) {}
  }, []);

  useShallowEffect(() => {
    if (!userDetails) return;

    const { name, avatar } = userDetails || {};
    const { bio } = club || {};

    if (!name) return;

    const currentScore = latestScores?.currentScore || 0;
    const totalProgress = latestScoresDifference?.overall || 0;

    const data: ClubUserType = {
      _id: userId as string,
      name,
      bio: bio!,
      avatar: avatar!,
      scores: {
        currentScore,
        totalProgress,
      },
    };

    setYouData(data);
  }, [userDetails]);

  useEffect(() => {
    fetchYouFollow((userName || followingUserName) as string);
  }, [userName, followingUserName]);

  useEffect(() => {
    if (status !== AuthStateEnum.AUTHENTICATED) return;

    fetchQuestions({ userName, onlyCheck: true }).then((response) => {
      const { hasAnswers, hasNewQuestions } = response || {};
      setHasAboutAnswers(hasAnswers);
      setHasNewAboutQuestions(hasNewQuestions);
    });
  }, [userName, club, onAboutPage, status]);

  return (
    <ClubContext.Provider
      value={{
        youData,
        setYouData,
        youFollowData,
        setYouFollowData,
        youFollowDataFetched,
        hasAboutAnswers,
        setHasAboutAnswers,
        hasNewAboutQuestions,
        setHasNewAboutQuestions,
      }}
    >
      {children}
    </ClubContext.Provider>
  );
}
