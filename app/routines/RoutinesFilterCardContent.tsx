import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import FilterDropdown from "@/components/FilterDropdown";
import { FilterItemType } from "@/components/FilterDropdown/types";
import { partIcons } from "@/helpers/icons";
import modifyQuery from "@/helpers/modifyQuery";
import classes from "./RoutinesFilterCardContent.module.css";

type Props = {
  filterItems?: FilterItemType[];
};

export default function RoutinesFilterCardContent({ filterItems = [] }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const part = searchParams.get("part");

  const partsDisabled = filterItems.length === 0;

  return (
    <Stack className={classes.container}>
      <FilterDropdown
        data={filterItems}
        icons={partsDisabled ? undefined : partIcons}
        filterType="part"
        placeholder="Filter by part"
        selectedValue={part}
        isDisabled={partsDisabled}
        customStyles={{ maxWidth: "unset" }}
        allowDeselect
        addToQuery
      />
    </Stack>
  );
}
