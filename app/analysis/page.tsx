"use client";

import React, { useCallback, useContext } from "react";
import { useSearchParams } from "next/navigation";
import { Stack } from "@mantine/core";
import AnalysisCarousel from "@/components/AnalysisCarousel";
import { UserContext } from "@/context/UserContext";
import { useRouter } from "@/helpers/custom-router";
import modifyQuery from "@/helpers/modifyQuery";
import { TypeEnum } from "@/types/global";
import AnalysisHeader from "./AnalysisHeader";
import classes from "./analysis.module.css";

export const runtime = "edge";

export default function StartAnalysis() {
  const router = useRouter();
  const { userDetails } = useContext(UserContext);
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "head";

  const { latestProgress } = userDetails || {};

  const handleChangeType = useCallback(
    (newType?: string | null) => {
      if (!newType) return;
      // to change to scan if the analysis is missing for a type
      const latestTypeProgress = latestProgress?.[(newType as TypeEnum.BODY) || TypeEnum.HEAD];
      const { overall, ...rest } = latestTypeProgress || {};
      const isEmpty = Object.values(rest)
        .filter(Boolean)
        .every((v) => !v);

      if (isEmpty) {
        const newQuery = modifyQuery({
          params: [{ name: "type", value: newType, action: "replace" }],
        });
        router.push(`/scan/progress${newQuery ? `?${newQuery}` : ""}`);
      }
    },
    [latestProgress]
  );

  return (
    <Stack className={`${classes.container} smallPage`}>
      <AnalysisHeader title="Analysis" onTypeChange={handleChangeType} />
      <AnalysisCarousel type={type as TypeEnum} />
    </Stack>
  );
}
