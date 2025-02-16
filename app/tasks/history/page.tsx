"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconCircleOff } from "@tabler/icons-react";
import InfiniteScroll from "react-infinite-scroller";
import { Loader, rem, Stack } from "@mantine/core";
import SkeletonWrapper from "@/app/SkeletonWrapper";
import ListComponent from "@/components/ListComponent";
import OverlayWithText from "@/components/OverlayWithText";
import callTheServer from "@/functions/callTheServer";
import { useRouter } from "@/helpers/custom-router";
import openErrorModal from "@/helpers/openErrorModal";
import InactiveTaskRow from "../TasksList/TaskRow/InactiveTaskRow";
import HistoryHeader from "./HistoryHeader";
import { InactiveTaskType } from "./type";
import classes from "./history.module.css";

export default function RoutinesHistoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [inactiveTasks, setInactiveTasks] = useState<InactiveTaskType[]>();
  const [hasMore, setHasMore] = useState(false);

  const status = searchParams.get("status");
  const part = searchParams.get("part");

  const fetchInactiveTasks = useCallback(
    async (status: string | null, part: string | null, loadMore?: boolean) => {
      try {
        let endpoint = "getInactiveTasks";

        const parts = [];

        if (status) parts.push(`status=${status}`);
        if (part) parts.push(`part=${part}`);

        if (loadMore && inactiveTasks) {
          parts.push(`skip=${inactiveTasks.length}`);
        }

        const query = parts.join("&");
        endpoint += `?${query}`;

        const response = await callTheServer({
          endpoint,
          method: "GET",
        });

        if (response.status === 200) {
          const newData = response.message.map((record: InactiveTaskType) => ({
            ...record,
            onClick: () => {
              router.push(`/explain/${record._id}?${searchParams.toString()}`);
            },
          }));

          if (loadMore) {
            setInactiveTasks((prev) => [...(prev || []), ...newData]);
          } else {
            setInactiveTasks(newData);
          }
          setHasMore(newData.length === 9);
        }
      } catch (err) {
        openErrorModal();
      }
    },
    [hasMore, inactiveTasks]
  );

  useEffect(() => {
    fetchInactiveTasks(status, part);
  }, [status, part]);

  return (
    <Stack className={`${classes.container} smallPage`}>
      <SkeletonWrapper>
        <HistoryHeader title="Tasks history" selectedStatus={status} selectedPart={part} />
        <Stack className={classes.content}>
          {inactiveTasks ? (
            <>
              {inactiveTasks.length > 0 ? (
                <InfiniteScroll
                  loader={
                    <Stack mb={rem(16)} key={0}>
                      <Loader type="oval" m="auto" />
                    </Stack>
                  }
                  loadMore={() => fetchInactiveTasks(status, part, true)}
                  useWindow={false}
                  hasMore={hasMore}
                  pageStart={0}
                >
                  {inactiveTasks && (
                    <ListComponent
                      items={inactiveTasks}
                      rowGutter={16}
                      render={(props: any) => {
                        const { key, ...rest } = props.data;
                        return <InactiveTaskRow {...rest} key={key} />;
                      }}
                    />
                  )}
                </InfiniteScroll>
              ) : (
                <OverlayWithText text={`Nothing found`} icon={<IconCircleOff className="icon" />} />
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
