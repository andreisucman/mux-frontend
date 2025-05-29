"use client";

import React from "react";
import { nanoid } from "nanoid";
import { Stack, Text } from "@mantine/core";
import PageHeader from "@/components/PageHeader";
import { useRouter } from "@/helpers/custom-router";
import classes from "./about.module.css";

export const runtime = "edge";

export default function AnswersPage() {
  const router = useRouter();

  const handleClickNext = () => {
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
        <video muted autoPlay controls className={classes.video}>
          <source
            src={`${process.env.NEXT_PUBLIC_API_SERVER_URL}/getAboutVideo`}
            type="video/mp4"
          />
        </video>
      </Stack>
      <Stack className={classes.explanation}>
        <Text>Improve your appearance with self-improvement routines.</Text>
        <Text>
          Start by analyzing your concerns, then create a routine, complete the routine and analyze
          your concerns again to see the improvement.
        </Text>
        <Text>
          After your appearance improves you can publish your routines and earn from views.
        </Text>
        <Text>For a quick walkthrough watch the video above and click 'Next' to start.</Text>
      </Stack>
      <button
        id="about_next_btn"
        style={{ marginBottom: "10%" }}
        className={classes.button}
        onClick={handleClickNext}
      >
        Next
      </button>
    </Stack>
  );
}
