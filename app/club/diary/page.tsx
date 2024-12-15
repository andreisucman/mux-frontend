"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import DiaryContent from "@/app/diary/DiaryContent";
import { DiaryRecordType } from "@/app/diary/type";
import fetchDiaryRecords from "@/functions/fetchDiaryRecords";
import { TypeEnum } from "@/types/global";
import ClubModerationLayout from "../ModerationLayout";

export default function DiaryPage() {
  const [openValue, setOpenValue] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const [diaryRecords, setDiaryRecords] = useState<DiaryRecordType[]>();
  const [hasMore, setHasMore] = useState(false);

  const type = searchParams.get("type") || TypeEnum.HEAD;

  useEffect(() => {
    fetchDiaryRecords({
      type,
      currentArrayLength: diaryRecords?.length,
      skip: hasMore,
    }).then((response) => {
      if (response.status === 200) {
        setDiaryRecords(response.message);
        if (response.message.length > 0) {
          setOpenValue(response.message[0]._id);
        }
        setHasMore(response.message.length === 9);
      }
    });
  }, [type]);

  return (
    <ClubModerationLayout>
      <DiaryContent diaryRecords={diaryRecords} openValue={openValue} setOpenValue={setOpenValue} />
    </ClubModerationLayout>
  );
}
