"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { IconMan, IconMoodSmile } from "@tabler/icons-react";
import { Group, Stack, Title } from "@mantine/core";
import AnalysisCarousel from "@/components/AnalysisCarousel";
import FilterDropdown from "@/components/FilterDropdown";
import classes from "./analysis.module.css";

export const runtime = "edge";

const filterData = [
  { label: "Head", icon: <IconMoodSmile className="icon" />, value: "head" },
  { label: "Body", icon: <IconMan className="icon" />, value: "body" },
];

export default function StartAnalysis() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "head";

  return (
    <Stack className={`${classes.container} smallPage`}>
      <Group className={classes.heading}>
        <Title order={1}>Analysis</Title>
        <Group className={classes.right}>
          <FilterDropdown data={filterData} filterType="type" addToQuery />
        </Group>
      </Group>

      <AnalysisCarousel type={type as "head" | "body"} />
    </Stack>
  );
}
