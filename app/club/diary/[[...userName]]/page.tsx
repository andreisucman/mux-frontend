"use client";

import React, { use, useCallback, useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Title } from "@mantine/core";
import ClubModerationLayout from "@/app/club/ModerationLayout";
import DiaryContent from "@/app/diary/DiaryContent";
import { HandleFetchDiaryProps } from "@/app/diary/page";
import { ChatCategoryEnum, DiaryRecordType } from "@/app/diary/type";
import ChatWithModal from "@/components/ChatWithModal";
import PageHeaderClub from "@/components/PageHeaderClub";
import { UserContext } from "@/context/UserContext";
import { diarySortItems } from "@/data/sortItems";
import fetchDiaryRecords from "@/functions/fetchDiaryRecords";
import openFiltersCard, { FilterCardNamesEnum } from "@/functions/openFilterCard";
import openErrorModal from "@/helpers/openErrorModal";

export const runtime = "edge";

type Props = {
  params: Promise<{ userName: string }>;
};

export default function DiaryPage(props: Props) {
  const params = use(props.params);
  const userName = params?.userName?.[0];

  const { userDetails } = useContext(UserContext);
  const { club } = userDetails || {};
  const { followingUserName } = club || {};

  const searchParams = useSearchParams();
  const [openValue, setOpenValue] = useState<string | null>(null);
  const [diaryRecords, setDiaryRecords] = useState<DiaryRecordType[]>();
  const [hasMore, setHasMore] = useState(false);

  const sort = searchParams.get("sort") || "-createdAt";
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");
  const part = searchParams.get("part");

  const handleFetchDiaryRecords = useCallback(
    async ({ dateFrom, dateTo, part, sort }: HandleFetchDiaryProps) => {
      try {
        const response = await fetchDiaryRecords({
          userName,
          sort,
          part,
          dateFrom,
          dateTo,
          currentArrayLength: diaryRecords?.length,
          skip: hasMore,
        });

        if (response.status === 200) {
          setDiaryRecords(response.message);
          if (response.message.length > 0) {
            setOpenValue(response.message[0]._id);
          }
          setHasMore(response.message.length === 9);
        }
      } catch (err) {
        openErrorModal();
      }
    },
    [diaryRecords, hasMore, userName]
  );

  useEffect(() => {
    if (!userName) return;

    handleFetchDiaryRecords({ dateTo, dateFrom, sort, part });
  }, [sort, userName, followingUserName, dateFrom, dateTo]);

  const noResults = !diaryRecords || diaryRecords.length === 0;

  return (
    <ClubModerationLayout
      header={
        <PageHeaderClub
          pageType="diary"
          title={"Club"}
          userName={userName}
          sortItems={diarySortItems}
          filterNames={["dateFrom", "dateTo"]}
          onFilterClick={() =>
            openFiltersCard({
              cardName: FilterCardNamesEnum.DiaryFilterCardContent,
            })
          }
          isDisabled={noResults}
        />
      }
      userName={userName}
    >
      <DiaryContent
        diaryRecords={diaryRecords}
        openValue={openValue}
        setOpenValue={setOpenValue}
        hasMore={hasMore}
        handleFetchDiaryRecords={() => handleFetchDiaryRecords({ dateFrom, dateTo, sort, part })}
      />
      <ChatWithModal
        modalTitle={
          <Title order={5} component={"p"}>
            Chat about diary
          </Title>
        }
        chatCategory={ChatCategoryEnum.DIARY}
        openChatKey={ChatCategoryEnum.DIARY}
        dividerLabel="Chat about diary"
      />
    </ClubModerationLayout>
  );
}
