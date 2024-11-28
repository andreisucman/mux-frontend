"use client";

import React, { useCallback, useEffect, useState } from "react";
import { IconCircleOff } from "@tabler/icons-react";
import InfiniteScroll from "react-infinite-scroller";
import { Loader, rem, Stack } from "@mantine/core";
import MasonryComponent from "@/components/MasonryComponent";
import OverlayWithText from "@/components/OverlayWithText";
import PageHeader from "@/components/PageHeader";
import callTheServer from "@/functions/callTheServer";
import openErrorModal from "@/helpers/openErrorModal";
import ReviewCard from "./ReviewCard";
import { ReviewCardType } from "./types";
import classes from "./reviews.module.css";

export const runtime = "edge";

export default function Reviews() {
  const [reviews, setReviews] = useState<ReviewCardType[]>();
  const [hasMore, setHasMore] = useState(false);

  const fetchReviews = useCallback(
    async (skip?: boolean) => {
      try {
        let finalEndpoint = "getReviews";
        const queryParams = [];

        if (skip && reviews && reviews.length > 0) {
          queryParams.push(`skip=${reviews.length}`);
        }

        const response = await callTheServer({
          endpoint: finalEndpoint,
          method: "GET",
        });

        if (response.status === 200) {
          if (skip) {
            setReviews([...(reviews || []), ...response.message.slice(0, 6)]);
          } else {
            setReviews(response.message.slice(0, 6));
          }
          setHasMore(response.message.length === 7);
        } else {
          openErrorModal();
        }
      } catch (err) {
        console.log("Error in fetchReviews: ", err);
      }
    },
    [reviews && reviews.length]
  );

  const memoizedReviewCard = useCallback(
    (props: any) => <ReviewCard data={props.data} key={props.index} />,
    []
  );

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <Stack className={`${classes.container} largePage`}>
      <PageHeader title="Reviews" />
      {reviews ? (
        <>
          {reviews.length > 0 ? (
            <InfiniteScroll
              loader={
                <Stack mb={rem(16)} key={0}>
                  <Loader m="auto" />
                </Stack>
              }
              loadMore={() => fetchReviews(hasMore)}
              hasMore={hasMore}
              pageStart={0}
            >
              <MasonryComponent
                maxColumnCount={3}
                columnGutter={16}
                columnWidth={300}
                render={memoizedReviewCard}
                items={reviews}
              />
            </InfiniteScroll>
          ) : (
            <OverlayWithText text="No reviews found" icon={<IconCircleOff className="icon" />} />
          )}
        </>
      ) : (
        <Loader m="auto" />
      )}
    </Stack>
  );
}
