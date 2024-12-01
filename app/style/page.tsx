"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader, Stack } from "@mantine/core";
import { SimpleStyleType } from "@/components/StyleModalContent/types";
import fetchStyle, { FetchStyleProps } from "@/functions/fetchStyle";
import openErrorModal from "@/helpers/openErrorModal";
import StyleGallery from "../results/style/StyleGallery";
import StyleHeader from "../results/style/StyleHeader";
import classes from "./style.module.css";

export const runtime = "edge";

interface HandleFetchStyleProps extends FetchStyleProps {
  currentArray?: SimpleStyleType[];
}

export default function AllStyle() {
  const searchParams = useSearchParams();
  const [styles, setStyles] = useState<SimpleStyleType[]>();
  const [hasMore, setHasMore] = useState(false);

  const type = searchParams.get("type") || "head";
  const styleName = searchParams.get("styleName");
  const sex = searchParams.get("sex");
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
        const response = await fetchStyle({
          type,
          styleName,
          currentArrayLength: currentArray?.length || 0,
          ethnicity,
          ageInterval,
          sex,
          skip,
        });

        if (response.status === 200) {
          if (skip) {
            setStyles([...(currentArray || []), ...response.message.slice(0, 20)]);
          } else {
            setStyles(response.message.slice(0, 20));
          }
          setHasMore(response.message.length === 21);
        } else {
          openErrorModal();
        }
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
    <Stack className={`${classes.container} mediumPage`}>
      <StyleHeader
        title="Style"
        isDisabled={!styles || (styles && styles.length === 0)}
        showReturn
      />
      {styles ? (
        <StyleGallery
          styles={styles}
          hasMore={hasMore}
          handleFetchStyles={handleFetchStyles}
          setStyles={setStyles}
        />
      ) : (
        <Loader m="auto" />
      )}
    </Stack>
  );
}
