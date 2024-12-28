"use client";

import React, { use, useCallback, useContext, useEffect, useState } from "react";
import { IconChevronDown, IconX } from "@tabler/icons-react";
import { Button, Collapse, Group, Skeleton, Stack, Text } from "@mantine/core";
import { ClubContext } from "@/context/ClubDataContext";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import { getFromLocalStorage, saveToLocalStorage } from "@/helpers/localStorage";
import { UserDataType } from "@/types/global";
import ClubModerationLayout from "../ModerationLayout";
import DisplayClubAbout from "./DisplayClubAbout";
import EditClubAbout from "./EditClubAbout";
import classes from "./about.module.css";

export const runtime = "edge";

type BioDataType = {
  philosophy: string;
  style: string;
  tips: string;
};

type Props = {
  params: Promise<{ userName: string }>;
};

export default function ClubAbout(props: Props) {
  const params = use(props.params);
  const { youFollowData, hasNewAboutQuestions, hasAboutAnswers, youData, setYouData } =
    useContext(ClubContext);
  const { userDetails, setUserDetails } = useContext(UserContext);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [showQuestions, setShowQuestions] = useState(true);

  const { userName } = params;
  const { name } = userDetails || {};

  const isSelf = name === userName;

  const [bioData, setBioData] = useState<BioDataType>({
    philosophy: "",
    style: "",
    tips: "",
  });

  const chevron = showQuestions ? <IconX className="icon" /> : <IconChevronDown className="icon" />;

  const questionsTitle = showQuestions ? "Create bio questions:" : "Show create bio questions";

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

  const toggleQuestions = useCallback(() => {
    setShowQuestions((prev) => {
      saveToLocalStorage("showAboutQuestions", !prev);
      return !prev;
    });
  }, []);

  useEffect(() => {
    if (!youData && !youFollowData) return;

    let bio: { [key: string]: any } = {};

    if (isSelf) {
      bio = youData?.bio || {};
    } else {
      bio = youFollowData?.bio || {};
    }

    setBioData({
      philosophy: bio?.philosophy || "",
      style: bio?.style || "",
      tips: bio?.tips || "",
    });
  }, [isSelf, youData, youFollowData]);

  useEffect(() => {
    let showSkeleton = true;

    if (isSelf) showSkeleton = false;
    if (!isSelf && youFollowData) showSkeleton = false;

    setShowSkeleton(showSkeleton);
  }, [isSelf, userDetails]);

  useEffect(() => {
    const savedShowQuestions = getFromLocalStorage("showAboutQuestions");
    setShowQuestions(!!savedShowQuestions);
  }, []);

  const buttonText = hasNewAboutQuestions ? "Answer new questions" : "See your answers";

  return (
    <ClubModerationLayout userName={userName} pageType="about">
      <Skeleton visible={showSkeleton} className={`${classes.skeleton} skeleton`}>
        {isSelf ? (
          <>
            {hasNewAboutQuestions && (
              <Stack className={classes.carouselContainer}>
                <Group className={classes.carouselHeader} onClick={toggleQuestions}>
                  <Text size="xs" c="dimmed">
                    {questionsTitle}
                  </Text>
                  {chevron}
                </Group>

                <Collapse in={showQuestions}>
                  <Stack className={classes.buttonWrapper}>
                    <Button m="auto">{buttonText}</Button>
                  </Stack>
                </Collapse>
              </Stack>
            )}
            <EditClubAbout
              bioData={bioData}
              isSelf={isSelf}
              youData={youData}
              hasAboutAnswers={hasAboutAnswers}
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
