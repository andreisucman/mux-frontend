"use client";

import React from "react";
import { Stack } from "@mantine/core";
import SkeletonWrapper from "@/app/SkeletonWrapper";
import PageHeader from "@/components/PageHeader";
import RoutineModerationCard from "./RoutineModerationCard";
import classes from "./manage-routines.module.css";

export const runtime = "edge";

const fakeCards = [
  { part: "body", name: "Abc", description: "Cde", oneTimePrice: 10, subscriptionPrice: 5 },
  { part: "face", name: "Abc", description: "Cde", oneTimePrice: 10, subscriptionPrice: 5 },
];

export default function ManageRoutines() {
  return (
    <Stack className={`${classes.container} smallPage`}>
      <PageHeader title="Manage routines" />
      <SkeletonWrapper>
        <Stack className={classes.content}>
          {fakeCards.map((c, i) => (
            <RoutineModerationCard
              key={i}
              part={c.part}
              defaultName={c.name}
              defaultDescription={c.description}
              defaultOneTimePrice={c.oneTimePrice}
              defaultSubscriptionPrice={c.subscriptionPrice}
            />
          ))}
        </Stack>
      </SkeletonWrapper>
    </Stack>
  );
}
