"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Loader, Title } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import StyleGallery from "@/app/results/style/StyleGallery";
import { SimpleStyleType } from "@/components/StyleModalContent/types";
import { UserContext } from "@/context/UserContext";
import { FetchStyleProps } from "@/functions/fetchStyle";
import fetchUsersStyle from "@/functions/fetchUsersStyle";
import openResultModal from "@/helpers/openResultModal";
import ClubModerationLayout from "../../ModerationLayout";

export const runtime = "edge";

interface HandleFetchStyleProps extends FetchStyleProps {
  currentArray?: SimpleStyleType[];
}

export default function ClubStyle() {
  const { userName } = useParams();
  const searchParams = useSearchParams();
  const { status, userDetails } = useContext(UserContext);
  const [styles, setStyles] = useState<SimpleStyleType[]>();
  const [hasMore, setHasMore] = useState(false);

  const { name } = userDetails || {};

  const isSelf = name === userName;

  const type = searchParams.get("type");
  const styleName = searchParams.get("styleName");

  const handleFetchUsersStyles = useCallback(
    async ({ type, currentArray, styleName, skip, followingUserName }: HandleFetchStyleProps) => {
      const items = await fetchUsersStyle({
        type,
        styleName,
        currentArrayLength: currentArray?.length || 0,
        followingUserName,
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

    handleFetchUsersStyles({ type, styleName, followingUserName: userName });
  }, [status, type, styleName, userName]);

  return (
    <ClubModerationLayout userName={userName}>
      {styles ? (
        <StyleGallery
          styles={styles}
          hasMore={hasMore}
          handleContainerClick={handleContainerClick}
          handleFetchStyles={handleFetchUsersStyles}
          setStyles={setStyles}
          isSelf={isSelf}
        />
      ) : (
        <Loader style={{ margin: "0 auto", paddingTop: "15%" }} />
      )}
    </ClubModerationLayout>
  );
}
