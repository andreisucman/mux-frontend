"use client";

import React, { useContext } from "react";
import { Group, Stack } from "@mantine/core";
import PageHeader from "@/components/PageHeader";
import { UserContext } from "@/context/UserContext";
import AccountSettings from "./AccountSettings";
import ClubSettings from "./ClubSettings";
import classes from "./settings.module.css";

export default function Settings() {
  const { userDetails } = useContext(UserContext);
  const { club } = userDetails || {};

  return (
    <Stack className={`${classes.container} smallPage`}>
      <PageHeader title="Settings" />
      <Group className={classes.content}>
        <AccountSettings />
        {club && club.isActive && <ClubSettings />}
      </Group>
    </Stack>
  );
}
