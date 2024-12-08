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
import { clubResultTitles } from "../clubResultTitles";

export const runtime = "edge";

interface HandleFetchProgressProps extends FetchProgressProps {
  currentArray?: SimpleProgressType[];
}

export default function ClubProgress() {
  const searchParams = useSearchParams();
  const { status } = useContext(UserContext);
  const [progress, setProgress] = useState<SimpleProgressType[]>();
  const [hasMore, setHasMore] = useState(false);

  const type = searchParams.get("type") || "head";
  const part = searchParams.get("part");
  const followingUserId = searchParams.get("followingUserId");

  const handleFetchProgress = useCallback(
    async ({ type, part, currentArray, followingUserId, skip }: HandleFetchProgressProps) => {
      const data = await fetchProgress({
        part,
        type,
        currentArrayLength: (currentArray && currentArray.length) || 0,
        followingUserId,
        skip,
      });

      if (data) {
        if (skip) {
          setProgress([...(currentArray || []), ...data.slice(0, 6)]);
        } else {
          setProgress(data.slice(0, 6));
        }
        setHasMore(data.length === 7);
      } else {
        openErrorModal();
      }
    },
    []
  );

  useEffect(() => {
    if (status !== "authenticated") return;

    handleFetchProgress({ type, part, followingUserId });
  }, [status, followingUserId, type, part]);

  return (
    <ClubModerationLayout>
      <ProgressHeader titles={clubResultTitles} showReturn />
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
