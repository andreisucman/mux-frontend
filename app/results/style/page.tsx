"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader, Stack, Title } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import SkeletonWrapper from "@/app/SkeletonWrapper";
import { SimpleStyleType } from "@/components/StyleModalContent/types";
import { UserContext } from "@/context/UserContext";
import { FetchStyleProps } from "@/functions/fetchStyle";
import fetchUsersStyle from "@/functions/fetchUsersStyle";
import openResultModal from "@/helpers/openResultModal";
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
  const sort = searchParams.get("sort");

  const handleFetchStyles = useCallback(
    async ({ type, styleName, sort, skip, currentArray }: HandleFetchStyleProps) => {
      try {
        const items = await fetchUsersStyle({
          type,
          styleName,
          currentArrayLength: currentArray?.length || 0,
          skip,
          sort,
        });

        if (skip) {
          setStyles([...(currentArray || []), ...items.slice(0, 20)]);
        } else {
          setStyles(items.slice(0, 20));
        }
        setHasMore(items.length === 21);
      } catch (err) {}
    },
    []
  );

  const handleContainerClick = useCallback(
    (data: SimpleStyleType) =>
      openResultModal({
        record: data,
        type: "style",
        title: (
          <Title order={5} component={"p"}>
            {upperFirst(data.styleName)} style preview
          </Title>
        ),
        setRecords: setStyles,
      }),
    [styles]
  );

  useEffect(() => {
    if (status !== "authenticated") return;

    handleFetchStyles({ type, sort, styleName });
  }, [status, sort, type, styleName]);

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
            handleContainerClick={handleContainerClick}
            handleFetchStyles={handleFetchStyles}
            setStyles={setStyles}
            columns={2}
            isSelf
          />
        ) : (
          <Loader style={{ margin: "0 auto", paddingTop: "15%" }} />
        )}
      </SkeletonWrapper>
    </Stack>
  );
}
