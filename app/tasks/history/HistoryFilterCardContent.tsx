import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import FilterDropdown from "@/components/FilterDropdown";
import { FilterItemType } from "@/components/FilterDropdown/types";
import { partIcons } from "@/helpers/icons";
import classes from "./HistoryFilterCardContent.module.css";

type Props = {
  partItems?: FilterItemType[];
  statusItems?: FilterItemType[];
};

export default function HistoryFilterCardContent({ partItems, statusItems }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const part = searchParams.get("part");
  const status = searchParams.get("status");

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
        data={statusItems || []}
        icons={statusItems ? partIcons : undefined}
        filterType="status"
        placeholder="Filter by status"
        selectedValue={status}
        isDisabled={!statusItems}
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
