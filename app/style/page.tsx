"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader, Stack } from "@mantine/core";
import StyleGallery from "@/app/results/style/StyleGallery";
import { SimpleStyleType } from "@/components/StyleModalContent/types";
import fetchStyle, { FetchStyleProps } from "@/functions/fetchStyle";
import GeneralResultsHeader from "../GeneralResultsHeader";

export const runtime = "edge";

interface HandleFetchStyleProps extends FetchStyleProps {
  currentArray?: SimpleStyleType[];
}

export default function AllStyle() {
  const searchParams = useSearchParams();
  const [styles, setStyles] = useState<SimpleStyleType[]>();
  const [hasMore, setHasMore] = useState(false);

  const sex = searchParams.get("sex");
  const type = searchParams.get("type") || "head";
  const styleName = searchParams.get("styleName");
  const ageInterval = searchParams.get("ageInterval");
  const ethnicity = searchParams.get("ethnicity");

  const handleFetchStyles = useCallback(
    async ({
      type,
      styleName,
      skip,
      currentArray,
      ethnicity,
      ageInterval,
      sex,
    }: HandleFetchStyleProps) => {
      try {
        const styles = await fetchStyle({
          type,
          styleName,
          currentArrayLength: currentArray?.length || 0,
          ethnicity,
          ageInterval,
          sex,
          skip,
        });

        if (skip) {
          setStyles([...(currentArray || []), ...styles.slice(0, 20)]);
        } else {
          setStyles(styles.slice(0, 20));
        }
        setHasMore(styles.length === 21);
      } catch (err) {
        console.log("Error in handleFetchStyles: ", err);
      }
    },
    []
  );

  useEffect(() => {
    handleFetchStyles({ type, styleName, sex, ageInterval, ethnicity });
  }, [type, styleName, sex, ageInterval, ethnicity]);

  return (
    <Stack className={"mediumPage"} flex={1}>
      <GeneralResultsHeader />
      {styles ? (
        <StyleGallery
          styles={styles}
          hasMore={hasMore}
          handleFetchStyles={handleFetchStyles}
          setStyles={setStyles}
        />
      ) : (
        <Loader m="0 auto" pt="25%" />
      )}
    </Stack>
  );
}
