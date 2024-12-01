"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader } from "@mantine/core";
import StyleGallery from "@/app/results/style/StyleGallery";
import StyleHeader from "@/app/results/style/StyleHeader";
import { SimpleStyleType } from "@/components/StyleModalContent/types";
import { UserContext } from "@/context/UserContext";
import { FetchStyleProps } from "@/functions/fetchStyle";
import fetchUsersStyle from "@/functions/fetchUsersStyle";
import openErrorModal from "@/helpers/openErrorModal";
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
  const trackedUserId = searchParams.get("trackedUserId");

  const handleFetchUsersStyles = useCallback(
    async ({ type, currentArray, styleName, skip, trackedUserId }: HandleFetchStyleProps) => {
      const data = await fetchUsersStyle({
        type,
        styleName,
        currentArrayLength: currentArray?.length || 0,
        trackedUserId,
        skip,
      });

      if (data) {
        if (skip) {
          setStyles([...(styles || []), ...data.slice(0, 20)]);
        } else {
          setStyles(data.slice(0, 20));
        }
        setHasMore(data.length === 21);
      } else {
        openErrorModal();
      }
    },
    []
  );

  useEffect(() => {
    if (status !== "authenticated") return;
    if (!trackedUserId) return;

    handleFetchUsersStyles({ type, styleName, trackedUserId });
  }, [status, type, styleName, trackedUserId]);

  return (
    <ClubModerationLayout>
      <StyleHeader
        title="Style"
        isDisabled={!styles || (styles && styles.length === 0)}
        showReturn
      />
      {styles ? (
        <StyleGallery
          styles={styles}
          hasMore={hasMore}
          handleFetchStyles={handleFetchUsersStyles}
          setStyles={setStyles}
        />
      ) : (
        <Loader m="auto" />
      )}
    </ClubModerationLayout>
  );
}
