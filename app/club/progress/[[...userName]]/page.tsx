"use client";

import React, { use, useCallback, useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import cn from "classnames";
import { Loader, Stack, Title } from "@mantine/core";
import ClubProfilePreview from "@/app/club/ClubProfilePreview";
import ClubModerationLayout from "@/app/club/ModerationLayout";
import ProgressGallery from "@/app/results/ProgressGallery";
import { SimpleProgressType } from "@/app/results/types";
import { FilterItemType } from "@/components/FilterDropdown/types";
import PageHeader from "@/components/PageHeader";
import { clubPageTypeItems } from "@/components/PageHeader/data";
import { ClubContext } from "@/context/ClubDataContext";
import { UserContext } from "@/context/UserContext";
import { progressSortItems } from "@/data/sortItems";
import fetchProgress, { FetchProgressProps } from "@/functions/fetchProgress";
import getFilters from "@/functions/getFilters";
import openFiltersCard, { FilterCardNamesEnum } from "@/functions/openFilterCard";
import registerView from "@/functions/registerView";
import openResultModal from "@/helpers/openResultModal";
import { normalizeString } from "@/helpers/utils";
import SelectPartOrConcern from "../../routines/[[...userName]]/SelectPartOrConcern";
import ViewsCounter from "../../ViewsCounter";
import classes from "./progress.module.css";

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
  const { publicUserData } = useContext(ClubContext);
  const { status: authStatus, userDetails } = useContext(UserContext);
  const [progress, setProgress] = useState<SimpleProgressType[]>();
  const [hasMore, setHasMore] = useState(false);
  const [availableConcerns, setAvailableConcerns] = useState<FilterItemType[]>([]);
  const [availableParts, setAvailableParts] = useState<FilterItemType[]>([]);

  const part = searchParams.get("part");
  const concern = searchParams.get("concern");
  const sort = searchParams.get("sort");

  const { name } = userDetails || {};
  const isSelf = userName === name;

  const handleFetchProgress = useCallback(
    async ({ concern, currentArray, sort, userName, skip }: HandleFetchProgressProps) => {
      const message = await fetchProgress({
        concern,
        sort,
        currentArrayLength: (currentArray && currentArray.length) || 0,
        userName,
        skip,
      });

      const { data } = message || {};

      if (message) {
        if (skip) {
          setProgress([...(currentArray || []), ...data.slice(0, 20)]);
        } else {
          setProgress(data.slice(0, 20));
        }
        setHasMore(data.length === 21);
      }
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
    handleFetchProgress({ concern, sort, userName });
  }, [authStatus, userName, sort, concern]);

  useEffect(() => {
    if (!userName) return;
    getFilters({
      collection: "progress",
      filter: [`userName=${userName}`],
      fields: ["part", "concerns"],
    }).then((result) => {
      const { part, concerns } = result;
      setAvailableParts(part);
      setAvailableConcerns(concerns);
    });
  }, [userName]);

  useEffect(() => {
    if (!part || !concern || !userName) return;
    registerView(part, concern, "progress", userName);
  }, [typeof part, typeof concern, typeof userName]);

  const titles = clubPageTypeItems.map((item) => ({
    label: item.label,
    addQuery: true,
    value: `club/${item.value}/${userName}`,
  }));

  const noPartOrConcern = !part || !concern;

  return (
    <ClubModerationLayout
      header={
        <PageHeader
          titles={titles}
          filterNames={["part", "concern"]}
          defaultSortValue="-_id"
          childrenPosition="first"
          disableFilter={!availableConcerns && !availableParts}
          disableSort={!availableParts && !availableConcerns}
          sortItems={progressSortItems}
          children={<ViewsCounter userName={userName} page="progress" />}
          onFilterClick={() =>
            openFiltersCard({
              cardName: FilterCardNamesEnum.ClubProgressFilterCardContent,
              childrenProps: {
                concernFilterItems: availableConcerns,
                partFilterItems: availableParts,
              },
            })
          }
          nowrapContainer
        />
      }
    >
      <ClubProfilePreview
        type={isSelf ? "you" : "member"}
        data={publicUserData}
        customStyles={{ flex: 0 }}
      />
      <Stack className={classes.wrapper}>
        {noPartOrConcern ? (
          <SelectPartOrConcern
            partFilterItems={availableParts}
            concernFilterItems={availableConcerns}
          />
        ) : (
          <>
            {progress ? (
              <Stack className={cn(classes.content, "scrollbar")}>
                <ProgressGallery
                  progress={progress}
                  hasMore={hasMore}
                  isSelf={isSelf}
                  handleContainerClick={handleContainerClick}
                  handleFetchProgress={handleFetchProgress}
                  setProgress={setProgress}
                  isPublicPage
                />
              </Stack>
            ) : (
              <Loader
                m="0 auto"
                pt="30%"
                color="light-dark(var(--mantine-color-gray-4), var(--mantine-color-dark-4))"
              />
            )}
          </>
        )}
      </Stack>
    </ClubModerationLayout>
  );
}
