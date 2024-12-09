"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader, Stack } from "@mantine/core";
import SkeletonWrapper from "@/app/SkeletonWrapper";
import { SimpleStyleType } from "@/components/StyleModalContent/types";
import { UserContext } from "@/context/UserContext";
import { FetchStyleProps } from "@/functions/fetchStyle";
import fetchUsersStyle from "@/functions/fetchUsersStyle";
import { individualResultTitles } from "../individualResultTitles";
import StyleGallery from "./StyleGallery";
import StyleHeader from "./StyleHeader";
import classes from "./style.module.css";

export const runtime = "edge";

interface HandleFetchStyleProps extends FetchStyleProps {
  currentArray?: SimpleStyleType[];
}

export default function ResultStyle() {
  const searchParams = useSearchParams();
  const { status } = useContext(UserContext);
  const [styles, setStyles] = useState<SimpleStyleType[]>();
  const [hasMore, setHasMore] = useState(false);

  const type = searchParams.get("type") || "head";
  const styleName = searchParams.get("styleName");

  const handleFetchStyles = useCallback(
    async ({ type, styleName, skip, currentArray }: HandleFetchStyleProps) => {
      try {
        const items = await fetchUsersStyle({
          type,
          styleName,
          currentArrayLength: currentArray?.length || 0,
          skip,
        });

        if (skip) {
          setStyles([...(currentArray || []), ...items.slice(0, 20)]);
        } else {
          setStyles(items.slice(0, 20));
        }
        setHasMore(items.length === 21);
      } catch (err) {
        console.log("Error in handleFetchStyles: ", err);
      }
    },
    []
  );

  useEffect(() => {
    if (status !== "authenticated") return;

    handleFetchStyles({ type, styleName });
  }, [status, type, styleName]);

  return (
    <Stack className={`${classes.container} mediumPage`}>
      <SkeletonWrapper>
        <StyleHeader
          titles={individualResultTitles}
          isDisabled={!styles || (styles && styles.length === 0)}
          showReturn
        />
        {styles ? (
          <StyleGallery
            styles={styles}
            hasMore={hasMore}
            handleFetchStyles={handleFetchStyles}
            setStyles={setStyles}
            isSelfPage
          />
        ) : (
          <Loader style={{ margin: "15vh auto 0" }} />
        )}
      </SkeletonWrapper>
    </Stack>
  );
}
