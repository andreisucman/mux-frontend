import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Stack } from "@mantine/core";
import DateSelector from "@/components/DateSelector";
import FilterDropdown from "@/components/FilterDropdown";
import { FilterItemType } from "@/components/FilterDropdown/types";
import getFilters from "@/functions/getFilters";
import { partIcons } from "@/helpers/icons";
import classes from "./DiaryFilterCardContent.module.css";

type Props = {
  userId?: string;
};

export default function DiaryFilterCardContent({ userId }: Props) {
  const [partFilters, setPartFilters] = useState<FilterItemType[]>([]);
  const searchParams = useSearchParams();
  const part = searchParams.get("part");
  const partsDisabled = partFilters.length === 0;

  useEffect(() => {
    if (!userId) return;

    getFilters({
      collection: "task",
      fields: ["part"],
      filter: [`userId=${userId}`],
    }).then((result) => {
      const { availableParts } = result;
      setPartFilters(availableParts);
    });
  }, [userId]);

  return (
    <Stack className={classes.container}>
      <FilterDropdown
        data={partFilters}
        icons={partsDisabled ? undefined : partIcons}
        filterType="part"
        placeholder="Filter by part"
        selectedValue={part}
        isDisabled={partsDisabled}
        customStyles={{ maxWidth: "unset" }}
        allowDeselect
        addToQuery
      />
      <DateSelector customStyles={{ width: "100%" }} showCancelButton />
    </Stack>
  );
}
