import React from "react";
import { useSearchParams } from "next/navigation";
import { Stack } from "@mantine/core";
import DateSelector from "@/components/DateSelector";
import FilterDropdown from "@/components/FilterDropdown";
import { FilterItemType } from "@/components/FilterDropdown/types";
import { partIcons } from "@/helpers/icons";
import classes from "./DiaryFilterCardContent.module.css";

type Props = {
  availableParts?: FilterItemType[];
};

export default function DiaryFilterCardContent({ availableParts }: Props) {
  const searchParams = useSearchParams();
  const part = searchParams.get("part");

  return (
    <Stack className={classes.container}>
      <FilterDropdown
        data={availableParts || []}
        icons={partIcons}
        filterType="part"
        placeholder="Filter by part"
        selectedValue={part}
        isDisabled={!availableParts?.length}
        customStyles={{ maxWidth: "unset" }}
        allowDeselect
        addToQuery
      />
      <DateSelector customStyles={{ width: "100%" }} preventDefaultDate showCancelButton />
    </Stack>
  );
}
