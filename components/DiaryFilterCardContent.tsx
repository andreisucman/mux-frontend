import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button, Stack } from "@mantine/core";
import DateSelector from "@/components/DateSelector";
import FilterDropdown from "@/components/FilterDropdown";
import { FilterItemType } from "@/components/FilterDropdown/types";
import { partIcons } from "@/helpers/icons";
import classes from "./DiaryFilterCardContent.module.css";

type Props = {
  filterItems?: FilterItemType[];
};

export default function DiaryFilterCardContent({ filterItems }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const part = searchParams.get("part");

  return (
    <Stack className={classes.container}>
      <FilterDropdown
        data={filterItems || []}
        icons={partIcons}
        filterType="part"
        placeholder="Filter by part"
        selectedValue={part}
        isDisabled={!filterItems}
        customStyles={{ maxWidth: "unset" }}
        allowDeselect
        addToQuery
      />
      <DateSelector customStyles={{ width: "100%" }} preventDefaultDate showCancelButton />
      <Button
        disabled={!searchParams.toString()}
        variant="default"
        onClick={() => router.replace(pathname)}
      >
        Clear filters
      </Button>
    </Stack>
  );
}
