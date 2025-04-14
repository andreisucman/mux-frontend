"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IconCircleOff } from "@tabler/icons-react";
import InfiniteScroll from "react-infinite-scroller";
import { Loader, rem, Stack } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import ComparisonCarousel from "@/components/ComparisonCarousel";
import { ExistingFiltersType } from "@/components/FilterCardContent/FilterCardContent";
import FilterDropdown from "@/components/FilterDropdown";
import MasonryComponent from "@/components/MasonryComponent";
import OverlayWithText from "@/components/OverlayWithText";
import PageHeader from "@/components/PageHeader";
import callTheServer from "@/functions/callTheServer";
import openFiltersCard, { FilterCardNamesEnum } from "@/functions/openFilterCard";
import { normalizeString } from "@/helpers/utils";
import { BeforeAfterType } from "./types";
import classes from "./page.module.css";

type FetchBeforeAftersProps = {
  skip?: boolean;
  existingCount?: number;
};

const collectionMap: { [key: string]: string } = {
  "/": "progress",
  "/proof": "proof",
};

export default function BeforeAftersPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { ref, width } = useElementSize();
  const [beforeAfters, setBeforeAfters] = useState<BeforeAfterType[]>();
  const [hasMore, setHasMore] = useState(false);
  const [filters, setFilters] = useState<ExistingFiltersType>();

  const part = searchParams.get("part");
  const sex = searchParams.get("sex");
  const ageInterval = searchParams.get("ageInterval");
  const ethnicity = searchParams.get("ethnicity");
  const bodyType = searchParams.get("bodyType");
  const concern = searchParams.get("concern");

  const fetchBeforeAfters = useCallback(
    async (props?: FetchBeforeAftersProps) => {
      const { skip, existingCount } = props || {};
      setBeforeAfters(undefined);

      let finalEndpoint = "getBeforeAfters";
      const queryParams = [];

      if (skip && existingCount && existingCount > 0) {
        queryParams.push(`skip=${existingCount}`);
      }

      if (bodyType) {
        queryParams.push(`bodyType=${bodyType}`);
      }

      if (part) {
        queryParams.push(`part=${part}`);
      }

      if (sex) {
        queryParams.push(`sex=${sex}`);
      }

      if (ageInterval) {
        queryParams.push(`ageInterval=${ageInterval}`);
      }

      if (ethnicity) {
        queryParams.push(`ethnicity=${ethnicity}`);
      }

      if (concern) {
        queryParams.push(`concern=${concern}`);
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

  const getExistingFilters = useCallback(async (pathname: string) => {
    const response = await callTheServer({
      endpoint: `getExistingFilters/${collectionMap[pathname]}`,
      method: "GET",
    });

    if (response.status === 200) {
      const { concerns } = response.message || {};

      if (concerns && concerns[0]) {
        router.replace(`/${pathname}?concern=${concerns[0]}`);
      }

      setFilters(response.message);
    }
  }, []);

  const concernFilters = useMemo(() => {
    if (!filters) return [];
    return filters.concerns.map((c) => ({ value: c, label: normalizeString(c) }));
  }, [filters]);

  useEffect(() => {
    getExistingFilters(pathname);
  }, []);

  useEffect(() => {
    if (!concern) {
      setBeforeAfters([]);
      return;
    }
    fetchBeforeAfters();
  }, [part, sex, ageInterval, ethnicity, bodyType, concern]);

  return (
    <Stack className={`${classes.container} mediumPage`} ref={ref}>
      <PageHeader
        title="Results"
        filterNames={["part", "sex", "ageInterval", "ethnicity", "bodyType"]}
        isDisabled={!filters}
        children={
          <FilterDropdown
            data={concernFilters}
            selectedValue={concern}
            isDisabled={!filters}
            filterType="concern"
            placeholder="Select concern"
            addToQuery
          />
        }
        onFilterClick={() =>
          openFiltersCard({
            cardName: FilterCardNamesEnum.FilterCardContent,
            childrenProps: { filters },
          })
        }
        center
      />
      {beforeAfters ? (
        <>
          {beforeAfters.length > 0 ? (
            <InfiniteScroll
              loader={
                <Stack mb={rem(16)} key={0}>
                  <Loader m="auto" />
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
            <OverlayWithText text="Nothing found" icon={<IconCircleOff className="icon" />} />
          )}
        </>
      ) : (
        <Loader style={{ margin: "auto" }} />
      )}
    </Stack>
  );
}
