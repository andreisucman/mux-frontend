"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader, Stack } from "@mantine/core";
import { SimpleStyleType } from "@/components/StyleModalContent/types";
import { UserContext } from "@/context/UserContext";
import { FetchStyleProps } from "@/functions/fetchStyle";
import fetchUsersStyle from "@/functions/fetchUsersStyle";
import openErrorModal from "@/helpers/openErrorModal";
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
        const response = await fetchUsersStyle({
          type,
          styleName,
          currentArrayLength: currentArray?.length || 0,
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
    if (status !== "authenticated") return;

    handleFetchStyles({ type, styleName });
  }, [status, type, styleName]);

  return (
    <Stack className={`${classes.container} mediumPage`}>
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
        <Loader m="auto" />
      )}
    </Stack>
  );
}
