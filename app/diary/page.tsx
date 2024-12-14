"use client";

import React, { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { IconCircleOff } from "@tabler/icons-react";
import InfiniteScroll from "react-infinite-scroller";
import { Loader, rem, Skeleton, Stack } from "@mantine/core";
import SkeletonWrapper from "@/app/SkeletonWrapper";
import OverlayWithText from "@/components/OverlayWithText";
import PageHeader from "@/components/PageHeader";
import callTheServer from "@/functions/callTheServer";
import { useRouter } from "@/helpers/custom-router";
import modifyQuery from "@/helpers/modifyQuery";
import openErrorModal from "@/helpers/openErrorModal";
import DiaryRow from "./DiaryRow";
import { DiaryRecordType } from "./type";
import classes from "./diary.module.css";

const fakeRows = [
  {
    _id: "",
    audio: "",
    text: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Excepturi nemo nam sint, laborum eaque, tenetur quod asperiores, expedita voluptatum aliquid nulla reprehenderit autem. Laborum numquam deleniti hic quaerat at, iste asperiores amet itaque quasi alias harum quis? Officia accusantium blanditiis quos. In aut nihil neque quas voluptate rem veritatis corrupti.",
    createdAt: "2024-12-13T18:24:38.188+00:00",
    tasks: [
      {
        name: "Lorem ipsum",
        description:
          "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Excepturi nemo nam sint, laborum eaque, tenetur quod asperiores, expedita voluptatum aliquid nulla reprehenderit autem.",
        completedAt: "2024-12-13T18:24:38.188+00:00",
        color: "#bc3bc3",
        icon: "💪",
        _id: "abc123",
        type: "head",
        key: "2",
      },
    ],
  },
];

const List = dynamic(() => import("masonic").then((mod) => mod.List), {
  ssr: false,
  loading: () => <Skeleton className="skeleton" visible></Skeleton>,
});

export default function DiaryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [diaryRecords, setDiaryRecords] = useState<DiaryRecordType[]>(fakeRows);
  const [hasMore, setHasMore] = useState(false);

  const type = searchParams.get("type");

  type FetchCompletedTasksProps = {
    type: string | null;
    loadMore?: boolean;
  };

  const fetchDiaryRecords = useCallback(
    async (props: FetchCompletedTasksProps | undefined) => {
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

  // useEffect(() => {
  //   fetchDiaryRecords({ type });
  // }, [type]);

  return (
    <Stack className={`${classes.container} smallPage`}>
      <SkeletonWrapper>
        <PageHeader
          title="Progress diary"
          onSelect={() => setDiaryRecords([])}
          showReturn
          hidePartDropdown
        />
        <Stack className={classes.content}>
          {diaryRecords ? (
            <>
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
                >
                  {diaryRecords && (
                    <List
                      items={diaryRecords}
                      rowGutter={16}
                      render={(props: any) => <DiaryRow data={props.data} index={props.index} />}
                    />
                  )}
                </InfiniteScroll>
              ) : (
                <OverlayWithText
                  text={`No diary records for ${type}`}
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
