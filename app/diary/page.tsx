"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button, Stack, Title } from "@mantine/core";
import SkeletonWrapper from "@/app/SkeletonWrapper";
import ChatWithModal from "@/components/ChatWithModal";
import Message from "@/components/Message";
import PageHeader from "@/components/PageHeader";
import { UserContext } from "@/context/UserContext";
import { diarySortItems } from "@/data/sortItems";
import callTheServer from "@/functions/callTheServer";
import fetchDiaryRecords from "@/functions/fetchDiaryRecords";
import openFiltersCard, { FilterCardNamesEnum } from "@/functions/openFilterCard";
import askConfirmation from "@/helpers/askConfirmation";
import { useRouter } from "@/helpers/custom-router";
import openErrorModal from "@/helpers/openErrorModal";
import setUtcMidnight from "@/helpers/setUtcMidnight";
import { UserDataType } from "@/types/global";
import DiaryContent from "./DiaryContent";
import { ChatCategoryEnum, DiaryRecordType } from "./type";
import classes from "./diary.module.css";

export type HandleFetchDiaryProps = {
  dateFrom: string | null;
  dateTo: string | null;
};

export default function DiaryPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [openValue, setOpenValue] = useState<string | null>(null);
  const { userDetails, setUserDetails } = useContext(UserContext);
  const [diaryRecords, setDiaryRecords] = useState<DiaryRecordType[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [disableAddNew, setDisableAddNew] = useState(true);

  const sort = searchParams.get("sort") || "-createdAt";
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");

  const { tasks, timeZone } = userDetails || {};

  const createDiaryRecord = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const response = await callTheServer({
        endpoint: "createDiaryRecord",
        method: "POST",
        body: { timeZone },
      });

      setIsLoading(false);

      if (response.status === 200) {
        if (response.error) {
          openErrorModal({ description: response.error });
          return;
        }

        const emptyDiaryRecord = {
          _id: "temp",
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
  }, [isLoading, timeZone]);

  const handleClickCreateRecord = useCallback(() => {
    if (!tasks) return;

    const activeTasks = tasks.filter((task) => task.status === "active") || [];

    if (activeTasks.length > 0) {
      const activeParts = [...new Set(activeTasks.map((t) => t.part))];
      if (activeParts.length > 1) activeParts.splice(activeParts.length - 1, 0, "and,");
      const activePartsString = activeParts.join(", ").split(",,").join(" ");

      askConfirmation({
        title: "Confirm action",
        body: `You still have active ${activePartsString} tasks. Would you like to complete them first?`,
        onConfirm: () => router.push("/tasks"),
        onCancel: createDiaryRecord,
      });
    } else {
      createDiaryRecord();
    }
  }, [createDiaryRecord, tasks]);

  const handleFetchDiaryRecords = async ({ dateFrom, dateTo }: HandleFetchDiaryProps) => {
    const response = await fetchDiaryRecords({
      sort,
      currentArrayLength: diaryRecords?.length,
      skip: hasMore,
      dateFrom,
      dateTo,
    });

    if (response.status === 200) {
      if (response.error) {
        openErrorModal({ description: response.error });
        return;
      }

      setDiaryRecords((prev) => {
        return hasMore ? [...(prev || []), ...response.message.slice(0, 20)] : response.message;
      });

      if (response.message.length > 0) {
        setOpenValue(response.message[0]._id);
      }

      setHasMore(response.message.length === 21);
    }
  };

  useEffect(() => {
    handleFetchDiaryRecords({ dateFrom, dateTo });
  }, [sort, dateFrom, dateTo]);

  useEffect(() => {
    if (!diaryRecords) return;
    if (!timeZone) return;
    const dates = diaryRecords.map((r) => new Date(r.createdAt).toDateString());
    const exists = dates.includes(new Date().toDateString());
    setDisableAddNew(exists);
  }, [diaryRecords]);

  return (
    <Stack className={`${classes.container} smallPage`}>
      <SkeletonWrapper>
        <PageHeader
          isDisabled={!diaryRecords}
          title="Diary"
          sortItems={diarySortItems}
          filterNames={["dateFrom", "dateTo"]}
          onFilterClick={() =>
            openFiltersCard({
              cardName: FilterCardNamesEnum.DiaryFilterCardContent,
            })
          }
          nowrapTitle
        />
        <Button
          onClick={handleClickCreateRecord}
          disabled={disableAddNew || isLoading}
          loading={isLoading}
        >
          Add a note for today
        </Button>
        <DiaryContent
          hasMore={hasMore}
          diaryRecords={diaryRecords}
          openValue={openValue}
          timeZone={timeZone}
          setDiaryRecords={setDiaryRecords}
          setOpenValue={setOpenValue}
          handleFetchDiaryRecords={() => handleFetchDiaryRecords({ dateFrom, dateTo })}
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
      </SkeletonWrapper>
    </Stack>
  );
}
