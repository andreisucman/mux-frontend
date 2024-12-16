"use client";

import React, { use, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import DiaryContent from "@/app/diary/DiaryContent";
import { DiaryRecordType } from "@/app/diary/type";
import fetchDiaryRecords from "@/functions/fetchDiaryRecords";
import openErrorModal from "@/helpers/openErrorModal";
import { TypeEnum } from "@/types/global";
import ClubModerationLayout from "../../ModerationLayout";

type Props = {
  params: Promise<{ userName: string }>;
};

export default function DiaryPage(props: Props) {
  const params = use(props.params);
  const { userName } = params;

  const searchParams = useSearchParams();
  const [openValue, setOpenValue] = useState<string | null>(null);
  const [diaryRecords, setDiaryRecords] = useState<DiaryRecordType[]>();
  const [hasMore, setHasMore] = useState(false);

  const type = searchParams.get("type") || TypeEnum.HEAD;

  const handleFetchDiaryRecords = useCallback(async () => {
    try {
      const response = await fetchDiaryRecords({
        type,
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
  }, [diaryRecords, hasMore, type]);

  useEffect(() => {
    handleFetchDiaryRecords();
  }, [type]);

  return (
    <ClubModerationLayout userName={userName} pageType="diary">
      <DiaryContent
        diaryRecords={diaryRecords}
        openValue={openValue}
        setOpenValue={setOpenValue}
        hasMore={hasMore}
        handleFetchDiaryRecords={handleFetchDiaryRecords}
      />
    </ClubModerationLayout>
  );
}
