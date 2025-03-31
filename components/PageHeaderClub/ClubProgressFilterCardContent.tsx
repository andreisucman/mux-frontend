import React, { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button, Stack } from "@mantine/core";
import FilterDropdown from "@/components/FilterDropdown";
import { FilterPartItemType } from "@/components/FilterDropdown/types";
import getUsersFilters from "@/functions/getFilters";
import { partIcons } from "@/helpers/icons";
import classes from "./ClubProgressFilterCardContent.module.css";

type Props = {
  userName?: string;
};

export default function ClubProgressFilterCardContent({ userName }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const part = searchParams.get("part");

  const [availableParts, setAvailableParts] = useState<FilterPartItemType[]>();

  useEffect(() => {
    getUsersFilters({ userName, collection: "progress", fields: ["part"] }).then((result) => {
      const { availableParts } = result;
      setAvailableParts(availableParts);
    });
  }, [userName]);

  return (
    <Stack className={classes.container}>
      <FilterDropdown
        data={availableParts || []}
        icons={availableParts ? partIcons : undefined}
        filterType="part"
        placeholder="Filter by part"
        selectedValue={part}
        isDisabled={!availableParts}
        customStyles={{ maxWidth: "unset" }}
        allowDeselect
        addToQuery
        closeOnSelect
      />
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
