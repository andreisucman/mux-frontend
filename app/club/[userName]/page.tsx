"use client";

import React, { use, useCallback, useContext, useEffect, useState } from "react";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { Button, Collapse, Group, Skeleton, Stack, Text } from "@mantine/core";
import { ClubContext } from "@/context/ClubDataContext";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import Link from "@/helpers/custom-router/patch-router/link";
import { getFromLocalStorage, saveToLocalStorage } from "@/helpers/localStorage";
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
  const { userName } = use(props.params);

  const { youFollowData, hasNewAboutQuestions, hasAboutAnswers, youData, setYouData } =
    useContext(ClubContext);
  const { userDetails } = useContext(UserContext);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [showQuestions, setShowQuestions] = useState(true);

  const { name } = userDetails || {};

  const isSelf = name === userName;

  const [bioData, setBioData] = useState<BioDataType>({
    philosophy: "",
    style: "",
    tips: "",
  });

  const chevron = showQuestions ? (
    <IconChevronUp className="icon" />
  ) : (
    <IconChevronDown className="icon" />
  );

  const questionsTitle = showQuestions ? "Create bio questions:" : "Show create bio questions";

  const updateClubBio = useCallback(
    async (
      dirtyParts: string[],
      bioData: BioDataType,
      setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
      try {
        setIsLoading(true);
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
          setYouData((prev: { [key: string]: any }) => ({
            ...prev,
            bio: { ...prev.bio, ...updatedBio },
          }));
        }
      } catch (err) {
      } finally {
        setIsLoading(false);
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
  }, [isSelf, typeof youData, typeof youFollowData]);

  useEffect(() => {
    if (hasNewAboutQuestions === undefined) return;

    if (isSelf) setShowSkeleton(false);
    if (!isSelf && youFollowData) setShowSkeleton(false);
  }, [isSelf, userDetails, hasNewAboutQuestions]);

  useEffect(() => {
    const savedShowQuestions = getFromLocalStorage("showAboutQuestions");
    setShowQuestions(!!savedShowQuestions);
  }, []);

  const buttonText = hasNewAboutQuestions ? "Answer questions" : "See your answers";
  const buttonPath = userName ? `/club/answers/${userName}` : `/club/answers`;

  return (
    <ClubModerationLayout userName={userName} pageType="about">
      <Skeleton
        visible={showSkeleton || hasNewAboutQuestions === undefined}
        className={`${classes.skeleton} skeleton`}
      >
        {isSelf ? (
          <>
            <Stack className={classes.carouselContainer}>
              <Group className={classes.carouselHeader} onClick={toggleQuestions}>
                <Text size="xs" c="dimmed">
                  {questionsTitle}
                </Text>
                {chevron}
              </Group>

              <Collapse in={showQuestions}>
                <Stack className={classes.buttonWrapper}>
                  <Button
                    m="auto"
                    c="white"
                    variant={hasNewAboutQuestions ? "filled" : "default"}
                    component={Link}
                    href={buttonPath}
                  >
                    {buttonText}
                  </Button>
                </Stack>
              </Collapse>
            </Stack>
            <EditClubAbout
              bioData={bioData}
              isSelf={isSelf}
              youData={youData}
              hasAboutAnswers={hasAboutAnswers}
              hasNewAboutQuestions={hasNewAboutQuestions}
              setBioData={setBioData}
              updateClubBio={updateClubBio}
              setYouData={setYouData}
            />
          </>
        ) : (
          <DisplayClubAbout bioData={bioData} />
        )}
      </Skeleton>
    </ClubModerationLayout>
  );
}
