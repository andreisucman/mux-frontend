"use client";

import React, { useState } from "react";
import { nanoid } from "nanoid";
import { Loader, Stack, Text } from "@mantine/core";
import PageHeader from "@/components/PageHeader";
import { useRouter } from "@/helpers/custom-router";
import classes from "./about.module.css";

export const runtime = "edge";

export default function AboutPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClickNext = () => {
    if (isLoading) return;
    setIsLoading(true);

    router.push("/select-part");

    if (!window.dataLayer) return;

    const conversionId = nanoid();

    window.dataLayer.push({
      event: "Lead",
      conversionId,
    });
  };

  return (
    <Stack className={`smallPage`}>
      <PageHeader title="Getting started" />
      <Stack className={classes.videoWrapper}>
        <video className={classes.video} preload="metadata" muted controls>
          <source src={"https://mux.nyc3.cdn.digitaloceanspaces.com/about.mp4"} type="video/mp4" />
        </video>
      </Stack>
      <Stack className={classes.explanation}>
        <Text>
          Improve your appearance with self-improvement routines and publish your progress to earn
          from views.
        </Text>
        <Text>For a quick walkthrough watch the video above and click 'Next' to start.</Text>
      </Stack>
      <button
        id="about_next_btn"
        style={{ marginBottom: "10%" }}
        className={classes.button}
        onClick={handleClickNext}
      >
        {isLoading ? <Loader color="var(--mantine-color-gray-1)" size={18} /> : <>Next</>}
      </button>
    </Stack>
  );
}
