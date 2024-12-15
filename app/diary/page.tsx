"use client";

import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { IconCircleOff, IconPlus } from "@tabler/icons-react";
import InfiniteScroll from "react-infinite-scroller";
import { Button, Loader, rem, Skeleton, Stack } from "@mantine/core";
import SkeletonWrapper from "@/app/SkeletonWrapper";
import OverlayWithText from "@/components/OverlayWithText";
import { typeItems } from "@/components/PageHeader/data";
import PageHeaderWithReturn from "@/components/PageHeaderWithReturn";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import { useRouter } from "@/helpers/custom-router";
import { formatDate } from "@/helpers/formatDate";
import { typeIcons } from "@/helpers/icons";
import openErrorModal from "@/helpers/openErrorModal";
import { TypeEnum } from "@/types/global";
import DiaryRow from "./DiaryRow";
import { DiaryRecordType } from "./type";
import classes from "./diary.module.css";

const List = dynamic(() => import("masonic").then((mod) => mod.List), {
  ssr: false,
  loading: () => <Skeleton className="skeleton" visible></Skeleton>,
});

export default function DiaryPage() {
  const router = useRouter();
  const { userDetails } = useContext(UserContext);
  const searchParams = useSearchParams();
  const [diaryRecords, setDiaryRecords] = useState<DiaryRecordType[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const type = searchParams.get("type") || TypeEnum.HEAD;
  const { timeZone } = userDetails || {};

  const formattedToday = useMemo(() => formatDate({ date: new Date() }), []);

  const disableAddNew = useMemo(() => {
    if (!diaryRecords || !diaryRecords[0]) return;
    const firstDate = diaryRecords[0].createdAt;
    const formattedFirstDate = formatDate({ date: firstDate });
    return formattedFirstDate === formattedToday;
  }, [formattedToday, diaryRecords]);

  type FetchDiaryRecordsProps = {
    type: string | null;
    loadMore?: boolean;
  };

  const fetchDiaryRecords = useCallback(
    async (props: FetchDiaryRecordsProps | undefined) => {
      const { loadMore, type } = props || {};
      try {
        let endpoint = "getDiaryRecords";

        const parts = [];

        if (loadMore && diaryRecords) {
          parts.push(`skip=${diaryRecords.length}`);
        }
        if (type) {
          parts.push(`type=${type}`);
        }

        const query = parts.join("&");
        endpoint += `?${query}`;

        const response = await callTheServer({
          endpoint,
          method: "GET",
        });

        if (response.status === 200) {
          setDiaryRecords(response.message);
          setHasMore(response.message.length === 9);
        }
      } catch (err) {
        openErrorModal();
        console.log("Error in fetchDiaryRecords: ", err);
      }
    },
    [type, hasMore, diaryRecords?.length]
  );

  const createDiaryRecord = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const response = await callTheServer({
        endpoint: "createDiaryRecord",
        method: "POST",
        body: { type, timeZone },
      });

      console.log("respnse", response);

      if (response.status === 200) {
        setIsLoading(false);
        if (response.error) {
          openErrorModal({ description: response.error });
          return;
        }

        const emptyDiaryRecord = {
          _id: null,
          type,
          audio: null,
          transcription: null,
          createdAt: new Date(),
          tasks: response.message,
        };

        setDiaryRecords((prev: DiaryRecordType[] | undefined) => [
          emptyDiaryRecord,
          ...(prev || []),
        ]);
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

  const memoizedDiaryRow = useCallback(
    (props: any) => <DiaryRow data={props.data} index={props.index} type={type as TypeEnum} />,
    [type, isLoading, diaryRecords]
  );

  useEffect(() => {
    fetchDiaryRecords({ type });
  }, [type]);

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
        <Stack className={classes.content}>
          {diaryRecords ? (
            <>
              {
                <Button
                  onClick={createDiaryRecord}
                  disabled={disableAddNew || isLoading}
                  loading={isLoading}
                >
                  <IconPlus className={`${classes.icon} icon`} /> Add a note for today
                </Button>
              }
              {diaryRecords.length > 0 ? (
                <InfiniteScroll
                  loader={
                    <Stack mb={rem(16)} key={0}>
                      <Loader type="oval" m="auto" />
                    </Stack>
                  }
                  loadMore={() => fetchDiaryRecords({ type, loadMore: true })}
                  useWindow={true}
                  hasMore={hasMore}
                  pageStart={0}
                  className={classes.infiniteScroll}
                >
                  {diaryRecords && (
                    <List items={diaryRecords} rowGutter={16} render={memoizedDiaryRow} className={classes.list} />
                  )}
                </InfiniteScroll>
              ) : (
                <OverlayWithText
                  text={`No diary notes for ${type}`}
                  icon={<IconCircleOff className="icon" />}
                />
              )}
            </>
          ) : (
            <Loader style={{ margin: "0 auto", paddingTop: "15%" }} />
          )}
        </Stack>
      </SkeletonWrapper>
    </Stack>
  );
}
