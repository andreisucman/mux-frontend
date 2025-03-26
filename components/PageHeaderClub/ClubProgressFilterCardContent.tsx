import React, { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import FilterDropdown from "@/components/FilterDropdown";
import { FilterPartItemType } from "@/components/FilterDropdown/types";
import getUsersFilters from "@/functions/getFilters";
import { partIcons } from "@/helpers/icons";
import modifyQuery from "@/helpers/modifyQuery";
import classes from "./ClubProgressFilterCardContent.module.css";

type Props = {
  userName?: string;
};

export default function ClubProgressFilterCardContent({ userName }: Props) {
  const searchParams = useSearchParams();

  const part = searchParams.get("part");

  const [availableParts, setAvailableParts] = useState<FilterPartItemType[]>([]);

  useEffect(() => {
    getUsersFilters({ userName, collection: "progress", fields: ["part"] }).then((result) => {
      const { availableParts } = result;
      setAvailableParts(availableParts);
    });
  }, [userName]);

  const partsDisabled = availableParts.length === 0;

  return (
    <Stack className={classes.container}>
      <FilterDropdown
        data={availableParts}
        icons={partsDisabled ? undefined : partIcons}
        filterType="part"
        placeholder="Filter by part"
        selectedValue={part}
        isDisabled={partsDisabled}
        customStyles={{ maxWidth: "unset" }}
        allowDeselect
        addToQuery
        closeOnSelect
      />
    </Stack>
  );
}
