"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader, Stack } from "@mantine/core";
import { UserContext } from "@/context/UserContext";
import fetchProgress, { FetchProgressProps } from "@/functions/fetchProgress";
import openErrorModal from "@/helpers/openErrorModal";
import ProgressGallery from "./ProgressGallery";
import ProgressHeader from "./ProgressHeader";
import { SimpleProgressType } from "./types";
import classes from "./results.module.css";

export const runtime = "edge";

interface HandleFetchProgressProps extends FetchProgressProps {
  currentArray?: SimpleProgressType[]
}

export default function ResultsProgress() {
  const searchParams = useSearchParams();
  const { status } = useContext(UserContext);
  const [progress, setProgress] = useState<SimpleProgressType[]>();
  const [hasMore, setHasMore] = useState(false);

  const type = searchParams.get("type") || "head";
  const part = searchParams.get("part");

  const handleFetchProgress = useCallback(
    async ({ type, part, skip, trackedUserId, currentArray }: HandleFetchProgressProps) => {
      try {
        const response = await fetchProgress({
          type,
          part,
          skip,
          trackedUserId,
          currentArrayLength: currentArray && currentArray.length || 0,
        });

        if (response.status === 200) {
          if (skip) {
            setProgress([...(currentArray || []), ...response.message.slice(0, 20)]);
          } else {
            setProgress(response.message.slice(0, 20));
          }
          setHasMore(response.message.length === 21);
        } else {
          openErrorModal();
        }
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

  return (
    <Stack className={`${classes.container} mediumPage`}>
      <ProgressHeader title="Progress" showReturn />
      {progress ? (
        <ProgressGallery
          progress={progress}
          hasMore={hasMore}
          handleFetchProgress={handleFetchProgress}
          setProgress={setProgress}
          isSelfPage
        />
      ) : (
        <Loader m="auto" />
      )}
    </Stack>
  );
}
