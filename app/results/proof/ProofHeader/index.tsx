import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IconChevronLeft } from "@tabler/icons-react";
import { ActionIcon, Group } from "@mantine/core";
import { createSpotlight } from "@mantine/spotlight";
import FilterDropdown from "@/components/FilterDropdown";
import { FilterPartItemType } from "@/components/FilterDropdown/types";
import SearchButton from "@/components/SearchButton";
import SortButton from "@/components/SortButton";
import { proofSortItems } from "@/data/sortItems";
import getUsersFilters from "@/functions/getUsersFilters";
import { partIcons } from "@/helpers/icons";
import TitleDropdown from "../../TitleDropdown";
import classes from "./ProofHeader.module.css";

type Props = {
  titles: { label: string; value: string }[];
  showReturn?: boolean;
  isDisabled?: boolean;
};

const [spotlightStore, proofSpotlight] = createSpotlight();

export default function ProofHeader({ showReturn, isDisabled, titles }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [availableParts, setAvailableParts] = useState<FilterPartItemType[]>([]);

  const part = searchParams.get("part");

  useEffect(() => {
    getUsersFilters({
      collection: "proof",
      fields: ["part"],
    }).then((result) => {
      const { availableParts } = result;
      setAvailableParts(availableParts);
    });
  }, []);

  const partsDisabled = isDisabled || availableParts.length === 0;

  return (
    <>
      <Group className={classes.container}>
        {showReturn && (
          <ActionIcon variant="default" onClick={() => router.back()}>
            <IconChevronLeft className="icon" />
          </ActionIcon>
        )}
        <TitleDropdown titles={titles} />
        <>
          <SortButton sortItems={proofSortItems} isDisabled={partsDisabled} />
          <FilterDropdown
            data={availableParts}
            icons={partsDisabled ? undefined : partIcons}
            placeholder="Filter by part"
            selectedValue={part}
            filterType="part"
            isDisabled={partsDisabled}
            allowDeselect
            addToQuery
          />
          <SearchButton
            collection="proof"
            searchPlaceholder="Search proof"
            spotlight={proofSpotlight}
            spotlightStore={spotlightStore}
            showActivityIndicator
          />
        </>
      </Group>
    </>
  );
}
