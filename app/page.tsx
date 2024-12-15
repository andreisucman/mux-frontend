"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconCircleOff } from "@tabler/icons-react";
import InfiniteScroll from "react-infinite-scroller";
import { Loader, rem, Stack } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import ComparisonCarousel from "@/components/ComparisonCarousel";
import MasonryComponent from "@/components/MasonryComponent";
import OverlayWithText from "@/components/OverlayWithText";
import callTheServer from "@/functions/callTheServer";
import openErrorModal from "@/helpers/openErrorModal";
import GeneralResultsHeader from "./GeneralResultsHeader";
import { SimpleBeforeAfterType } from "./types";
import classes from "./page.module.css";

type FetchBeforeAftersProps = {
  skip?: boolean;
  existingCount?: number;
};

export default function BeforeAftersPage() {
  const searchParams = useSearchParams();
  const { ref, width } = useElementSize();
  const [beforeAfters, setBeforeAfters] = useState<SimpleBeforeAfterType[]>();
  const [hasMore, setHasMore] = useState(false);

  const type = searchParams.get("type");
  const part = searchParams.get("part");
  const sex = searchParams.get("sex");
  const ageInterval = searchParams.get("ageInterval");
  const ethnicity = searchParams.get("ethnicity");
  const bodyType = searchParams.get("bodyType");
  const concern = searchParams.get("concern");

  const fetchBeforeAfters = useCallback(
    async (props?: FetchBeforeAftersProps) => {
      const { skip, existingCount } = props || {};
      try {
        setBeforeAfters(undefined);

        let finalEndpoint = "getBeforeAfters";
        const queryParams = [];

        if (skip && existingCount && existingCount > 0) {
          queryParams.push(`skip=${existingCount}`);
        }

        if (type) {
          queryParams.push(`type=${type}`);
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
            setBeforeAfters([...(beforeAfters || []), ...response.message.slice(0, 20)]);
          } else {
            setBeforeAfters(response.message.slice(0, 20));
          }
          setHasMore(response.message.length === 21);
        } else {
          openErrorModal();
        }
      } catch (err) {
        console.log("Error in fetchBeforeAfters: ", err);
      }
    },
    [searchParams.toString()]
  );

  const memoizedComparisonCarousel = useCallback(
    (props: any) => (
      <ComparisonCarousel data={props.data} key={props.index} minHeight={width * 0.75} />
    ),
    [searchParams.toString(), width]
  );

  useEffect(() => {
    fetchBeforeAfters();
  }, [type, part, sex, ageInterval, ethnicity, bodyType, concern]);

  return (
    <Stack className={`${classes.container} mediumPage`} ref={ref}>
      <GeneralResultsHeader showFilter />
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
              className={classes.inviniteScroll}
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
        <Loader style={{ margin: "0 auto", paddingTop: "15%" }} />
      )}
    </Stack>
  );
}
