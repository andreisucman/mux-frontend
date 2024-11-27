"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader, Stack } from "@mantine/core";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import openErrorModal from "@/helpers/openErrorModal";
import ProgressGallery from "./ProgressGallery";
import ProgressHeader from "./ProgressHeader";
import { HandleFetchProgressType, HandleUpdateProgressType, SimpleProgressType } from "./types";
import classes from "./progress.module.css";

export const runtime = "edge";

export default function Progress() {
  const searchParams = useSearchParams();
  const { userDetails } = useContext(UserContext);
  const [progress, setProgress] = useState<SimpleProgressType[]>();
  const [hasMore, setHasMore] = useState(false);

  const type = searchParams.get("type") || "head";
  const part = searchParams.get("part");
  const { _id: userId } = userDetails || {};

  const handleFetchProgress = useCallback(
    async ({ type, part, skip }: HandleFetchProgressType) => {
      if (!userId) return;

      try {
        const parts = [];

        if (type) {
          parts.push(`type=${type}`);
        }

        if (part) {
          parts.push(`part=${part}`);
        }

        if (skip && progress) {
          parts.push(`skip=${progress.length}`);
        }

        const query = parts.join("&");

        const endpoint = `getLatestProgress${query ? `?${query}` : ""}`;

        const response = await callTheServer({
          endpoint,
          method: "GET",
        });

        if (response.status === 200) {
          if (skip) {
            setProgress([...(progress || []), ...response.message.slice(0, 6)]);
          } else {
            setProgress(response.message.slice(0, 6));
          }
          setHasMore(response.message.length === 7);
        } else {
          openErrorModal();
        }
      } catch (err) {
        console.log("Error in handleFetchProgress: ", err);
      }
    },
    [userId, progress && progress.length]
  );

  const handleUpdateProgress = useCallback(
    ({ contentId, images, initialImages }: HandleUpdateProgressType) => {
      try {
        setProgress((prev) =>
          prev?.map((rec) => (rec._id === contentId ? { ...rec, images, initialImages } : rec))
        );
      } catch (err) {
        console.log("Error in handleUpdateProgress: ", err);
      }
    },
    []
  );

  useEffect(() => {
    if (!userId) return;

    handleFetchProgress({ type, part });
  }, [userId, type, part]);

  return (
    <Stack className={classes.container}>
      <ProgressHeader title="Progress" showReturn />
      {progress ? (
        <ProgressGallery
          progress={progress}
          hasMore={hasMore}
          handleFetchProgress={handleFetchProgress}
          handleUpdateProgress={handleUpdateProgress}
        />
      ) : (
        <Loader m="auto" />
      )}
    </Stack>
  );
}
