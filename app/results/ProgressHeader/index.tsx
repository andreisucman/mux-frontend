import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IconChevronLeft } from "@tabler/icons-react";
import { ActionIcon, Group } from "@mantine/core";
import FilterDropdown from "@/components/FilterDropdown";
import { FilterItemType } from "@/components/FilterDropdown/types";
import SortButton from "@/components/SortButton";
import { progressSortItems } from "@/data/sortItems";
import getUsersFilters from "@/functions/getUsersFilters";
import { partIcons } from "@/helpers/icons";
import TitleDropdown from "../TitleDropdown";
import classes from "./ProgressHeader.module.css";

type Props = {
  titles: { label: string; value: string }[];
  isDisabled?: boolean;
  hideDropdowns?: boolean;
  showReturn?: boolean;
  onSelect?: (value?: string | null) => void;
};

export default function ProgressHeader({ titles, showReturn, hideDropdowns, isDisabled }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const part = searchParams.get("part");

  const [availableParts, setAvaiableParts] = useState<FilterItemType[]>([]);

  useEffect(() => {
    getUsersFilters({ collection: "progress", fields: ["part"] }).then((result) => {
      const { availableParts } = result;
      setAvaiableParts(availableParts);
    });
  }, []);

  const partsDisabled = isDisabled || availableParts.length === 0;

  return (
    <Group className={classes.container}>
      {showReturn && (
        <ActionIcon variant="default" onClick={() => router.back()}>
          <IconChevronLeft className="icon" />
        </ActionIcon>
      )}
      <TitleDropdown titles={titles} />
      <SortButton sortItems={progressSortItems} isDisabled={partsDisabled} />
      {!hideDropdowns && (
        <>
          <FilterDropdown
            data={availableParts}
            icons={partsDisabled ? undefined : partIcons}
            filterType="part"
            placeholder="Filter by part"
            selectedValue={part}
            isDisabled={partsDisabled}
            allowDeselect
            addToQuery
          />
        </>
      )}
    </Group>
  );
}
