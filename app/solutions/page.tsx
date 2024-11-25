"use client";

import React, { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IconCircleOff, IconSearch } from "@tabler/icons-react";
import InfiniteScroll from "react-infinite-scroller";
import { Loader, rem, Stack } from "@mantine/core";
import { createSpotlight, Spotlight } from "@mantine/spotlight";
import MasonryComponent from "@/components/MasonryComponent";
import OverlayWithText from "@/components/OverlayWithText";
import PageHeader from "@/components/PageHeader";
import callTheServer from "@/functions/callTheServer";
import modifyQuery from "@/helpers/modifyQuery";
import openErrorModal from "@/helpers/openErrorModal";
import { normalizeString } from "@/helpers/utils";
import SolutionCard from "./SolutionCard";
import { SolutionCardType } from "./types";
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

type SpotlightActionType = {
  id: string;
  label: string;
  leftSection: React.ReactNode;
  onClick: () => void;
};

export default function Solutions() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [spotlightActions, setSpotlightActions] = useState<SpotlightActionType[]>([]);
  const [solutions, setSolutions] = useState<SolutionCardType[]>();
  const [hasMore, setHasMore] = useState(false);

  const query = searchParams.get("query");

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

      console.log("finalEndpoint", finalEndpoint);

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

  const handleActionClick = useCallback((value: string) => {
    const newQuery = modifyQuery({ params: [{ name: "query", value, action: "replace" }] });
    router.replace(`${pathname}?${newQuery}`);
  }, []);

  const getAutocompleteData = useCallback(async () => {
    try {
      const response = await callTheServer({
        endpoint: `getAllSolutions?fields=name,nearestConcerns`,
        method: "GET",
      });
      if (response.status === 200) {
        if (response.message) {
          const actions = [];

          const uniqueConcerns = [
            ...new Set(
              response.message.flatMap((obj: { nearestConcerns: string[] }) => obj.nearestConcerns)
            ),
          ] as string[];

          for (const concern of uniqueConcerns) {
            actions.push({
              id: concern,
              label: normalizeString(concern).toLowerCase(),
              leftSection: <IconSearch className={"icon"} stroke={1.5} />,
              onClick: () => handleActionClick(concern),
            });
          }

          const uniqueNames = [
            ...new Set(response.message.map((obj: { name: string }) => obj.name)),
          ] as string[];

          for (const name of uniqueNames) {
            actions.push({
              id: name,
              label: name,
              leftSection: <IconSearch className={"icon"} stroke={1.5} />,
              onClick: () => handleActionClick(name),
            });
          }

          setSpotlightActions(actions);
        }
      }
    } catch (err) {
      console.log("Error in getAutocompleteData: ", err);
    }
  }, []);

  const memoizedSolutionsCard = useCallback(
    (props: any) => <SolutionCard data={props.data} key={props.index} />,
    []
  );

  useEffect(() => {
    getAutocompleteData();
  }, []);

  useEffect(() => {
    fetchSolutions({ query });
  }, [query]);

  return (
    <>
      <Stack className={classes.container}>
        <PageHeader
          title="Solutions"
          onSearchClick={() => solutionsSpotlight.open()}
          showReturn
          hideDropdown
        />
        {solutions ? (
          <>
            {solutions.length > 0 ? (
              <InfiniteScroll
                loader={
                  <Stack mb={rem(16)} key={0}>
                    <Loader type="oval" m="auto" />
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
              <OverlayWithText
                text="No solutions found"
                icon={<IconCircleOff className="icon" />}
              />
            )}
          </>
        ) : (
          <Loader m="auto" />
        )}
      </Stack>
      <Spotlight
        store={spotlightStore}
        actions={spotlightActions}
        nothingFound="Nothing found..."
        searchProps={{
          leftSection: <IconSearch className="icon" stroke={1.5} />,
          placeholder: "Search...",
        }}
        highlightQuery
        overlayProps={{ blur: 0 }}
        limit={10}
      />
    </>
  );
}
