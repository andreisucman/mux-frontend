"use client";

import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconCircleOff, IconFocus, IconTarget } from "@tabler/icons-react";
import { Button, Group, Image, Skeleton, Stack, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import GlowingButton from "@/components/GlowingButton";
import OverlayWithText from "@/components/OverlayWithText";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import { useRouter } from "@/helpers/custom-router";
import modifyQuery from "@/helpers/modifyQuery";
import openAuthModal from "@/helpers/openAuthModal";
import openErrorModal from "@/helpers/openErrorModal";
import openSuccessModal from "@/helpers/openSuccessModal";
import { TypeEnum, UserDataType } from "@/types/global";
import AnalysisHeader from "../AnalysisHeader";
import SelectStyleGoalModalContent from "./SelectStyleGoalModalContent";
import { outlookStyles } from "./SelectStyleGoalModalContent/outlookStyles";
import StyleSuggestionCard from "./StyleSuggestionCard";
import classes from "./result.module.css";

export const runtime = "edge";

export default function StyleScanResult() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status, userDetails, setUserDetails } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [displayComponent, setDisplayComponent] = useState<"loading" | "analysis" | "empty">(
    "loading"
  );

  const { _id: userId, club, latestStyleAnalysis } = userDetails || {};
  const type = searchParams.get("type") || "head";
  const relevantAnalysis = latestStyleAnalysis?.[type as "head"];
  const { styleName, isPublic, _id: styleId, mainUrl } = relevantAnalysis || {};

  const openMatchStyle = useCallback(() => {
    if (!relevantAnalysis || !userId) return;

    modals.openContextModal({
      modal: "general",
      centered: true,
      title: (
        <Title component={"p"} order={5}>
          Match style
        </Title>
      ),
      innerProps: (
        <SelectStyleGoalModalContent
          type={type as TypeEnum}
          relevantStyleAnalysis={relevantAnalysis}
          userId={userId}
          styleName={styleName}
        />
      ),
    });
  }, [styleName, type, relevantAnalysis, userId]);

  const handlePublishToClub = useCallback(async () => {
    if (isLoading) return;

    if (status !== "authenticated" || !club) {
      openAuthModal({
        title: "Login to continue",
        stateObject: {
          redirectPath: "/analysis/style",
          redirectQuery: `type=${type}`,
          localUserId: userId,
        },
      });
      return;
    }

    if (isPublic) {
      openErrorModal({ description: "This photo is already published in Club." });
      return;
    }

    try {
      setIsLoading(true);
      const response = await callTheServer({
        endpoint: "publishStyleToClub",
        method: "POST",
        body: {
          styleAnalysisId: styleId,
        },
      });

      if (response.status === 200) {
        if (response.error) {
          setIsLoading(true);
          openErrorModal({
            description: response.error,
          });
          return;
        }
        setUserDetails((prev: UserDataType) => ({
          ...prev,
          ...response.message,
        }));
        openSuccessModal({ description: "Your photo has been published to Club" });
      }
      setIsLoading(false);
    } catch (err) {
      openErrorModal();
      console.log("Error in handlePublishToClub: ", err);
      setIsLoading(false);
    }
  }, [styleId, isLoading, status, club, latestStyleAnalysis, userId, type]);

  const handleChangeType = useCallback(
    (newType?: string | null) => {
      if (!newType) return;
      const latestTypeAnalysis = latestStyleAnalysis?.[(newType as TypeEnum.BODY) || TypeEnum.HEAD];

      if (!latestTypeAnalysis) {
        const newQuery = modifyQuery({
          params: [{ name: "type", value: newType, action: "replace" }],
        });
        router.push(`/scan/style${newQuery ? `?${newQuery}` : ""}`);
      }
    },
    [latestStyleAnalysis]
  );

  const relevantOutlook = useMemo(
    () => outlookStyles.find((item) => item.name === styleName),
    [styleName]
  );

  const title = `Your ${type === "head" ? "head" : "outfit"} looks ${relevantOutlook?.icon} ${styleName}`;

  useEffect(() => {
    if (relevantAnalysis) {
      setDisplayComponent("analysis");
    } else if (relevantAnalysis === null) {
      setDisplayComponent("empty");
    }
  }, [relevantAnalysis]);

  return (
    <Stack className={`${classes.container} smallPage`}>
      <AnalysisHeader title="Analysis" onTypeChange={handleChangeType} />
      <Skeleton className={`skeleton ${classes.skeleton}`} visible={displayComponent === "loading"}>
        {displayComponent === "analysis" && (
          <>
            <Stack
              className={classes.imageWrapper}
              style={relevantAnalysis ? {} : { visibility: "hidden" }}
            >
              <Image alt="" src={mainUrl?.url || null} className={classes.image} />
            </Stack>
            <StyleSuggestionCard title={title} styleData={relevantAnalysis} />
            <Group className={classes.buttonGroup}>
              <Button
                variant={"default"}
                onClick={openMatchStyle}
                disabled={!relevantAnalysis}
                className={classes.button}
              >
                <IconFocus className={`icon ${classes.icon}`} /> Match a style
              </Button>
              <GlowingButton
                text="Publish"
                icon={<IconTarget className={"icon"} />}
                disabled={isLoading}
                loading={isLoading}
                onClick={handlePublishToClub}
                addGradient
              />
            </Group>
          </>
        )}
        {displayComponent === "empty" && (
          <OverlayWithText text="Nothing found" icon={<IconCircleOff className="icon" />} />
        )}
      </Skeleton>
    </Stack>
  );
}
