"use client";

import React, { use, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Title } from "@mantine/core";
import DiaryContent from "@/app/diary/DiaryContent";
import { ChatCategoryEnum, DiaryRecordType } from "@/app/diary/type";
import { diarySortItems } from "@/data/sortItems";
import fetchDiaryRecords from "@/functions/fetchDiaryRecords";
import openErrorModal from "@/helpers/openErrorModal";
import ChatWithModal from "../../../../components/ChatWithModal";
import ClubHeader from "../../ClubHeader";
import ClubModerationLayout from "../../ModerationLayout";

export const runtime = "edge";

type Props = {
  params: Promise<{ userName: string }>;
};

export default function DiaryPage(props: Props) {
  const params = use(props.params);
  const userName = params?.userName?.[0];

  const searchParams = useSearchParams();
  const [openValue, setOpenValue] = useState<string | null>(null);
  const [diaryRecords, setDiaryRecords] = useState<DiaryRecordType[]>();
  const [hasMore, setHasMore] = useState(false);

  const sort = searchParams.get("sort") || "-createdAt";

  const handleFetchDiaryRecords = useCallback(async () => {
    try {
      const response = await fetchDiaryRecords({
        userName,
        sort,
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
  }, [diaryRecords, sort, hasMore]);

  useEffect(() => {
    if (!userName) return;

    handleFetchDiaryRecords();
  }, [sort, userName]);

  const noResults = !diaryRecords || diaryRecords.length === 0;

  return (
    <ClubModerationLayout
      header={
        <ClubHeader
          isDisabled={noResults}
          title={"Club"}
          pageType="diary"
          sortItems={diarySortItems}
          showReturn
        />
      }
      userName={userName}
      pageType="diary"
    >
      <DiaryContent
        diaryRecords={diaryRecords}
        openValue={openValue}
        setOpenValue={setOpenValue}
        hasMore={hasMore}
        handleFetchDiaryRecords={handleFetchDiaryRecords}
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
