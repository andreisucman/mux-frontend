import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import DateSelector from "@/components/DateSelector";
import FilterDropdown from "@/components/FilterDropdown";
import { FilterItemType } from "@/components/FilterDropdown/types";
import { partIcons } from "@/helpers/icons";
import classes from "./DiaryFilterCardContent.module.css";

type Props = {
  partFilterItems?: FilterItemType[];
  concernFilterItems?: FilterItemType[];
};

export default function DiaryFilterCardContent({ partFilterItems, concernFilterItems }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const part = searchParams.get("part");
  const concern = searchParams.get("concern");

  return (
    <Stack className={classes.container}>
      <FilterDropdown
        data={partFilterItems || []}
        icons={partIcons}
        filterType="part"
        placeholder="Filter by part"
        selectedValue={part}
        customStyles={{ maxWidth: "unset" }}
        allowDeselect
        addToQuery
      />
      <FilterDropdown
        data={concernFilterItems || []}
        filterType="concern"
        placeholder="Filter by concern"
        selectedValue={concern}
        customStyles={{ maxWidth: "unset" }}
        allowDeselect
        addToQuery
      />
      <DateSelector customStyles={{ width: "100%" }} preventDefaultDate showCancelButton />
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
