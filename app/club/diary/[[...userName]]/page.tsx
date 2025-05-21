"use client";

import React, { use, useCallback, useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import cn from "classnames";
import { Loader, Stack } from "@mantine/core";
import ClubProfilePreview from "@/app/club/ClubProfilePreview";
import ClubModerationLayout from "@/app/club/ModerationLayout";
import { HandleFetchDiaryProps } from "@/app/diary/page";
import { DiaryType } from "@/app/diary/type";
import DiaryContent from "@/components/DiaryContent";
import { FilterItemType } from "@/components/FilterDropdown/types";
import PageHeader from "@/components/PageHeader";
import { clubPageTypeItems } from "@/components/PageHeader/data";
import { ClubContext } from "@/context/ClubDataContext";
import { UserContext } from "@/context/UserContext";
import { diarySortItems } from "@/data/sortItems";
import fetchDiaryRecords from "@/functions/fetchDiaryRecords";
import getFilters from "@/functions/getFilters";
import openFiltersCard, { FilterCardNamesEnum } from "@/functions/openFilterCard";
import registerView from "@/functions/registerView";
import SelectPartOrConcern from "../../routines/[[...userName]]/SelectPartOrConcern";
import ViewsCounter from "../../ViewsCounter";
import classes from "./diary.module.css";

export const runtime = "edge";

type Props = {
  params: Promise<{ userName: string }>;
};

export default function DiaryPage(props: Props) {
  const params = use(props.params);
  const userName = params?.userName?.[0];

  const { userDetails, status: authStatus } = useContext(UserContext);
  const { name } = userDetails || {};
  const isSelf = userName === name;

  const searchParams = useSearchParams();
  const { publicUserData } = useContext(ClubContext);
  const [openValue, setOpenValue] = useState<string | null>(null);
  const [diaryRecords, setDiaryRecords] = useState<DiaryType[]>();
  const [hasMore, setHasMore] = useState(false);
  const [availableConcerns, setAvailableConcerns] = useState<FilterItemType[]>([]);
  const [availableParts, setAvailableParts] = useState<FilterItemType[]>([]);

  const sort = searchParams.get("sort") || "-createdAt";
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");
  const concern = searchParams.get("concern");
  const part = searchParams.get("part");

  const handleFetchDiaryRecords = useCallback(
    async ({ dateFrom, dateTo, concern, part, sort }: HandleFetchDiaryProps) => {
      const message = await fetchDiaryRecords({
        userName,
        sort,
        part,
        concern,
        dateFrom,
        dateTo,
        currentArrayLength: diaryRecords?.length,
        skip: hasMore,
      });

      const { data } = message || {};

      if (message) {
        if (hasMore) {
          setDiaryRecords((prev) => [...(prev || []), ...data.slice(0, 20)]);
        } else {
          setDiaryRecords(data.slice(0, 20));
        }
        setOpenValue(data[0]?._id);
        setHasMore(data.length === 21);
      }
    },
    [diaryRecords, hasMore, userName]
  );

  useEffect(() => {
    if (!userName) return;

    handleFetchDiaryRecords({ dateTo, dateFrom, sort, part, concern });
  }, [sort, concern, userName, dateFrom, dateTo, authStatus]);

  useEffect(() => {
    if (!userName) return;
    getFilters({
      collection: "diary",
      filter: [`userName=${userName}`],
      fields: ["part", "concern"],
    }).then((result) => {
      const { part, concern } = result;
      setAvailableParts(part);
      setAvailableConcerns(concern);
    });
  }, [userName]);

  useEffect(() => {
    if (!part || !concern || !userName) return;
    registerView(part, concern, "diary", userName);
  }, [typeof part, typeof concern, typeof userName]);

  const noPartOrConcern = !part || !concern;

  const titles = clubPageTypeItems.map((item) => ({
    label: item.label,
    addQuery: true,
    value: `club/${item.value}/${userName}`,
  }));

  return (
    <ClubModerationLayout
      header={
        <PageHeader
          titles={titles}
          sortItems={diarySortItems}
          defaultSortValue={"-_id"}
          filterNames={["dateFrom", "dateTo", "part", "concern"]}
          children={<ViewsCounter userName={userName} page="diary" />}
          childrenPosition="first"
          onFilterClick={() =>
            openFiltersCard({
              cardName: FilterCardNamesEnum.DiaryFilterCardContent,
              childrenProps: {
                partFilterItems: availableParts,
                concernFilterItems: availableConcerns,
              },
            })
          }
          disableFilter={!availableParts && !availableConcerns}
          disableSort={!availableParts && !availableConcerns}
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
        <Stack className={cn(classes.content, "scrollbar")}>
          {noPartOrConcern ? (
            <SelectPartOrConcern
              partFilterItems={availableParts}
              concernFilterItems={availableConcerns}
            />
          ) : (
            <>
              {diaryRecords ? (
                <>
                  <DiaryContent
                    diaryRecords={diaryRecords}
                    openValue={openValue}
                    setOpenValue={setOpenValue}
                    hasMore={hasMore}
                    availableParts={availableParts}
                    availableConcerns={availableConcerns}
                    handleFetchDiaryRecords={() =>
                      handleFetchDiaryRecords({ dateFrom, dateTo, sort, part, concern })
                    }
                    isPublic={true}
                  />
                </>
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
      </Stack>
    </ClubModerationLayout>
  );
}
