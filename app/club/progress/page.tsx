"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader } from "@mantine/core";
import ProgressGallery from "@/app/results/ProgressGallery";
import ProgressHeader from "@/app/results/ProgressHeader";
import { SimpleProgressType } from "@/app/results/types";
import { UserContext } from "@/context/UserContext";
import fetchProgress, { FetchProgressProps } from "@/functions/fetchProgress";
import openErrorModal from "@/helpers/openErrorModal";
import ClubModerationLayout from "../ModerationLayout";

export const runtime = "edge";

export default function ClubProgress() {
  const searchParams = useSearchParams();
  const { status } = useContext(UserContext);
  const [progress, setProgress] = useState<SimpleProgressType[]>();
  const [hasMore, setHasMore] = useState(false);

  const type = searchParams.get("type") || "head";
  const part = searchParams.get("part");
  const trackedUserId = searchParams.get("trackedUserId");

  const handleFetchProgress = useCallback(
    async ({ type, part, currentArrayLength, skip }: FetchProgressProps) => {
      const data = await fetchProgress({
        part,
        type,
        currentArrayLength,
        trackedUserId,
        skip,
      });

      if (data) {
        if (skip) {
          setProgress([...(progress || []), ...data.slice(0, 20)]);
        } else {
          setProgress(data.slice(0, 20));
        }
        setHasMore(data.length === 21);
      } else {
        openErrorModal();
      }
    },
    [trackedUserId, progress && progress.length]
  );

  useEffect(() => {
    if (status !== "authenticated") return;

    handleFetchProgress({ type, part });
  }, [status, trackedUserId, type, part]);

  return (
    <ClubModerationLayout>
      <ProgressHeader title="Progress" showReturn />
      {progress ? (
        <ProgressGallery
          progress={progress}
          hasMore={hasMore}
          handleFetchProgress={handleFetchProgress}
          setProgress={setProgress}
        />
      ) : (
        <Loader m="auto" />
      )}
    </ClubModerationLayout>
  );
}
