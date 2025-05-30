"use client";

import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconCheckbox, IconCircleOff } from "@tabler/icons-react";
import cn from "classnames";
import { nanoid } from "nanoid";
import { Button, rem, Skeleton, Stack, Text, Title } from "@mantine/core";
import AnalysisCard from "@/components/AnalysisCard";
import AnalysisLegend from "@/components/AnalysisCard/AnalysisLegend";
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
import classes from "./analysis.module.css";

export const runtime = "edge";

export default function Analysis() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status, userDetails } = useContext(UserContext);
  const [displayComponent, setDisplayComponent] = useState<
    "loading" | "carousel" | "upload" | "healthy"
  >("loading");
  const [pageLoaded, setPageLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const part = searchParams.get("part") || "face";

  const ctaText =
    status === AuthStateEnum.AUTHENTICATED ? "Go to routines" : "Create improvement routine";

  const {
    _id: userId,
    latestConcernScores,
    latestConcernScoresDifference,
    initialProgressImages,
  } = userDetails || {};

  const checkPresence = useMemo(() => {
    const partConcerns = latestConcernScores?.[part as "face"];
    const noConcerns = (partConcerns || []).filter((item) => item.value > 0).length === 0;
    const noAnalysis = !initialProgressImages?.[part];

    return { noConcerns, noAnalysis };
  }, [latestConcernScores, initialProgressImages, part]);

  const { noConcerns, noAnalysis } = checkPresence;

  const cards = useMemo(() => {
    const partLatestConcernScores = latestConcernScores?.[part as "face"] || [];
    const partLatestConcernScoreDifference = latestConcernScoresDifference?.[part as "face"] || [];

    const concernCards = partLatestConcernScores.map((obj, i) => {
      const relevantDifferenceObject = partLatestConcernScoreDifference.find(
        (dobj) => dobj.name === obj.name
      ) || { value: 0 };
      return (
        <AnalysisCard
          key={i}
          currentScore={obj.value}
          changeScore={relevantDifferenceObject.value}
          concern={obj.name}
          explanation={obj.explanation}
        />
      );
    });

    return { concernCards };
  }, [part, latestConcernScores, latestConcernScoresDifference]);

  const { concernCards } = cards;

  const handleClick = useCallback(() => {
    if (isLoading) return;

    setIsLoading(true);

    if (status === AuthStateEnum.AUTHENTICATED) {
      router.push("/routines");
    } else {
      if (window.dataLayer) {
        const conversionId = nanoid();

        window.dataLayer.push({
          event: "SignUp",
          conversionId,
        });
      }

      router.push("/suggest/select-concerns");

      setIsLoading(false);
    }
  }, [status, userId, isLoading]);

  useEffect(() => {
    if (!pageLoaded) return;

    if (!userDetails) {
      router.replace(`/`);
    }

    if (noAnalysis) {
      setDisplayComponent("upload");
    } else {
      setDisplayComponent("carousel");
    }
  }, [part, noAnalysis, noConcerns, pageLoaded, userDetails]);

  useEffect(() => {
    setPageLoaded(true);
  }, []);

  return (
    <Stack className={cn(classes.container, "smallPage")}>
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
      <Skeleton
        visible={displayComponent === "loading"}
        className={cn(classes.skeleton, "skeleton")}
      >
        {displayComponent === "upload" ? (
          <OverlayWithText
            icon={<IconCircleOff size={24} />}
            text={`There is no analysis for ${part}`}
            button={
              <Button
                mt={8}
                variant="default"
                onClick={() => router.push(`/select-concerns?part=${part}`)}
              >
                Create
              </Button>
            }
          />
        ) : (
          <Stack className={classes.content}>
            {displayComponent === "carousel" && (
              <>
                {noConcerns && (
                  <>
                    <Stack className={classes.healthy}>
                      <IconCheckbox size={96} />
                      <Title ta="center">Your {part} looks ok!</Title>
                      <Text ta="center">We couldn't find any concerns from your photos!</Text>
                    </Stack>
                  </>
                )}

                {!noConcerns && (
                  <>
                    <AnalysisLegend color="var(--mantine-color-red-7)" text="Severity" />
                    {concernCards}

                    <GlowingButton
                      loading={isLoading}
                      disabled={isLoading}
                      text={ctaText}
                      containerStyles={{
                        flex: 0,
                        margin: "2rem auto",
                        width: "100%",
                        maxWidth: rem(300),
                      }}
                      elementId="analysis_create_routine_btn"
                      onClick={handleClick}
                    />
                    <Disclaimer
                      body="This information is not intended as
                professional medical advice. It should not be used for diagnosing or treating any medical
                condition."
                      customStyles={{ marginBottom: rem(16) }}
                      dimmed
                    />
                  </>
                )}
              </>
            )}
          </Stack>
        )}
      </Skeleton>
    </Stack>
  );
}
