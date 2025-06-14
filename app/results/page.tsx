"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconCircleOff } from "@tabler/icons-react";
import cn from "classnames";
import { Loader, Stack, Title } from "@mantine/core";
import { FilterItemType } from "@/components/FilterDropdown/types";
import OverlayWithText from "@/components/OverlayWithText";
import PageHeader from "@/components/PageHeader";
import { UserContext } from "@/context/UserContext";
import { progressSortItems } from "@/data/sortItems";
import fetchProgress, { FetchProgressProps } from "@/functions/fetchProgress";
import getFilters from "@/functions/getFilters";
import openFiltersCard, { FilterCardNamesEnum } from "@/functions/openFilterCard";
import openResultModal from "@/helpers/openResultModal";
import { normalizeString } from "@/helpers/utils";
import SkeletonWrapper from "../SkeletonWrapper";
import { individualResultTitles } from "./individualResultTitles";
import ProgressGallery from "./ProgressGallery";
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
  const [availableParts, setAvailableParts] = useState<FilterItemType[]>();
  const [availableConcerns, setAvailableConcerns] = useState<FilterItemType[]>();

  const concern = searchParams.get("concern");
  const sort = searchParams.get("sort");

  const handleFetchProgress = useCallback(
    async ({ concern, skip, sort, userName, currentArray }: HandleFetchProgressProps) => {
      setProgress(undefined);
      const message = await fetchProgress({
        concern,
        sort,
        skip,
        userName,
        currentArrayLength: (currentArray && currentArray.length) || 0,
      });

      const { data } = message;

      if (skip) {
        setProgress([...(currentArray || []), ...data.slice(0, 20)]);
      } else {
        setProgress(data.slice(0, 20));
      }
      setHasMore(data.length === 21);
    },
    [progress]
  );

  const handleContainerClick = useCallback(
    (data: SimpleProgressType) =>
      openResultModal({
        record: data,
        type: "progress",
        title: (
          <Title order={5} component={"p"}>
            {normalizeString(data.part)} progress
          </Title>
        ),
      }),
    []
  );

  useEffect(() => {
    handleFetchProgress({ concern, sort });
  }, [status, sort, concern]);

  useEffect(() => {
    getFilters({
      collection: "progress",
      fields: ["part", "concerns"],
    }).then((result) => {
      const { part, concerns } = result;
      setAvailableParts(part);
      setAvailableConcerns(concerns);
    });
  }, []);

  return (
    <Stack className={cn(classes.container, "mediumPage")}>
      <SkeletonWrapper>
        <PageHeader
          titles={individualResultTitles}
          disableFilter={!availableConcerns}
          disableSort={availableConcerns?.length === 0}
          filterNames={["part", "concern"]}
          sortItems={progressSortItems}
          defaultSortValue="-_id"
          onFilterClick={() =>
            openFiltersCard({
              cardName: FilterCardNamesEnum.ClubProgressFilterCardContent,
              childrenProps: {
                concernFilterItems: availableConcerns,
                partFilterItems: availableParts,
              },
            })
          }
        />
        {progress ? (
          <>
            {progress.length > 0 ? (
              <ProgressGallery
                progress={progress}
                hasMore={hasMore}
                handleContainerClick={handleContainerClick}
                handleFetchProgress={handleFetchProgress}
                setProgress={setProgress}
                isPublicPage={false}
                isSelf
              />
            ) : (
              <OverlayWithText text="No progress data" icon={<IconCircleOff size={20} />} />
            )}
          </>
        ) : (
          <Loader
            m="0 auto"
            pt="30%"
            color="light-dark(var(--mantine-color-gray-4), var(--mantine-color-dark-4))"
          />
        )}
      </SkeletonWrapper>
    </Stack>
  );
}
