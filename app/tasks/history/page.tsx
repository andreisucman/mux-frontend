"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconCircleOff } from "@tabler/icons-react";
import { List } from "masonic";
import InfiniteScroll from "react-infinite-scroller";
import { Loader, rem, Stack } from "@mantine/core";
import SkeletonWrapper from "@/app/SkeletonWrapper";
import OverlayWithText from "@/components/OverlayWithText";
import PageHeader from "@/components/PageHeader";
import callTheServer from "@/functions/callTheServer";
import { useRouter } from "@/helpers/custom-router";
import modifyQuery from "@/helpers/modifyQuery";
import openErrorModal from "@/helpers/openErrorModal";
import CompletedTaskRow from "../TasksList/TaskRow/CompletedTaskRow";
import { CompletedTaskType } from "./type";
import classes from "./history.module.css";

export default function RoutinesHistoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [completedTasks, setCompletedTasks] = useState<CompletedTaskType[]>();
  const [hasMore, setHasMore] = useState(false);

  const type = searchParams.get("type") || "head";

  type FetchCompletedTasksProps = {
    type: string | null;
    loadMore?: boolean;
  };

  const fetchCompletedTasks = useCallback(
    async (props: FetchCompletedTasksProps | undefined) => {
      const { loadMore, type } = props || {};
      try {
        let endpoint = "getCompletedTasks";

        const parts = [];

        if (loadMore && completedTasks) {
          parts.push(`skip=${completedTasks.length}`);
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
          const newData = response.message.map((record: CompletedTaskType) => ({
            ...record,
            onClick: () => {
              const query = modifyQuery({
                params: [{ name: "taskId", value: record._id, action: "replace" }],
              });
              router.push(`/explain?${query}`);
            },
          }));
          setCompletedTasks((prev) => [...(prev || []), ...newData]);
          setHasMore(newData.length === 9);
        }
      } catch (err) {
        openErrorModal();
        console.log("Error in fetchCompletedTasks: ", err);
      }
    },
    [type, hasMore, completedTasks?.length]
  );

  useEffect(() => {
    fetchCompletedTasks({ type });
  }, [type]);

  return (
    <Stack className={`${classes.container} smallPage`}>
      <SkeletonWrapper>
        <PageHeader
          title="Tasks history"
          onSelect={() => setCompletedTasks([])}
          showReturn
          hidePartDropdown
        />
        <Stack className={classes.content}>
          {completedTasks ? (
            <>
              {completedTasks.length > 0 ? (
                <InfiniteScroll
                  loader={
                    <Stack mb={rem(16)} key={0}>
                      <Loader type="oval" m="auto" />
                    </Stack>
                  }
                  loadMore={() => fetchCompletedTasks({ type, loadMore: true })}
                  useWindow={false}
                  hasMore={hasMore}
                  pageStart={0}
                >
                  {completedTasks && (
                    <List
                      items={completedTasks}
                      rowGutter={16}
                      render={(props: any) => {
                        const { key, ...rest } = props.data;
                        return <CompletedTaskRow {...rest} key={key} />;
                      }}
                    />
                  )}
                </InfiniteScroll>
              ) : (
                <OverlayWithText
                  text={`No tasks completed for ${type}`}
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
