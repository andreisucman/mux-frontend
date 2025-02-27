"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconCircleOff } from "@tabler/icons-react";
import InfiniteScroll from "react-infinite-scroller";
import { Loader, rem, Stack } from "@mantine/core";
import { createSpotlight } from "@mantine/spotlight";
import MasonryComponent from "@/components/MasonryComponent";
import OverlayWithText from "@/components/OverlayWithText";
import PageHeader from "@/components/PageHeader";
import SearchButton from "@/components/SearchButton";
import callTheServer from "@/functions/callTheServer";
import openErrorModal from "@/helpers/openErrorModal";
import SolutionCard from "./SolutionCard";
import { SolutionCardType } from "./types";
import classes from "./solutions.module.css";

export const runtime = "edge";

type FetchSolutionsProps = {
  hasMore?: boolean;
  name?: string;
  concern?: string | null;
  query?: string | null;
  solutions?: SolutionCardType[];
};

const [spotlightStore, solutionsSpotlight] = createSpotlight();

export default function Solutions() {
  const searchParams = useSearchParams();
  const [solutions, setSolutions] = useState<SolutionCardType[]>();
  const [hasMore, setHasMore] = useState(false);

  const query = searchParams.get("query");

  const fetchSolutions = useCallback(
    async ({ hasMore, query, solutions }: FetchSolutionsProps) => {
      let finalEndpoint = "getAllSolutions";
      const queryParams = [];

      if (query) {
        queryParams.push(`query=${encodeURIComponent(query)}`);
      }

      if (hasMore && solutions && solutions.length > 0) {
        queryParams.push(`skip=${solutions.length}`);
      }

      if (queryParams.length > 0) {
        finalEndpoint += `?${queryParams.join("&")}`;
      }

      const response = await callTheServer({
        endpoint: finalEndpoint,
        method: "GET",
      });

      if (response.status === 200) {
        if (hasMore) {
          setSolutions((prev) => [...(prev || []), ...response.message.slice(0, 20)]);
        } else {
          setSolutions(response.message.slice(0, 20));
        }
        setHasMore(response.message.length === 21);
      } else {
        openErrorModal();
      }
    },
    [solutions]
  );

  const memoizedSolutionsCard = useCallback(
    (props: any) => <SolutionCard data={props.data} key={props.index} />,
    []
  );

  useEffect(() => {
    fetchSolutions({ query });
  }, [query]);

  return (
    <>
      <Stack className={`${classes.container} largePage`}>
        <PageHeader
          title="Solutions"
          children={
            <SearchButton
              spotlightStore={spotlightStore}
              spotlight={solutionsSpotlight}
              collection={"solution"}
              searchPlaceholder="Search solutions"
              showActivityIndicator
              forceEnabled
            />
          }
        />
        {solutions ? (
          <>
            {solutions.length > 0 ? (
              <InfiniteScroll
                loader={
                  <Stack mb={rem(16)} key={0}>
                    <Loader m="auto" />
                  </Stack>
                }
                loadMore={() => fetchSolutions({ hasMore, query, solutions })}
                useWindow={true}
                hasMore={hasMore}
                pageStart={0}
              >
                <MasonryComponent
                  maxColumnCount={3}
                  columnGutter={16}
                  columnWidth={300}
                  render={memoizedSolutionsCard}
                  items={solutions}
                />
              </InfiniteScroll>
            ) : (
              <OverlayWithText text="Nothing found" icon={<IconCircleOff className="icon" />} />
            )}
          </>
        ) : (
          <Loader style={{ margin: "0 auto", paddingTop: "15%" }} />
        )}
      </Stack>
    </>
  );
}
