"use client";

import React, { useContext } from "react";
import cn from "classnames";
import { Skeleton, Stack } from "@mantine/core";
import PageHeader from "@/components/PageHeader";
import { UserContext } from "@/context/UserContext";
import BalancePane from "./BalancePane";
import ClubProfilePreview from "./ClubProfilePreview";
import ViewsList from "./ViewsList";
import classes from "./club.module.css";

export const runtime = "edge";

export default function Club() {
  const { userDetails } = useContext(UserContext);
  const { name, avatar, club } = userDetails || {};
  const { intro, socials } = club || { socials: [] };

  return (
    <Stack className={cn(classes.container, "smallPage")}>
      <PageHeader title="Club profile" />
      <Skeleton className={classes.skeleton} visible={!userDetails}>
        <ClubProfilePreview data={{ name, avatar, intro, socials }} type="you" showButton />
        <BalancePane />
        <Stack className={classes.list}>
          <ViewsList userName={name} />
        </Stack>
      </Skeleton>
    </Stack>
  );
}
