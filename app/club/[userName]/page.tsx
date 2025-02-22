"use client";

import React, { use, useCallback, useContext, useEffect, useState } from "react";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { Button, Collapse, Group, Skeleton, Stack, Text } from "@mantine/core";
import { ClubContext } from "@/context/ClubDataContext";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import Link from "@/helpers/custom-router/patch-router/link";
import { getFromLocalStorage, saveToLocalStorage } from "@/helpers/localStorage";
import ClubHeader from "../ClubHeader";
import ClubModerationLayout from "../ModerationLayout";
import DisplayClubAbout from "./DisplayClubAbout";
import EditClubAbout from "./EditClubAbout";
import classes from "./about.module.css";

export const runtime = "edge";

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
  const [about, setAbout] = useState<string>("");

  const { name } = userDetails || {};

  const isSelf = name === userName;

  const chevron = showQuestions ? (
    <IconChevronUp className="icon" />
  ) : (
    <IconChevronDown className="icon" />
  );

  const questionsTitle = showQuestions ? "Create about questions:" : "Show create about questions";

  const updateClubBio = useCallback(
    async (about: string, setIsLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
      try {
        setIsLoading(true);

        const response = await callTheServer({
          endpoint: "updateUserData",
          method: "POST",
          body: { about },
        });

        if (response.status === 200) {
          setYouData((prev: { [key: string]: any }) => ({
            ...prev,
            about,
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

    const { bio: yourBio } = youData || {};
    const { bio: youFollowBio } = youFollowData || {};

    let about = "";

    if (isSelf) {
      about = yourBio?.about || "";
    } else {
      about = youFollowBio?.about || "";
    }

    setAbout(about);
  }, [isSelf, typeof youData, typeof youFollowData]);

  useEffect(() => {
    if (hasNewAboutQuestions === undefined) return;

    if (isSelf) setShowSkeleton(false);
    if (!isSelf && youFollowData) setShowSkeleton(false);
  }, [isSelf, userDetails, hasNewAboutQuestions]);

  useEffect(() => {
    const savedShowQuestions = getFromLocalStorage("showAboutQuestions");
    if (savedShowQuestions !== undefined && savedShowQuestions !== null)
      setShowQuestions(!!savedShowQuestions);
  }, []);

  const buttonText = hasNewAboutQuestions ? "Answer questions" : "See your answers";
  const buttonLink = hasNewAboutQuestions
    ? `/club/answers/${userName}`
    : `/club/answers/${userName}?showType=answered`;

  return (
    <ClubModerationLayout
      header={<ClubHeader title={"Club"} pageType="about" showReturn />}
      userName={userName}
      pageType="about"
    >
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
                <Group className={classes.buttonWrapper}>
                  <Text size="sm">Answer questions to create your about</Text>
                  <Button
                    c="white"
                    variant={hasNewAboutQuestions ? "filled" : "default"}
                    component={Link}
                    href={buttonLink}
                  >
                    {buttonText}
                  </Button>
                </Group>
              </Collapse>
            </Stack>
            <EditClubAbout
              about={about}
              isSelf={isSelf}
              youData={youData}
              hasAboutAnswers={hasAboutAnswers}
              hasNewAboutQuestions={hasNewAboutQuestions}
              setAbout={setAbout}
              updateClubBio={updateClubBio}
              setYouData={setYouData}
            />
          </>
        ) : (
          <DisplayClubAbout about={about} />
        )}
      </Skeleton>
    </ClubModerationLayout>
  );
}
