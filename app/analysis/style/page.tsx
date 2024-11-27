"use client";

import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IconFocus, IconTarget } from "@tabler/icons-react";
import { Button, Group, Image, Stack, Text, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import GlowingButton from "@/components/GlowingButton";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import openErrorModal from "@/helpers/openErrorModal";
import openSuccessModal from "@/helpers/openSuccessModal";
import { TypeEnum, UserDataType } from "@/types/global";
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

  const { club, latestStyleAnalysis } = userDetails || {};

  const type = searchParams.get("type") || "head";

  const relevantAnalysis = latestStyleAnalysis?.[type as "head"];
  const emptyAnalysis = !relevantAnalysis;

  const { styleName, isPublic, _id: styleId, mainUrl } = relevantAnalysis || {};

  const openMatchStyle = useCallback(() => {
    modals.openContextModal({
      modal: "general",
      centered: true,
      title: <Title component={"p"} order={5}>Match style</Title>,
      innerProps: <SelectStyleGoalModalContent type={type as TypeEnum} styleName={styleName} />,
    });
  }, [styleName, type]);

  const handlePublishToClub = useCallback(async () => {
    if (isLoading) return;
    if (status !== "authenticated" || !club) {
      return;
    }

    if (!latestStyleAnalysis) return;

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
  }, [styleId, isLoading, status, typeof club, typeof latestStyleAnalysis]);

  const relevantOutlook = useMemo(
    () => outlookStyles.find((item) => item.name === styleName),
    [styleName]
  );

  const title = `${relevantOutlook?.icon} Your ${
    type === "head" ? "head" : "outfit"
  } looks ${styleName}`;

  useEffect(() => {
    if (!searchParams) return;
    if (!userDetails) return;

    if (!relevantAnalysis) router.replace(`/scan/style?type=${type}`);
  }, [type, typeof userDetails]);

  return (
    <Stack className={classes.container}>
      <Stack
        className={classes.imageWrapper}
        style={relevantAnalysis ? {} : { visibility: "hidden" }}
      >
        <Image alt="" src={mainUrl?.url || ""} className={classes.image} />
      </Stack>
      {relevantAnalysis && (
        <StyleSuggestionCard title={title} styleData={latestStyleAnalysis?.[type as "head"]} />
      )}
      {relevantAnalysis && (
        <Group className={classes.buttonGroup}>
          <Button
            variant={"default"}
            onClick={openMatchStyle}
            disabled={emptyAnalysis}
            className={classes.button}
          >
            <IconFocus className={`icon ${classes.icon}`} /> Match a style
          </Button>
          <GlowingButton
            text="Publish to Club"
            icon={<IconTarget className={"icon"} />}
            disabled={status !== "authenticated" || isPublic || isLoading}
            loading={isLoading}
            onClick={handlePublishToClub}
            addGradient
          />
        </Group>
      )}
    </Stack>
  );
}
