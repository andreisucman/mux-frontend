import React from "react";
import { useSearchParams } from "next/navigation";
import { Stack } from "@mantine/core";
import FilterDropdown from "@/components/FilterDropdown";
import { FilterItemType } from "@/components/FilterDropdown/types";
import { partIcons } from "@/helpers/icons";
import classes from "./HistoryFilterCardContent.module.css";

type Props = {
  partItems?: FilterItemType[];
  statusItems?: FilterItemType[];
};

export default function HistoryFilterCardContent({ partItems = [], statusItems = [] }: Props) {
  const searchParams = useSearchParams();

  const part = searchParams.get("part");
  const status = searchParams.get("status");

  const partsDisabled = partItems.length === 0;
  const statusDisabled = statusItems.length === 0;

  return (
    <Stack className={classes.container}>
      <FilterDropdown
        data={partItems}
        icons={partsDisabled ? undefined : partIcons}
        filterType="part"
        placeholder="Filter by part"
        selectedValue={part}
        isDisabled={partsDisabled}
        customStyles={{ maxWidth: "unset" }}
        allowDeselect
        addToQuery
      />
      <FilterDropdown
        data={statusItems}
        icons={statusDisabled ? undefined : partIcons}
        filterType="status"
        placeholder="Filter by status"
        selectedValue={status}
        isDisabled={statusDisabled}
        customStyles={{ maxWidth: "unset" }}
        allowDeselect
        addToQuery
      />
    </Stack>
  );
}
