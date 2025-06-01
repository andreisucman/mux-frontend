"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconCircleOff } from "@tabler/icons-react";
import cn from "classnames";
import InfiniteScroll from "react-infinite-scroller";
import { Loader, rem, Stack } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import ComparisonCarousel from "@/components/ComparisonCarousel";
import ConcernSearchComponent from "@/components/ConcernSearchComponent";
import MasonryComponent from "@/components/MasonryComponent";
import OverlayWithText from "@/components/OverlayWithText";
import callTheServer from "@/functions/callTheServer";
import { BeforeAfterType } from "./types";
import classes from "./page.module.css";

type FetchBeforeAftersProps = {
  skip?: boolean;
  existingCount?: number;
};

export const runtime = "edge";

export default function BeforeAftersPage() {
  const searchParams = useSearchParams();
  const { ref, width } = useElementSize();
  const [beforeAfters, setBeforeAfters] = useState<BeforeAfterType[]>();
  const [hasMore, setHasMore] = useState(false);

  const part = searchParams.get("part");
  const sex = searchParams.get("sex");
  const ageInterval = searchParams.get("ageInterval");
  const ethnicity = searchParams.get("ethnicity");
  const bodyType = searchParams.get("bodyType");
  const concern = searchParams.get("concern");
  const query = searchParams.get("query");

  const fetchBeforeAfters = useCallback(
    async (props?: FetchBeforeAftersProps) => {
      const { skip, existingCount } = props || {};

      let finalEndpoint = "getBeforeAfters";
      const urlSearchParams = new URLSearchParams();

      if (query) {
        urlSearchParams.set("query", query);
      }

      if (skip && existingCount && existingCount > 0) {
        urlSearchParams.set("skip", String(existingCount));
      }

      if (bodyType) {
        urlSearchParams.set("bodyType", bodyType);
      }

      if (part) {
        urlSearchParams.set("part", part);
      }

      if (sex) {
        urlSearchParams.set("sex", sex);
      }

      if (ageInterval) {
        urlSearchParams.set("ageInterval", ageInterval);
      }

      if (ethnicity) {
        urlSearchParams.set("ethnicity", ethnicity);
      }

      if (concern) {
        urlSearchParams.set("concern", concern);
      }

      if (urlSearchParams.toString()) {
        finalEndpoint += `?${urlSearchParams.toString()}`;
      }

      const response = await callTheServer({
        endpoint: finalEndpoint,
        method: "GET",
      });

      if (response.status === 200) {
        if (skip) {
          setBeforeAfters((prev) => [...(prev || []), ...response.message.slice(0, 20)]);
        } else {
          setBeforeAfters(response.message.slice(0, 20));
        }
        setHasMore(response.message.length === 21);
      }
    },
    [beforeAfters, searchParams.toString()]
  );

  const memoizedComparisonCarousel = useCallback(
    (props: any) => <ComparisonCarousel data={props.data} key={props.index} />,
    [searchParams.toString(), width]
  );

  useEffect(() => {
    fetchBeforeAfters();
  }, [part, sex, query, ageInterval, ethnicity, bodyType, concern]);

  return (
    <>
      <Stack className={cn(classes.container, "mediumPage")} ref={ref}>
        <ConcernSearchComponent
          filterNames={["part", "sex", "ageInterval", "ethnicity", "bodyType", "concern"]}
        />
        {beforeAfters ? (
          <>
            {beforeAfters.length > 0 ? (
              <InfiniteScroll
                loader={
                  <Stack mb={rem(16)} key={0}>
                    <Loader
                      m="auto"
                      color="light-dark(var(--mantine-color-gray-4), var(--mantine-color-dark-4))"
                    />
                  </Stack>
                }
                loadMore={() =>
                  fetchBeforeAfters({ skip: hasMore, existingCount: beforeAfters.length })
                }
                useWindow={true}
                hasMore={hasMore}
                pageStart={0}
              >
                <MasonryComponent
                  maxColumnCount={1}
                  columnGutter={16}
                  columnWidth={300}
                  render={memoizedComparisonCarousel}
                  items={beforeAfters}
                />
              </InfiniteScroll>
            ) : (
              <OverlayWithText text="Nothing found" icon={<IconCircleOff size={20} />} />
            )}
          </>
        ) : (
          <Loader
            m="0 auto"
            pt="20%"
            color="light-dark(var(--mantine-color-gray-4), var(--mantine-color-dark-4))"
          />
        )}
      </Stack>
    </>
  );
}
