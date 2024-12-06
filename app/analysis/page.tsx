"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { IconMan, IconMoodSmile } from "@tabler/icons-react";
import { Group, Stack, Title } from "@mantine/core";
import AnalysisCarousel from "@/components/AnalysisCarousel";
import FilterDropdown from "@/components/FilterDropdown";
import { TypeEnum } from "@/types/global";
import classes from "./analysis.module.css";

export const runtime = "edge";

const icons = { head: <IconMoodSmile className="icon" />, body: <IconMan className="icon" /> };

const filterData = [
  { label: "Head", value: "head" },
  { label: "Body", value: "body", disabled: true },
];

export default function StartAnalysis() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "head";

  return (
    <Stack className={`${classes.container} smallPage`}>
      <Group className={classes.heading}>
        <Title order={1}>Analysis</Title>
        <Group className={classes.right}>
          <FilterDropdown
            data={filterData}
            icons={icons}
            filterType="type"
            placeholder="Select type"
            addToQuery
          />
        </Group>
      </Group>

      <AnalysisCarousel type={type as TypeEnum} />
    </Stack>
  );
}
