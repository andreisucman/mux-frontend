import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import FilterDropdown from "@/components/FilterDropdown";
import { FilterItemType } from "@/components/FilterDropdown/types";
import { partIcons } from "@/helpers/icons";
import classes from "./RoutinesFilterCardContent.module.css";
import { normalizeString } from "@/helpers/utils";

type Props = {
  concernFilterItems?: FilterItemType[];
  partFilterItems?: FilterItemType[];
};

export default function RoutinesFilterCardContent({ concernFilterItems, partFilterItems }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const part = searchParams.get("part");
  const concern = searchParams.get("concern");

  return (
    <Stack className={classes.container}>
      <FilterDropdown
        data={partFilterItems || []}
        icons={partFilterItems ? partIcons : undefined}
        filterType="part"
        placeholder="Filter by part"
        selectedValue={part}
        searchValue={normalizeString(part || "")}
        customStyles={{ maxWidth: "unset" }}
        allowDeselect
        closeOnSelect
        addToQuery
      />
      <FilterDropdown
        data={concernFilterItems || []}
        filterType="concern"
        placeholder="Filter by concern"
        selectedValue={concern || ""}
        searchValue={normalizeString(concern || "")}
        customStyles={{ maxWidth: "unset" }}
        allowDeselect
        closeOnSelect
        addToQuery
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
