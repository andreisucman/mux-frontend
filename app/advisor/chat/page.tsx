"use client";

import React from "react";
import { Stack } from "@mantine/core";
import SkeletonWrapper from "@/app/SkeletonWrapper";
import PageHeader from "@/components/PageHeader";
import ChatBody from "./ChatBody";
import AdvisorPanelButtons from "../AdvisorPanelButtons";
import classes from "./chat.module.css";

export const runtime = "edge";

export default function Chat() {
  return (
    <Stack className={`${classes.container} smallPage`}>
      <PageHeader
        title={"Advisor"}
        children={<AdvisorPanelButtons showNew />}
        showReturn
        hidePartDropdown
        hideTypeDropdown
      />
      <SkeletonWrapper>
        <ChatBody />
      </SkeletonWrapper>
    </Stack>
  );
}
