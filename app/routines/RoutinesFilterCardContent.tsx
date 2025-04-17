import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import FilterDropdown from "@/components/FilterDropdown";
import { FilterItemType } from "@/components/FilterDropdown/types";
import { partIcons } from "@/helpers/icons";
import classes from "./RoutinesFilterCardContent.module.css";

type Props = {
  concernItems?: FilterItemType[];
  partItems?: FilterItemType[];
};

export default function RoutinesFilterCardContent({ concernItems, partItems }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const part = searchParams.get("part");
  const concern = searchParams.get("concern");

  return (
    <Stack className={classes.container}>
      <FilterDropdown
        data={partItems || []}
        icons={partItems ? partIcons : undefined}
        filterType="part"
        placeholder="Filter by part"
        selectedValue={part}
        isDisabled={!partItems}
        customStyles={{ maxWidth: "unset" }}
        allowDeselect
        closeOnSelect
        addToQuery
      />
      <FilterDropdown
        data={concernItems || []}
        filterType="concern"
        placeholder="Filter by concern"
        selectedValue={concern}
        isDisabled={!concernItems}
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
