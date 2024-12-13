"use client";

import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconMan, IconMoodSmile } from "@tabler/icons-react";
import { Button, rem, Skeleton, Stack } from "@mantine/core";
import AnalysisCarousel from "@/components/AnalysisCarousel";
import OverlayWithText from "@/components/OverlayWithText";
import { UserContext } from "@/context/UserContext";
import { useRouter } from "@/helpers/custom-router";
import modifyQuery from "@/helpers/modifyQuery";
import { TypeEnum } from "@/types/global";
import AnalysisHeader from "./AnalysisHeader";
import classes from "./analysis.module.css";

export const runtime = "edge";

export default function Analysis() {
  const [displayComponent, setDisplayComponent] = useState<"loading" | "carousel" | "upload">(
    "loading"
  );
  const router = useRouter();
  const { userDetails } = useContext(UserContext);
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "head";

  const { latestProgress } = userDetails || {};
  const latestTypeProgress = latestProgress?.[(type as TypeEnum.BODY) || TypeEnum.HEAD];
  const { overall, ...rest } = latestTypeProgress || {};

  const isEmpty = useMemo(
    () =>
      Object.values(rest)
        .filter(Boolean)
        .every((v) => !v),
    [rest]
  );

  const icon =
    type === "head" ? (
      <IconMoodSmile className="icon" style={{ marginRight: rem(6) }} />
    ) : (
      <IconMan className="icon" style={{ marginRight: rem(6) }} />
    );

  const overlayButton = (
    <Button mt={8} variant="default" onClick={() => router.push(`/scan/progress?type=${type}`)}>
      {icon}
      {type ? `Scan your ${type}` : "Scan"}
    </Button>
  );

  const handleChangeType = useCallback((newType?: string | null) => {
    const newQuery = modifyQuery({
      params: [{ name: "type", value: newType, action: "replace" }],
    });
    router.replace(`/analysis${newQuery ? `?${newQuery}` : ""}`);
  }, []);

  useEffect(() => {
    if (!type || !userDetails) return;

    if (rest !== null && isEmpty) {
      setDisplayComponent("upload");
    } else if (latestTypeProgress) {
      setDisplayComponent("carousel");
    }
  }, [isEmpty, type, userDetails]);

  return (
    <Stack className={`${classes.container} smallPage`}>
      <AnalysisHeader title="Analysis" onTypeChange={handleChangeType} type={type} />
      <Skeleton visible={displayComponent === "loading"} className={`${classes.skeleton} skeleton`}>
        {displayComponent === "upload" && (
          <OverlayWithText text={`No ${type} analysis`} button={overlayButton} />
        )}
        {displayComponent === "carousel" && <AnalysisCarousel type={type as TypeEnum} />}
      </Skeleton>
    </Stack>
  );
}
