"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader, Title } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import StyleGallery from "@/app/results/style/StyleGallery";
import StyleHeader from "@/app/results/style/StyleHeader";
import { SimpleStyleType } from "@/components/StyleModalContent/types";
import { UserContext } from "@/context/UserContext";
import { FetchStyleProps } from "@/functions/fetchStyle";
import fetchUsersStyle from "@/functions/fetchUsersStyle";
import openResultModal from "@/helpers/openResultModal";
import { clubResultTitles } from "../clubResultTitles";
import ClubModerationLayout from "../ModerationLayout";

export const runtime = "edge";

interface HandleFetchStyleProps extends FetchStyleProps {
  currentArray?: SimpleStyleType[];
}

export default function ClubStyle() {
  const searchParams = useSearchParams();
  const { status } = useContext(UserContext);
  const [styles, setStyles] = useState<SimpleStyleType[]>();
  const [hasMore, setHasMore] = useState(false);

  const type = searchParams.get("type") || "head";
  const styleName = searchParams.get("styleName");
  const followingUserId = searchParams.get("followingUserId");

  const handleFetchUsersStyles = useCallback(
    async ({ type, currentArray, styleName, skip, followingUserId }: HandleFetchStyleProps) => {
      const items = await fetchUsersStyle({
        type,
        styleName,
        currentArrayLength: currentArray?.length || 0,
        followingUserId,
        skip,
      });

      if (skip) {
        setStyles([...(styles || []), ...items.slice(0, 20)]);
      } else {
        setStyles(items.slice(0, 20));
      }
      setHasMore(items.length === 21);
    },
    []
  );

  const handleContainerClick = useCallback((data: SimpleStyleType) => {
    const titleText =
      data.styleName === data.compareStyleName
        ? `${upperFirst(data.styleName)}`
        : `${upperFirst(data.styleName)} vs ${upperFirst(data.compareStyleName)}`;

    openResultModal({
      record: data,
      type: "style",
      title: (
        <Title order={5} ml="0" lineClamp={2}>
          {titleText}
        </Title>
      ),
      setRecords: setStyles,
    });
  }, []);

  useEffect(() => {
    if (status !== "authenticated") return;

    handleFetchUsersStyles({ type, styleName, followingUserId });
  }, [status, type, styleName, followingUserId]);

  return (
    <ClubModerationLayout>
      {styles ? (
        <StyleGallery
          styles={styles}
          hasMore={hasMore}
          handleContainerClick={handleContainerClick}
          handleFetchStyles={handleFetchUsersStyles}
          setStyles={setStyles}
        />
      ) : (
        <Loader style={{ margin: "0 auto", paddingTop: "15%" }} />
      )}
    </ClubModerationLayout>
  );
}
