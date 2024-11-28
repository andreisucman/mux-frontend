"use client";

import React from "react";
import { Group, Stack } from "@mantine/core";
import PageHeader from "@/components/PageHeader";
import PricingCard from "./PricingCard";
import { freePlanContent, peekLicenseContent } from "./pricingData";
import classes from "./plans.module.css";

export const runtime = "edge";

export default function PlansPage() {
  return (
    <Stack className={classes.container}>
      <PageHeader title="Plans" hidePartDropdown hideTypeDropdown />
      <Group className={classes.content}>
        <PricingCard content={freePlanContent} name={"Free"} addGradient />
        <PricingCard content={peekLicenseContent} price={"19"} name={"Peek license"} />
      </Group>
    </Stack>
  );
}
