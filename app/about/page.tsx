"use client";

import React from "react";
import { Button, Stack, Text } from "@mantine/core";
import PageHeader from "@/components/PageHeader";
import { useRouter } from "@/helpers/custom-router";
import classes from "./about.module.css";

export const runtime = "edge";

export default function AnswersPage() {
  const router = useRouter();

  return (
    <Stack className={`smallPage`}>
      <PageHeader title="About" />
      <Stack className={classes.videoWrapper}>
        <video muted autoPlay controls className={classes.video}>
          <source
            src={`${process.env.NEXT_PUBLIC_API_SERVER_URL}/getAboutVideo`}
            type="video/mp4"
          />
        </video>
      </Stack>
      <Stack className={classes.explanation}>
        <Text>On Muxout you can improve your appearance with self-improvement routines.</Text>
        <Text>
          Start by analyzing your concerns, then create a routine, complete the routine and analyze
          your concerns again to see the improvement.
        </Text>
        <Text>
          If your appearance improves you can publish your routines and earn from views.
        </Text>
        <Text>For a quick walkthrough watch the video above and click 'Next' to start.</Text>
      </Stack>
      <Button mb="10%" onClick={() => router.push("/select-part")}>Next</Button>
    </Stack>
  );
}
