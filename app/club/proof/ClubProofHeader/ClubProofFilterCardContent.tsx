import React, { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import FilterDropdown from "@/components/FilterDropdown";
import { FilterPartItemType } from "@/components/FilterDropdown/types";
import getUsersFilters from "@/functions/getFilters";
import { partIcons } from "@/helpers/icons";
import modifyQuery from "@/helpers/modifyQuery";
import classes from "./ClubProofFilterCardContent.module.css";

type Props = {
  userName?: string;
};

export default function ClubProofFilterCardContent({ userName }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [availableParts, setAvailableParts] = useState<FilterPartItemType[]>([]);

  const part = searchParams.get("part");

  const handleResetFilters = useCallback(() => {
    const query = modifyQuery({
      params: [
        { name: "type", value: null, action: "delete" },
        { name: "part", value: null, action: "delete" },
        { name: "position", value: null, action: "delete" },
      ],
    });

    router.replace(`${pathname}?${query}`);
    modals.closeAll();
  }, [pathname, modals]);

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

  const partsDisabled = availableParts.length === 0;

  return (
    <Stack className={classes.container}>
      <FilterDropdown
        data={availableParts}
        icons={partsDisabled ? undefined : partIcons}
        placeholder="Filter by part"
        selectedValue={part}
        filterType="part"
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
