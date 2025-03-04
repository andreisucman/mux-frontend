"use client";

import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Button, Skeleton, Stack } from "@mantine/core";
import AnalysisCarousel from "@/components/AnalysisCarousel";
import OverlayWithText from "@/components/OverlayWithText";
import { UserContext } from "@/context/UserContext";
import { useRouter } from "@/helpers/custom-router";
import modifyQuery from "@/helpers/modifyQuery";
import AnalysisHeader from "../club/AnalysisHeader";
import classes from "./analysis.module.css";

export const runtime = "edge";

export default function Analysis() {
  const [displayComponent, setDisplayComponent] = useState<"loading" | "carousel" | "upload">(
    "loading"
  );
  const router = useRouter();
  const { userDetails } = useContext(UserContext);

  const { latestProgress } = userDetails || {};
  const { overall, ...rest } = latestProgress || {};

  const isEmpty = useMemo(
    () => Object.values(rest).every((v) => v === null || v === undefined),
    [rest]
  );

  const overlayButton = (
    <Button mt={8} variant="default" onClick={() => router.push("/scan/progress")}>
      Scan
    </Button>
  );

  const handleChangeType = useCallback((newType?: string | null) => {
    const newQuery = modifyQuery({
      params: [{ name: "type", value: newType, action: "replace" }],
    });
    router.replace(`/analysis${newQuery ? `?${newQuery}` : ""}`);
  }, []);

  useEffect(() => {
    if (!userDetails) return;

    if (rest !== null && isEmpty) {
      setDisplayComponent("upload");
    } else if (latestProgress) {
      setDisplayComponent("carousel");
    }
  }, [isEmpty, userDetails]);

  return (
    <Stack className={`${classes.container} smallPage`}>
      <AnalysisHeader title="Analysis" onTypeChange={handleChangeType} />
      <Skeleton visible={displayComponent === "loading"} className={`${classes.skeleton} skeleton`}>
        {displayComponent === "upload" && (
          <OverlayWithText text={`No progress analysis`} button={overlayButton} />
        )}
        {displayComponent === "carousel" && <AnalysisCarousel />}
      </Skeleton>
    </Stack>
  );
}
