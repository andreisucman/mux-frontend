"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconCircleOff } from "@tabler/icons-react";
import { Loader, Stack } from "@mantine/core";
import OverlayWithText from "@/components/OverlayWithText";
import { UserContext } from "@/context/UserContext";
import fetchProgress, { FetchProgressProps } from "@/functions/fetchProgress";
import SkeletonWrapper from "../SkeletonWrapper";
import { individualResultTitles } from "./individualResultTitles";
import ProgressGallery from "./ProgressGallery";
import ProgressHeader from "./ProgressHeader";
import { SimpleProgressType } from "./types";
import classes from "./results.module.css";

export const runtime = "edge";

interface HandleFetchProgressProps extends FetchProgressProps {
  currentArray?: SimpleProgressType[];
}

export default function ResultsProgress() {
  const searchParams = useSearchParams();
  const { status } = useContext(UserContext);
  const [progress, setProgress] = useState<SimpleProgressType[]>();
  const [hasMore, setHasMore] = useState(false);

  const type = searchParams.get("type") || "head";
  const part = searchParams.get("part");

  const handleFetchProgress = useCallback(
    async ({ type, part, skip, followingUserId, currentArray }: HandleFetchProgressProps) => {
      try {
        const items = await fetchProgress({
          type,
          part,
          skip,
          followingUserId,
          currentArrayLength: (currentArray && currentArray.length) || 0,
        });

        if (skip) {
          setProgress([...(currentArray || []), ...items.slice(0, 20)]);
        } else {
          setProgress(items.slice(0, 20));
        }
        setHasMore(items.length === 21);
      } catch (err) {
        console.log("Error in handleFetchProgress: ", err);
      }
    },
    []
  );

  useEffect(() => {
    if (status !== "authenticated") return;

    handleFetchProgress({ type, part });
  }, [status, type, part]);

  console.log("progress", progress);

  return (
    <Stack className={`${classes.container} mediumPage`}>
      <SkeletonWrapper>
        <ProgressHeader titles={individualResultTitles} showReturn />
        {progress ? (
          <>
            {progress.length > 0 ? (
              <ProgressGallery
                progress={progress}
                hasMore={hasMore}
                handleFetchProgress={handleFetchProgress}
                setProgress={setProgress}
                isSelfPage
              />
            ) : (
              <OverlayWithText text="No progress data" icon={<IconCircleOff className="icon" />} />
            )}
          </>
        ) : (
          <Loader style={{ margin: "0 auto", paddingTop: "15%" }} />
        )}
      </SkeletonWrapper>
    </Stack>
  );
}
