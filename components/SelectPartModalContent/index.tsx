"use client";

import React, { useEffect, useState } from "react";
import { Alert, Button, Stack } from "@mantine/core";
import FilterDropdown from "@/components/FilterDropdown";
import { FilterItemType } from "@/components/FilterDropdown/types";
import getFilters from "@/functions/getFilters";
import { partIcons } from "@/helpers/icons";
import { daysFrom } from "@/helpers/utils";
import classes from "./SelectPartModalContent.module.css";

export const runtime = "edge";

type Props = {
  userId?: string;
  onClick: (part: string, concern: string) => Promise<void> | void;
};

export default function SelectPartModalContent({ userId, onClick }: Props) {
  const [concern, setConcern] = useState<string | null>();
  const [part, setPart] = useState<string | null>();
  const [availableParts, setAvailableParts] = useState<FilterItemType[]>();
  const [availableConcerns, setAvailableConcerns] = useState<FilterItemType[]>();

  useEffect(() => {
    if (!userId) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = daysFrom({ date: today, days: 1 });

    const filter = [
      `userId=${userId}`,
      `completedAt>=${today.toISOString()}`,
      `completedAt<${tomorrow.toISOString()}`,
    ];

    if (part) filter.push(`part=${part}`);

    getFilters({
      collection: "task",
      filter,
      fields: ["part", "concern"],
    }).then((result) => {
      const { part, concern } = result;
      if (part.length > 0) {
        setPart(part[0].value);
        setAvailableParts(part);
      }
      if (concern.length > 0) {
        setConcern(concern[0]?.value);
        setAvailableConcerns(concern);
      }
    });
  }, [userId, part]);

  const noTasks =
    availableParts && availableConcerns && availableParts.length + availableConcerns.length === 0;

  return (
    <Stack className={classes.container}>
      {noTasks && <Alert p="0.5rem 1rem">Complete at least one task today to add a note.</Alert>}
      <FilterDropdown
        data={availableParts}
        icons={partIcons}
        selectedValue={part}
        onSelect={setPart}
        placeholder="Choose part"
        customStyles={{ marginLeft: "auto", maxWidth: "unset", width: "100%" }}
      />
      <FilterDropdown
        data={availableConcerns}
        selectedValue={concern}
        onSelect={setConcern}
        placeholder="Choose concern"
        customStyles={{ marginLeft: "auto", maxWidth: "unset", width: "100%" }}
      />
      <Button disabled={!part} onClick={() => onClick(part || "", concern || "")}>
        Next
      </Button>
    </Stack>
  );
}
