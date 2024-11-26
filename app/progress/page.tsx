"use client";

import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Stack } from "@mantine/core";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import ProgressGallery from "./ProgressGallery";
import ProgressHeader from "./ProgressHeader";
import { HandleUpdateProgressType, SimpleProgressType } from "./types";
import classes from "./progress.module.css";

export const runtime = "edge";

export default function Progress() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userDetails } = useContext(UserContext);
  const [progress, setProgress] = useState<SimpleProgressType[]>();

  const type = searchParams.get("type") || "head";
  const part = searchParams.get("part") || "face";
  const { _id: userId } = userDetails || {};

  const fetchProgress = useCallback(
    async (type: string, part: string) => {
      if (!userId) return;

      try {
        const response = await callTheServer({
          endpoint: "getLatestProgress",
          method: "POST",
          body: {
            userId,
            type,
            part,
          },
        });

        if (response.status === 200) {
          setProgress(response.message);
        }
      } catch (err) {
        console.log("Error in fetchProgress: ", err);
      }
    },
    [userId]
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
    fetchProgress(type, part);
  }, [userId, type]);

  return (
    <Stack className={classes.container}>
      <ProgressHeader title="Progress" showReturn />
    </Stack>
  );
}
