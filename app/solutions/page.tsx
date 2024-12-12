"use client";

import React, { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IconCircleOff, IconSearch } from "@tabler/icons-react";
import InfiniteScroll from "react-infinite-scroller";
import { Loader, rem, Skeleton, Stack } from "@mantine/core";
import { createSpotlight, Spotlight } from "@mantine/spotlight";
import MasonryComponent from "@/components/MasonryComponent";
import OverlayWithText from "@/components/OverlayWithText";
import PageHeader from "@/components/PageHeader";
import callTheServer from "@/functions/callTheServer";
import fetchAutocompleteData from "@/functions/fetchAutocompleteData";
import modifyQuery from "@/helpers/modifyQuery";
import openErrorModal from "@/helpers/openErrorModal";
import SolutionCard from "./SolutionCard";
import { SolutionCardType, SpotlightActionType } from "./types";
import classes from "./solutions.module.css";

export const runtime = "edge";

const [spotlightStore, solutionsSpotlight] = createSpotlight();

type FetchSolutionsProps = {
  skip?: boolean;
  name?: string;
  concern?: string | null;
  query?: string | null;
  solutions?: SolutionCardType[];
};

export default function Solutions() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [spotlightActions, setSpotlightActions] = useState<SpotlightActionType[]>([]);
  const [solutions, setSolutions] = useState<SolutionCardType[]>();

  const query = searchParams.get("query");

  const [hasMore, setHasMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState(query || "");

  const fetchSolutions = useCallback(async ({ skip, query, solutions }: FetchSolutionsProps) => {
    try {
      let finalEndpoint = "getAllSolutions";
      const queryParams = [];

      if (query) {
        queryParams.push(`query=${encodeURIComponent(query)}`);
      }

      if (skip && solutions && solutions.length > 0) {
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
        if (skip) {
          setSolutions([...(solutions || []), ...response.message.slice(0, 6)]);
        } else {
          setSolutions(response.message.slice(0, 6));
        }
        setHasMore(response.message.length === 7);
      } else {
        openErrorModal();
      }
    } catch (err) {
      console.log("Error in fetchSolutions: ", err);
    }
  }, []);

  const handleActionClick = useCallback(
    (value: string) => {
      const newQuery = modifyQuery({ params: [{ name: "query", value, action: "replace" }] });
      router.replace(`${pathname}?${newQuery}`);
      setSearchQuery(value);
    },
    [pathname]
  );

  const getAutocompleteData = useCallback(async () => {
    const { actions } = await fetchAutocompleteData({
      endpoint: "getAllSolutions",
      fields: ["name", "nearestConcerns"],
      handleActionClick,
    });

    console.log("actions", actions);

    setSpotlightActions(actions);
  }, [pathname]);

  const memoizedSolutionsCard = useCallback(
    (props: any) => <SolutionCard data={props.data} key={props.index} />,
    []
  );

  const handleSearch = useCallback(
    (searchQuery: string) => {
      const newQuery = modifyQuery({
        params: [{ name: "query", value: searchQuery, action: searchQuery ? "replace" : "delete" }],
      });
      router.replace(`${pathname}?${newQuery}`);
      solutionsSpotlight.close();
    },
    [pathname]
  );

  useEffect(() => {
    getAutocompleteData();
  }, []);

  useEffect(() => {
    fetchSolutions({ query });
  }, [query]);

  return (
    <>
      <Stack className={`${classes.container} largePage`}>
        <PageHeader
          title="Solutions"
          onSearchClick={() => solutionsSpotlight.open()}
          hideTypeDropdown
          hidePartDropdown
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
                loadMore={() => fetchSolutions({ skip: hasMore, query, solutions })}
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
      <Spotlight
        store={spotlightStore}
        actions={spotlightActions}
        nothingFound="Nothing found"
        onQueryChange={(query: string) => {
          if (query === "") {
            handleSearch(query);
          }
        }}
        searchProps={{
          leftSection: <IconSearch className="icon" stroke={1.5} />,
          placeholder: "Search...",
          value: searchQuery || "",
          onChange: (e: React.FormEvent<HTMLInputElement>) => setSearchQuery(e.currentTarget.value),
          onKeyDown: (e: React.KeyboardEvent) => {
            if (e.key !== "Enter") return;
            handleSearch(searchQuery || "");
          },
        }}
        centered
        clearQueryOnClose={false}
        overlayProps={{ blur: 0 }}
        limit={10}
      />
    </>
  );
}
