"use client";

import React, { useContext } from "react";
import { Group, Stack } from "@mantine/core";
import PageHeader from "@/components/PageHeader";
import { UserContext } from "@/context/UserContext";
import AccountSettings from "./AccountSettings";
import ClubSettings from "./ClubSettings";
import OtherSettings from "./OtherSettings";
import classes from "./settings.module.css";

export default function Settings() {
  const { userDetails } = useContext(UserContext);
  const { club } = userDetails || {};

  return (
    <Stack className={`${classes.container} smallPage`}>
      <PageHeader title="Settings" hidePartDropdown />
      <Group className={classes.content}>
        <Stack className={classes.left}>
          <AccountSettings />
          <OtherSettings />
        </Stack>
        {club && club.isActive && <ClubSettings />}
      </Group>
    </Stack>
  );
}
