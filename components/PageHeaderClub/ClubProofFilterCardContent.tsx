import React, { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import FilterDropdown from "@/components/FilterDropdown";
import { FilterPartItemType } from "@/components/FilterDropdown/types";
import getUsersFilters from "@/functions/getFilters";
import { partIcons } from "@/helpers/icons";
import classes from "./ClubProofFilterCardContent.module.css";

type Props = {
  userName?: string;
};

export default function ClubProofFilterCardContent({ userName }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [availableParts, setAvailableParts] = useState<FilterPartItemType[]>();

  const part = searchParams.get("part");

  useEffect(() => {
    getUsersFilters({
      userName,
      collection: "proof",
      fields: ["part"],
    }).then((result) => {
      const { availableParts } = result;

      setAvailableParts(availableParts);
    });
  }, [userName]);

  return (
    <Stack className={classes.container}>
      <FilterDropdown
        data={availableParts || []}
        icons={availableParts ? partIcons : undefined}
        placeholder="Filter by part"
        selectedValue={part}
        filterType="part"
        isDisabled={!availableParts}
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
