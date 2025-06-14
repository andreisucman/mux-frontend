import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import FilterDropdown from "@/components/FilterDropdown";
import { FilterItemType } from "@/components/FilterDropdown/types";
import { partIcons } from "@/helpers/icons";
import classes from "./ClubProofFilterCardContent.module.css";

type Props = {
  partFilterItems?: FilterItemType[];
  concernFilterItems?: FilterItemType[];
};

export default function ClubProofFilterCardContent({ partFilterItems, concernFilterItems }: Props) {
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
        placeholder="Filter by part"
        selectedValue={part}
        filterType="part"
        customStyles={{ maxWidth: "unset" }}
        allowDeselect
        addToQuery
        closeOnSelect
      />
      <FilterDropdown
        data={concernFilterItems || []}
        placeholder="Filter by concern"
        selectedValue={concern}
        filterType="concern"
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
