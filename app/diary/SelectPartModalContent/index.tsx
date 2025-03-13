"use client";

import React, { useEffect, useState } from "react";
import { Button, Stack } from "@mantine/core";
import FilterDropdown from "@/components/FilterDropdown";
import { FilterItemType } from "@/components/FilterDropdown/types";
import getFilters from "@/functions/getFilters";
import { partIcons } from "@/helpers/icons";
import classes from "./SelectPartModalContent.module.css";

export const runtime = "edge";

type Props = {
  userId?: string;
  onClick: (part: string) => Promise<void> | void;
};

export default function SelectPartModalContent({ userId, onClick }: Props) {
  const [part, setPart] = useState<string | null>();
  const [availableParts, setAvailableParts] = useState<FilterItemType[]>([]);

  useEffect(() => {
    if (!userId) return;

    getFilters({
      collection: "progress",
      fields: ["part"],
      filter: [`userId=${userId}`],
    }).then((result) => {
      const { availableParts } = result;
      setAvailableParts(availableParts);
    });
  }, [userId]);

  return (
    <Stack className={classes.container}>
      <FilterDropdown
        data={availableParts}
        icons={partIcons}
        selectedValue={part}
        onSelect={setPart}
        placeholder="Choose part"
        customStyles={{ marginLeft: "auto", maxWidth: "unset", width: "100%" }}
      />
      <Button disabled={!part} onClick={() => onClick(part || "")}>
        Next
      </Button>
    </Stack>
  );
}
