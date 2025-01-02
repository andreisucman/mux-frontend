"use client";

import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconPlus } from "@tabler/icons-react";
import { Button, Stack } from "@mantine/core";
import SkeletonWrapper from "@/app/SkeletonWrapper";
import { typeItems } from "@/components/PageHeader/data";
import PageHeaderWithReturn from "@/components/PageHeaderWithReturn";
import { UserContext } from "@/context/UserContext";
import { diarySortItems } from "@/data/sortItems";
import callTheServer from "@/functions/callTheServer";
import fetchDiaryRecords from "@/functions/fetchDiaryRecords";
import { formatDate } from "@/helpers/formatDate";
import { typeIcons } from "@/helpers/icons";
import openErrorModal from "@/helpers/openErrorModal";
import setUtcMidnight from "@/helpers/setUtcMidnight";
import { TypeEnum, UserDataType } from "@/types/global";
import DiaryContent from "./DiaryContent";
import { DiaryRecordType } from "./type";
import classes from "./diary.module.css";

export default function DiaryPage() {
  const [openValue, setOpenValue] = useState<string | null>(null);
  const { userDetails, setUserDetails } = useContext(UserContext);
  const searchParams = useSearchParams();
  const [diaryRecords, setDiaryRecords] = useState<DiaryRecordType[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [disableAddNew, setDisableAddNew] = useState(true);

  const type = searchParams.get("type") || TypeEnum.HEAD;
  const sort = searchParams.get("sort") || "createdAt";

  const { timeZone } = userDetails || {};

  const formattedToday = useMemo(() => formatDate({ date: new Date() }), []);

  const createDiaryRecord = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const response = await callTheServer({
        endpoint: "createDiaryRecord",
        method: "POST",
        body: { type, timeZone },
      });

      setIsLoading(false);

      if (response.status === 200) {
        if (response.error) {
          openErrorModal({ description: response.error });
          return;
        }

        const emptyDiaryRecord = {
          _id: "temp",
          type,
          audio: null,
          transcription: null,
          createdAt: new Date(),
          activity: response.message,
        };

        setDiaryRecords((prev: DiaryRecordType[] | undefined) => [
          emptyDiaryRecord,
          ...(prev || []),
        ]);
        setOpenValue(emptyDiaryRecord._id);

        const defaultTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        const nextDiaryRecordAfter = setUtcMidnight({
          date: new Date(),
          isNextDay: true,
          timeZone: timeZone || defaultTimeZone,
        });

        setUserDetails((prev: UserDataType) => ({ ...prev, nextDiaryRecordAfter }));
      }
    } catch (err) {
      setIsLoading(false);
    }
  }, [isLoading, timeZone, type, sort]);

  const handleFetchDiaryRecords = useCallback(async () => {
    const response = await fetchDiaryRecords({
      type,
      sort,
      currentArrayLength: diaryRecords?.length,
      skip: hasMore,
    });

    if (response.status === 200) {
      if (response.error) {
        openErrorModal({ description: response.error });
        return;
      }
      setDiaryRecords((prev) => [...(prev || []), ...response.message.slice(0, 20)]);

      if (response.message.length > 0) {
        setOpenValue(response.message[0]._id);
      }

      setHasMore(response.message.length === 21);
    }
  }, [diaryRecords, hasMore, type, sort]);

  useEffect(() => {
    handleFetchDiaryRecords();
  }, [type, sort]);

  useEffect(() => {
    if (!diaryRecords) return;
    const firstDate = diaryRecords[0] && diaryRecords[0].createdAt;
    const formattedFirstDate = formatDate({ date: firstDate || new Date(0) });
    setDisableAddNew(formattedFirstDate === formattedToday);
  }, [formattedToday, diaryRecords]);

  return (
    <Stack className={`${classes.container} smallPage`}>
      <SkeletonWrapper>
        <PageHeaderWithReturn
          title="Diary"
          filterData={typeItems}
          icons={typeIcons}
          selectedValue={type}
          sortItems={diarySortItems}
          nowrap
          showReturn
        />
        <Button
          onClick={createDiaryRecord}
          disabled={disableAddNew || isLoading}
          loading={isLoading}
        >
          <IconPlus className={`${classes.icon} icon`} /> Add a note for today
        </Button>
        <DiaryContent
          hasMore={hasMore}
          diaryRecords={diaryRecords}
          openValue={openValue}
          timeZone={timeZone}
          setDiaryRecords={setDiaryRecords}
          setOpenValue={setOpenValue}
          handleFetchDiaryRecords={handleFetchDiaryRecords}
        />
      </SkeletonWrapper>
    </Stack>
  );
}
