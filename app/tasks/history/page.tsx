"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconCircleOff } from "@tabler/icons-react";
import InfiniteScroll from "react-infinite-scroller";
import { Loader, rem, Stack } from "@mantine/core";
import SkeletonWrapper from "@/app/SkeletonWrapper";
import { FilterItemType } from "@/components/FilterDropdown/types";
import ListComponent from "@/components/ListComponent";
import OverlayWithText from "@/components/OverlayWithText";
import PageHeader from "@/components/PageHeader";
import { historySortItems } from "@/data/sortItems";
import callTheServer from "@/functions/callTheServer";
import getFilters from "@/functions/getFilters";
import openFiltersCard, { FilterCardNamesEnum } from "@/functions/openFilterCard";
import { useRouter } from "next/navigation";
import InactiveTaskRow from "../TasksList/TaskRow/InactiveTaskRow";
import { InactiveTaskType } from "./type";
import classes from "./history.module.css";

type FetchInactiveTasksProps = {
  status: string | null;
  part: string | null;
  sort?: string | null;
  loadMore?: boolean;
};

export default function RoutinesHistoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [inactiveTasks, setInactiveTasks] = useState<InactiveTaskType[]>();
  const [hasMore, setHasMore] = useState(false);

  const part = searchParams.get("part");
  const status = searchParams.get("status");
  const sort = searchParams.get("sort");

  const [availableParts, setAvailableParts] = useState<FilterItemType[]>();
  const [availableStatuses, setAvailableStatuses] = useState<FilterItemType[]>([]);

  const fetchInactiveTasks = useCallback(
    async ({ status, part, loadMore, sort }: FetchInactiveTasksProps) => {
      try {
        let endpoint = "getInactiveTasks";

        const parts = [];

        if (status) parts.push(`status=${status}`);
        if (part) parts.push(`part=${part}`);
        if (sort) parts.push(`sort=${sort}`);

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
          setHasMore(newData.length === 41);
        }
      } catch (err) {}
    },
    [hasMore, inactiveTasks]
  );

  useEffect(() => {
    getFilters({
      collection: "task",
      filter: ["status=canceled", "status=expired", "status=completed"],
      fields: ["part", "status"],
    }).then((result) => {
      const { part, status } = result;
      setAvailableParts(part);
      setAvailableStatuses(status);
    });
  }, []);

  useEffect(() => {
    fetchInactiveTasks({ status, part, sort });
  }, [status, part, sort]);

  return (
    <Stack className={`${classes.container} smallPage`}>
      <SkeletonWrapper>
        <PageHeader
          title="Task history"
          filterNames={["part", "status"]}
          sortItems={historySortItems}
          defaultSortValue="-startsAt"
          disableFilter={!availableParts}
          disableSort={availableParts?.length === 0}
          onFilterClick={() =>
            openFiltersCard({
              cardName: FilterCardNamesEnum.HistoryFilterCardContent,
              childrenProps: {
                partItems: availableParts,
                statusItems: availableStatuses,
              },
            })
          }
        />
        <Stack className={classes.content}>
          {inactiveTasks ? (
            <>
              {inactiveTasks.length > 0 ? (
                <InfiniteScroll
                  loader={
                    <Stack mb={rem(16)} key={0}>
                      <Loader
                        type="oval"
                        m="auto"
                        color="light-dark(var(--mantine-color-gray-4), var(--mantine-color-dark-4))"
                      />
                    </Stack>
                  }
                  loadMore={() => fetchInactiveTasks({ status, part, loadMore: true })}
                  useWindow={false}
                  hasMore={hasMore}
                  pageStart={0}
                >
                  <ListComponent
                    items={inactiveTasks}
                    rowGutter={16}
                    render={(props: any) => {
                      const { key, ...rest } = props.data;
                      return <InactiveTaskRow {...rest} key={rest._id} />;
                    }}
                  />
                </InfiniteScroll>
              ) : (
                <OverlayWithText text={"Nothing found"} icon={<IconCircleOff className="icon" />} />
              )}
            </>
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
