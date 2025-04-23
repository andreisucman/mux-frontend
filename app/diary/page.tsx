"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button, Loader, Stack, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import SkeletonWrapper from "@/app/SkeletonWrapper";
import { FilterItemType } from "@/components/FilterDropdown/types";
import PageHeader from "@/components/PageHeader";
import { UserContext } from "@/context/UserContext";
import { diarySortItems } from "@/data/sortItems";
import callTheServer from "@/functions/callTheServer";
import fetchDiaryRecords from "@/functions/fetchDiaryRecords";
import getFilters from "@/functions/getFilters";
import openFiltersCard, { FilterCardNamesEnum } from "@/functions/openFilterCard";
import askConfirmation from "@/helpers/askConfirmation";
import { useRouter } from "@/helpers/custom-router";
import openErrorModal from "@/helpers/openErrorModal";
import { normalizeString } from "@/helpers/utils";
import { TaskStatusEnum, TaskType } from "@/types/global";
import DiaryContent from "../../components/DiaryContent";
import SelectPartModalContent from "../../components/SelectPartModalContent";
import { DiaryType } from "./type";
import classes from "./diary.module.css";

export type HandleFetchDiaryProps = {
  dateFrom: string | null;
  dateTo: string | null;
  concern: string | null;
  sort: string | null;
  part: string | null;
};

export default function DiaryPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [tasks, setTasks] = useState<TaskType[]>();
  const [openValue, setOpenValue] = useState<string | null>(null);
  const { userDetails } = useContext(UserContext);
  const [diaryRecords, setDiaryRecords] = useState<DiaryType[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [disableAddNew, setDisableAddNew] = useState(true);
  const [availableConcerns, setAvailableConcerns] = useState<FilterItemType[]>([]);
  const [availableParts, setAvailableParts] = useState<FilterItemType[]>([]);

  const sort = searchParams.get("sort") || "-createdAt";
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");
  const part = searchParams.get("part");
  const concern = searchParams.get("concern");

  const { _id: userId } = userDetails || {};

  const createDiaryRecord = useCallback(
    async (part: string, concern: string) => {
      if (isLoading) return;
      setIsLoading(true);
      modals.closeAll();

      try {
        const response = await callTheServer({
          endpoint: "createDiaryRecord",
          method: "POST",
          body: { part, concern },
        });

        setIsLoading(false);

        if (response.status === 200) {
          if (response.error) {
            openErrorModal({ description: response.error });
            return;
          }

          const record = response.message;

          setDiaryRecords((prev: DiaryType[] | undefined) => {
            const exists = (prev || []).some((rec) => rec._id === record._id);
            if (exists) {
              return (prev || []).map((rec) => (rec._id === record._id ? record : rec));
            } else {
              return [record, ...(prev || [])];
            }
          });

          setOpenValue(record._id);
        }
      } catch (err) {
        setIsLoading(false);
      }
    },
    [isLoading]
  );

  const handleClickCreateRecord = useCallback(
    (part: string, concern: string, tasks: TaskType[]) => {
      const concernName = normalizeString(concern).toLowerCase();

      if (!tasks || (tasks && tasks.length === 0)) {
        openErrorModal({
          description: `You don't have any tasks for ${part} - ${concernName} today.`,
        });
        return;
      }

      const completedPartTasks = tasks.filter(
        (t) => t.part === part && t.concern === concern && t.status === TaskStatusEnum.COMPLETED
      );

      if (completedPartTasks.length === 0) {
        openErrorModal({
          description: `You haven't completed any tasks for ${part} - ${concernName} today.`,
        });
        modals.closeAll();
        return;
      }

      const todayMidnight = new Date();
      todayMidnight.setHours(0, 0, 0, 0);

      const activeTasks =
        tasks.filter((t) => {
          const taskMidnight = new Date(t.startsAt);
          taskMidnight.setHours(0, 0, 0, 0);

          return (
            t.status === TaskStatusEnum.ACTIVE &&
            t.part === part &&
            t.concern === concern &&
            taskMidnight.toDateString() === todayMidnight.toDateString()
          );
        }) || [];

      if (activeTasks.length > 0) {
        askConfirmation({
          title: "Confirm action",
          body: `You still have active ${part} - ${concern} tasks. Would you like to complete them first?`,
          onConfirm: () => {
            router.push("/tasks");
            modals.closeAll();
          },
          onCancel: () => createDiaryRecord(part, concern),
        });
      } else {
        createDiaryRecord(part, concern);
      }
    },
    [createDiaryRecord, tasks, userDetails]
  );

  const openSelectPartModal = useCallback(() => {
    modals.openContextModal({
      modal: "general",
      centered: true,
      classNames: { overlay: "overlay" },
      innerProps: (
        <SelectPartModalContent
          userId={userId}
          onClick={(part: string, concern: string) =>
            handleClickCreateRecord(part, concern, tasks || [])
          }
        />
      ),
      title: (
        <Title component={"p"} order={5}>
          Select part
        </Title>
      ),
    });
  }, [userId, tasks]);

  const handleFetchDiaryRecords = useCallback(
    async ({ dateFrom, dateTo, part, concern, sort }: HandleFetchDiaryProps) => {
      try {
        const message = await fetchDiaryRecords({
          sort,
          part,
          concern,
          dateFrom,
          dateTo,
          currentArrayLength: diaryRecords?.length,
          skip: hasMore,
        });

        const { data } = message;

        if (hasMore) {
          setDiaryRecords((prev) => [...(prev || []), ...data.slice(0, 20)]);
        } else {
          setDiaryRecords(data.slice(0, 20));
        }
        setOpenValue(data[0]?._id);
        setHasMore(data.length === 9);
      } catch (err) {}
    },
    [diaryRecords, hasMore]
  );

  const fetchTasks = useCallback(async () => {
    const response = await callTheServer({ endpoint: "getTasks", method: "GET" });

    if (response.status === 200) {
      setTasks(response.message);
    }
  }, []);

  useEffect(() => {
    handleFetchDiaryRecords({ dateFrom, dateTo, part, concern, sort });
    fetchTasks();
  }, [part, sort, concern, dateFrom, dateTo]);

  useEffect(() => {
    if (!diaryRecords) return;

    const dates = diaryRecords.map((r) => new Date(r.createdAt).toDateString());
    const exists = dates.includes(new Date().toDateString());
    setDisableAddNew(exists);
  }, [diaryRecords]);

  useEffect(() => {
    getFilters({
      collection: "diary",
      fields: ["part", "concerns"],
    }).then((result) => {
      const { part, concerns } = result;
      setAvailableParts(part);
      setAvailableConcerns(concerns);
    });
  }, []);

  const noPartsAndConcerns = availableParts?.length === 0 && availableConcerns?.length === 0;

  return (
    <Stack className={`${classes.container} smallPage`}>
      <SkeletonWrapper>
        <PageHeader
          disableFilter={!diaryRecords}
          title="Diary"
          sortItems={diarySortItems}
          disableSort={noPartsAndConcerns}
          defaultSortValue="-_id"
          filterNames={["dateFrom", "dateTo", "part", "concern"]}
          onFilterClick={() =>
            openFiltersCard({
              cardName: FilterCardNamesEnum.DiaryFilterCardContent,
              childrenProps: {
                partFilterItems: availableParts,
                concernFilterItems: availableConcerns,
              },
            })
          }
          nowrapTitle
        />
        <Button
          onClick={openSelectPartModal}
          disabled={disableAddNew || isLoading}
          loading={isLoading}
          size="compact-sm"
          variant="default"
        >
          Add a note for today
        </Button>
        <Stack className={classes.content}>
          {diaryRecords ? (
            <DiaryContent
              hasMore={hasMore}
              diaryRecords={diaryRecords}
              openValue={openValue}
              setDiaryRecords={setDiaryRecords}
              setOpenValue={setOpenValue}
              handleFetchDiaryRecords={() =>
                handleFetchDiaryRecords({ dateFrom, dateTo, part, concern, sort })
              }
            />
          ) : (
            <Loader
              m="0 auto"
              pt="30%"
              color="light-dark(var(--mantine-color-gray-4), var(--mantine-color-dark-4))"
            />
          )}
        </Stack>
      </SkeletonWrapper>
    </Stack>
  );
}
