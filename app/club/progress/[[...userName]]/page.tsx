"use client";

import React, { use, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader, Title } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import ProgressGallery from "@/app/results/ProgressGallery";
import { SimpleProgressType } from "@/app/results/types";
import { UserContext } from "@/context/UserContext";
import fetchProgress, { FetchProgressProps } from "@/functions/fetchProgress";
import openResultModal from "@/helpers/openResultModal";
import ClubModerationLayout from "../../ModerationLayout";
import ClubProgressHeader from "../ClubProgressHeader";

export const runtime = "edge";

interface HandleFetchProgressProps extends FetchProgressProps {
  currentArray?: SimpleProgressType[];
}

type Props = {
  params: Promise<{ userName: string }>;
};

export default function ClubProgress(props: Props) {
  const params = use(props.params);
  const userName = params?.userName?.[0];

  const searchParams = useSearchParams();
  const { status, userDetails } = useContext(UserContext);
  const [progress, setProgress] = useState<SimpleProgressType[]>();
  const [hasMore, setHasMore] = useState(false);

  const part = searchParams.get("part");
  const sort = searchParams.get("sort");

  const isSelf = userName === userDetails?.name;

  const clubResultTitles = useMemo(
    () => [
      { label: "Progress", value: `/club/progress${userName ? `/${userName}` : ""}` },
      { label: "Proof", value: `/club/proof${userName ? `/${userName}` : ""}` },
    ],
    [userName]
  );

  const handleFetchProgress = useCallback(
    async ({ part, currentArray, sort, userName, skip }: HandleFetchProgressProps) => {
      const data = await fetchProgress({
        part,
        sort,
        currentArrayLength: (currentArray && currentArray.length) || 0,
        userName,
        skip,
      });

      if (skip) {
        setProgress([...(currentArray || []), ...data.slice(0, 20)]);
      } else {
        setProgress(data.slice(0, 20));
      }
      setHasMore(data.length === 21);
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

    handleFetchProgress({ part, sort, userName });
  }, [status, userName, sort, part]);

  const noResults = !progress || progress.length === 0;

  return (
    <ClubModerationLayout
      header={
        <ClubProgressHeader
          isDisabled={noResults}
          titles={clubResultTitles}
          userName={userName}
          showReturn
        />
      }
      userName={userName}
      pageType="progress"
    >
      {progress ? (
        <ProgressGallery
          progress={progress}
          hasMore={hasMore}
          isPublicPage={false}
          isSelf={isSelf}
          handleContainerClick={handleContainerClick}
          handleFetchProgress={handleFetchProgress}
          setProgress={setProgress}
        />
      ) : (
        <Loader m="0 auto" pt="15%" />
      )}
    </ClubModerationLayout>
  );
}
