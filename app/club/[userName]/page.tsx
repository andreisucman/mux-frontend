"use client";

import React, { use, useCallback, useContext, useEffect, useState } from "react";
import { Skeleton } from "@mantine/core";
import { ClubContext } from "@/context/ClubDataContext";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import uploadToSpaces from "@/functions/uploadToSpaces";
import { UserDataType } from "@/types/global";
import ClubModerationLayout from "../ModerationLayout";
import DisplayClubAbout from "./DisplayClubAbout";
import EditClubAbout from "./EditClubAbout";
import QuestionsCarousel from "./QuestionsCarousel";
import { SubmitAboutResponseType } from "./types";
import classes from "./about.module.css";

export const runtime = "edge";

type BioDataType = {
  philosophy: string;
  style: string;
  tips: string;
  about: string;
};

type Props = {
  params: Promise<{ userName: string }>;
};

export default function ClubAbout(props: Props) {
  const params = use(props.params);
  const { youTrackData, youData, setYouData } = useContext(ClubContext);
  const { userDetails, setUserDetails } = useContext(UserContext);
  const [showSkeleton, setShowSkeleton] = useState(true);

  const { userName } = params;

  const { name, club } = userDetails || {};
  const { bio } = club || {};
  const { questions } = bio || {};

  const isSelf = name === userName;

  const [bioData, setBioData] = useState<BioDataType>({
    philosophy: "",
    style: "",
    tips: "",
    about: "",
  });

  const submitResponse = useCallback(
    async ({ question, reply, audioBlobs, setIsLoading, setText }: SubmitAboutResponseType) => {
      if (!questions || !question || !reply) return;

      try {
        setIsLoading(true);

        const payload: {
          question: string;
          reply: string;
          audioReplies?: string[];
        } = { question, reply };

        if (audioBlobs) {
          const audioUrls =
            (await uploadToSpaces({
              itemsArray: audioBlobs,
              mime: "audio/wav",
            })) || [];

          payload.audioReplies = audioUrls;
        }

        const response = await callTheServer({
          endpoint: "saveAboutResponse",
          method: "POST",
          body: payload,
        });

        if (response.status === 200) {
          setText("");

          const { bio } = response.message;
          setUserDetails((prev: UserDataType) => ({
            ...prev,
            club: { ...club, ...response.message },
          }));
          setBioData({
            philosophy: bio.philosophy,
            style: bio.style,
            tips: bio.tips,
            about: bio.about,
          });
        }
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        console.log("Error in submitResponse: ", err);
      }
    },
    [userDetails]
  );

  const updateClubBio = useCallback(
    async (dirtyParts: string[], bioData: BioDataType) => {
      try {
        const updatedBio = dirtyParts.reduce(
          (a, c) => {
            if (c) a[c as string] = bioData[c as keyof BioDataType];
            return a;
          },
          {} as { [key: string]: string }
        );

        const response = await callTheServer({
          endpoint: "updateClubData",
          method: "POST",
          body: { bio: updatedBio },
        });

        if (response.status === 200) {
          setUserDetails((prev: UserDataType) => ({
            ...prev,
            club: { ...prev?.club, ...updatedBio },
          }));

          setYouData((prev: { [key: string]: any }) => ({
            ...prev,
            bio: { ...prev.bio, ...updatedBio },
          }));
        }
      } catch (err) {
        console.log("Error in updateClubBio: ", err);
      }
    },
    [userDetails, youData]
  );

  useEffect(() => {
    if (!youData && !youTrackData) return;

    let bio: { [key: string]: any } = {};

    if (isSelf) {
      bio = youData?.bio || {};
    } else {
      bio = youTrackData?.bio || {};
    }

    setBioData({
      philosophy: bio?.philosophy || "",
      style: bio?.style || "",
      tips: bio?.tips || "",
      about: bio?.about || "",
    });
  }, [isSelf, youData, youTrackData]);

  useEffect(() => {
    let showSkeleton = true;

    if (isSelf && youData) showSkeleton = false;
    if (!isSelf && youTrackData) showSkeleton = false;

    setShowSkeleton(showSkeleton);
  }, [isSelf, userDetails]);

  return (
    <ClubModerationLayout userName={userName}>
      <Skeleton visible={showSkeleton} className={`${classes.skeleton} skeleton`}>
        {isSelf ? (
          <>
            {questions && questions.length > 0 && (
              <QuestionsCarousel questions={questions} submitResponse={submitResponse} />
            )}
            <EditClubAbout
              bioData={bioData}
              isSelf={isSelf}
              youData={youData}
              questions={questions}
              setBioData={setBioData}
              updateClubBio={updateClubBio}
            />
          </>
        ) : (
          <DisplayClubAbout bioData={bioData} />
        )}
      </Skeleton>
    </ClubModerationLayout>
  );
}
