import React, { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import FilterDropdown from "@/components/FilterDropdown";
import { FilterItemType, FilterPartItemType } from "@/components/FilterDropdown/types";
import getUsersFilters from "@/functions/getFilters";
import { partIcons } from "@/helpers/icons";
import modifyQuery from "@/helpers/modifyQuery";
import classes from "./ProductsFilterCardContent.module.css";

type Props = {
  filterItems?: FilterItemType[];
};

export default function ProductsFilterCardContent({ filterItems = [] }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const part = searchParams.get("part");

  const handleResetFilters = () => {
    const query = modifyQuery({
      params: [{ name: "part", value: null, action: "delete" }],
    });
    modals.closeAll();
    router.replace(`${pathname}?${query}`);
  };

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
      <Button onClick={handleResetFilters} variant="default">
        Reset
      </Button>
    </Stack>
  );
}
