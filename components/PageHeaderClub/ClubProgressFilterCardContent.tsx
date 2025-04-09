import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import FilterDropdown from "@/components/FilterDropdown";
import { FilterItemType } from "@/components/FilterDropdown/types";
import { partIcons } from "@/helpers/icons";
import classes from "./ClubProgressFilterCardContent.module.css";

type Props = {
  filterItems?: FilterItemType[];
};

export default function ClubProgressFilterCardContent({ filterItems }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const part = searchParams.get("part");

  return (
    <Stack className={classes.container}>
      <FilterDropdown
        data={filterItems || []}
        icons={filterItems ? partIcons : undefined}
        filterType="part"
        placeholder="Filter by part"
        selectedValue={part}
        isDisabled={!filterItems}
        customStyles={{ maxWidth: "unset" }}
        allowDeselect
        addToQuery
        closeOnSelect
      />
      <Button
        disabled={!searchParams.toString()}
        variant="default"
        onClick={() => {
          modals.closeAll();
          router.replace(pathname);
        }}
      >
        Clear filters
      </Button>
    </Stack>
  );
}
