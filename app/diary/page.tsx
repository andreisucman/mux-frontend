"use client";

import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconPlus } from "@tabler/icons-react";
import { Button, Stack } from "@mantine/core";
import SkeletonWrapper from "@/app/SkeletonWrapper";
import { typeItems } from "@/components/PageHeader/data";
import PageHeaderWithReturn from "@/components/PageHeaderWithReturn";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import fetchDiaryRecords from "@/functions/fetchDiaryRecords";
import { formatDate } from "@/helpers/formatDate";
import { typeIcons } from "@/helpers/icons";
import openErrorModal from "@/helpers/openErrorModal";
import { TypeEnum } from "@/types/global";
import DiaryContent from "./DiaryContent";
import { DiaryRecordType } from "./type";
import classes from "./diary.module.css";

export default function DiaryPage() {
  const [openValue, setOpenValue] = useState<string | null>(null);
  const { userDetails } = useContext(UserContext);
  const searchParams = useSearchParams();
  const [diaryRecords, setDiaryRecords] = useState<DiaryRecordType[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [disableAddNew, setDisableAddNew] = useState(true);

  const type = searchParams.get("type") || TypeEnum.HEAD;
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

      if (response.status === 200) {
        setIsLoading(false);
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
      } else {
        setIsLoading(false);
        openErrorModal();
      }
    } catch (err) {
      setIsLoading(false);
      openErrorModal();
      console.log("Error in createDiaryRecord: ", err);
    }
  }, [isLoading, timeZone, type]);

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

  useEffect(() => {
    if (!diaryRecords || !diaryRecords[0]) return;
    const firstDate = diaryRecords[0].createdAt;
    const formattedFirstDate = formatDate({ date: firstDate });
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
          isLoading={isLoading}
          openValue={openValue}
          setOpenValue={setOpenValue}
          handleFetchDiaryRecords={handleFetchDiaryRecords}
        />
      </SkeletonWrapper>
    </Stack>
  );
}
