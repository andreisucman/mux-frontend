"use client";

import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconCircleOff } from "@tabler/icons-react";
import { Button, rem, Skeleton, Stack, Text } from "@mantine/core";
import ConcernCard from "@/components/ConcernCard";
import FilterDropdown from "@/components/FilterDropdown";
import GlowingButton from "@/components/GlowingButton";
import OverlayWithText from "@/components/OverlayWithText";
import PageHeader from "@/components/PageHeader";
import { partItems } from "@/components/PageHeader/data";
import Disclaimer from "@/components/WaitComponent/Disclaimer";
import { UserContext } from "@/context/UserContext";
import { AuthStateEnum } from "@/context/UserContext/types";
import { useRouter } from "@/helpers/custom-router";
import { partIcons } from "@/helpers/icons";
import openAuthModal from "@/helpers/openAuthModal";
import { ReferrerEnum } from "../auth/AuthForm/types";
import SkinHealthyCard from "./SkinHealthyCard";
import classes from "./analysis.module.css";

export const runtime = "edge";

export default function Analysis() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status, userDetails } = useContext(UserContext);
  const [displayComponent, setDisplayComponent] = useState<
    "loading" | "carousel" | "upload" | "perfect"
  >("loading");
  const [pageLoaded, setPageLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const part = searchParams.get("part") || "face";

  const {
    _id: userId,
    latestProgress,
    latestConcernScores,
    latestConcernScoresDifference,
    latestFeatureScores,
    latestFeatureScoresDifference,
  } = userDetails || {};

  const isEmpty = useMemo(
    () => latestProgress && !latestProgress[part as "face"],
    [latestProgress, part]
  );

  const noConcerns = useMemo(() => {
    if (!latestConcernScores || isEmpty) return;
    const partConcerns = latestConcernScores[part as "face"];

    return partConcerns.filter((item) => item.value > 0).length === 0;
  }, [latestConcernScores, part]);

  const noFeatures = useMemo(() => {
    if (!latestFeatureScores || isEmpty) return;
    const partFeatures = latestFeatureScores[part as "face"];

    return partFeatures.filter((item) => item.value > 0).length === 0;
  }, [latestFeatureScores, part]);

  const concernCards = useMemo(() => {
    if (!latestConcernScores || !latestConcernScoresDifference || isEmpty) return;

    const partLatestConcernScores = latestConcernScores[part as "face"];

    const partLatestScoreDifference = latestConcernScoresDifference[part as "face"];

    return partLatestConcernScores.map((obj, i) => {
      const relevantDifferenceObject = partLatestScoreDifference.find(
        (dobj) => dobj.name === obj.name
      ) || { value: 0 };
      return (
        <ConcernCard
          key={i}
          currentScore={obj.value}
          changeScore={relevantDifferenceObject.value}
          concern={obj.name}
          explanation={obj.explanation}
        />
      );
    });
  }, [part, isEmpty, latestConcernScores, latestConcernScoresDifference]);

  const handleClick = useCallback(() => {
    if (isLoading) return;

    setIsLoading(true);

    if (status === AuthStateEnum.AUTHENTICATED) {
      router.push("/routines");
    } else {
      openAuthModal({
        stateObject: {
          redirectPath: "/routines",
          localUserId: userId,
          referrer: ReferrerEnum.ANALYSIS,
        },
        title: "Start your change",
      });

      setIsLoading(false);
    }
  }, [status, userId, isLoading]);

  useEffect(() => {
    if (!pageLoaded) return;

    if (!userDetails) {
      router.replace(`/`);
    }

    if (latestProgress !== null && isEmpty) {
      setDisplayComponent("upload");
    } else if (noConcerns) {
      setDisplayComponent("perfect");
    } else if (latestProgress) {
      setDisplayComponent("carousel");
    }
  }, [part, isEmpty, noConcerns, pageLoaded, userDetails]);

  useEffect(() => {
    setPageLoaded(true);
  }, []);

  return (
    <Stack className={`${classes.container} smallPage`}>
      <PageHeader
        title="Analysis"
        children={
          <FilterDropdown
            selectedValue={part}
            data={partItems}
            icons={partIcons}
            filterType="part"
            placeholder="Select part"
            addToQuery
          />
        }
      />
      <Skeleton visible={displayComponent === "loading"} className={`${classes.skeleton} skeleton`}>
        {displayComponent === "upload" && (
          <OverlayWithText
            icon={<IconCircleOff size={24} />}
            text={`There is no analysis for ${part}`}
            button={
              <Button mt={8} variant="default" onClick={() => router.push("/select-part")}>
                Create
              </Button>
            }
          />
        )}
        {displayComponent === "perfect" && (
          <SkinHealthyCard
            part={part}
            latestFeatureScores={latestFeatureScores}
            latestFeatureScoresDifference={latestFeatureScoresDifference}
          />
        )}
        {displayComponent === "carousel" && (
          <Stack className={classes.content}>
            <Text size="sm" c="dimmed">
              Severity of concerns
            </Text>
            {concernCards}
            <GlowingButton
              loading={isLoading}
              disabled={isLoading}
              text={"Create improvement routine"}
              containerStyles={{ flex: 0, margin: "2rem auto", width: "100%", maxWidth: rem(300) }}
              onClick={handleClick}
            />
            <Disclaimer
              body="This information is not intended as
                  professional medical advice. It should not be used for diagnosing or treating any medical
                  condition."
              customStyles={{ marginBottom: rem(16) }}
              dimmed
            />
          </Stack>
        )}
      </Skeleton>
    </Stack>
  );
}
