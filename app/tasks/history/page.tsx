"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconCircleOff } from "@tabler/icons-react";
import InfiniteScroll from "react-infinite-scroller";
import { Loader, rem, Stack } from "@mantine/core";
import SkeletonWrapper from "@/app/SkeletonWrapper";
import { FilterPartItemType } from "@/components/FilterDropdown/types";
import ListComponent from "@/components/ListComponent";
import OverlayWithText from "@/components/OverlayWithText";
import PageHeader from "@/components/PageHeader";
import callTheServer from "@/functions/callTheServer";
import getFilters from "@/functions/getFilters";
import openFiltersCard, { FilterCardNamesEnum } from "@/functions/openFilterCard";
import { useRouter } from "@/helpers/custom-router";
import openErrorModal from "@/helpers/openErrorModal";
import InactiveTaskRow from "../TasksList/TaskRow/InactiveTaskRow";
import { InactiveTaskType } from "./type";
import classes from "./history.module.css";
import { historySortItems } from "@/data/sortItems";

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

  const [availableParts, setAvaiableParts] = useState<FilterPartItemType[]>([]);
  const [availableStatuses, setAvailableStatuses] = useState<FilterPartItemType[]>([]);

  useEffect(() => {
    getFilters({
      collection: "task",
      filter: ["status=canceled", "status=expired", "status=completed"],
      fields: ["part", "status"],
    }).then((result) => {
      const { availableParts, availableStatuses } = result;
      setAvaiableParts(availableParts);
      setAvailableStatuses(availableStatuses);
    });
  }, []);

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
          if (response.message.length === 0) {
            router.replace("/tasks/history");
          }

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
    fetchInactiveTasks({ status, part, sort });
  }, [status, part, sort]);

  const isFilterDisabled = availableParts.length + availableStatuses.length === 0;

  return (
    <Stack className={`${classes.container} smallPage`}>
      <SkeletonWrapper>
        <PageHeader
          title="Task history"
          filterNames={["part", "status"]}
          sortItems={historySortItems}
          isDisabled={isFilterDisabled}
          onFilterClick={() =>
            openFiltersCard({
              cardName: FilterCardNamesEnum.HistoryFilterCardContent,
              childrenProps: {
                partItems: availableParts,
                statusItems: availableStatuses,
              },
            })
          }
          showReturn
        />
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
                  loadMore={() => fetchInactiveTasks({ status, part, loadMore: true })}
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
