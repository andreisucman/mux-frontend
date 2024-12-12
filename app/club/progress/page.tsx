"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Skeleton, Title } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import ProgressGallery from "@/app/results/ProgressGallery";
import { SimpleProgressType } from "@/app/results/types";
import { UserContext } from "@/context/UserContext";
import fetchProgress, { FetchProgressProps } from "@/functions/fetchProgress";
import openErrorModal from "@/helpers/openErrorModal";
import openResultModal from "@/helpers/openResultModal";
import ClubModerationLayout from "../ModerationLayout";

export const runtime = "edge";

interface HandleFetchProgressProps extends FetchProgressProps {
  currentArray?: SimpleProgressType[];
}

export default function ClubProgress() {
  const searchParams = useSearchParams();
  const { status } = useContext(UserContext);
  const [progress, setProgress] = useState<SimpleProgressType[]>();
  const [hasMore, setHasMore] = useState(false);

  const type = searchParams.get("type");
  const part = searchParams.get("part");
  const position = searchParams.get("position");
  const followingUserId = searchParams.get("followingUserId");

  const handleFetchProgress = useCallback(
    async ({
      type,
      part,
      currentArray,
      position,
      followingUserId,
      skip,
    }: HandleFetchProgressProps) => {
      const data = await fetchProgress({
        part,
        type,
        position,
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

  const handleContainerClick = useCallback(
    (data: SimpleProgressType) =>
      openResultModal({
        record: data,
        type: "progress",
        title: (
          <Title order={5} component={"p"}>
            {upperFirst(data.part)} progress
          </Title>
        ),
      }),
    []
  );

  useEffect(() => {
    if (status !== "authenticated") return;

    handleFetchProgress({ type, part, position, followingUserId });
  }, [status, followingUserId, type, part]);

  return (
    <ClubModerationLayout>
      {progress ? (
        <ProgressGallery
          progress={progress}
          hasMore={hasMore}
          handleContainerClick={handleContainerClick}
          handleFetchProgress={handleFetchProgress}
          setProgress={setProgress}
        />
      ) : (
        <Skeleton className="skeleton" flex={1}></Skeleton>
      )}
    </ClubModerationLayout>
  );
}
