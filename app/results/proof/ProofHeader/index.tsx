import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IconChevronLeft } from "@tabler/icons-react";
import { ActionIcon, Group } from "@mantine/core";
import { createSpotlight } from "@mantine/spotlight";
import FilterDropdown from "@/components/FilterDropdown";
import { FilterItemType, FilterPartItemType } from "@/components/FilterDropdown/types";
import SearchButton from "@/components/SearchButton";
import SortButton from "@/components/SortButton";
import { proofSortItems } from "@/data/sortItems";
import getUsersFilters from "@/functions/getUsersFilters";
import { partIcons, typeIcons } from "@/helpers/icons";
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
  const [availableTypes, setAvailableTypes] = useState<FilterItemType[]>([]);
  const [availableParts, setAvailableParts] = useState<FilterPartItemType[]>([]);
  const [relevantParts, setRelevantParts] = useState<FilterPartItemType[]>([]);

  const type = searchParams.get("type");
  const part = searchParams.get("part");

  const onSelectType = useCallback(
    (type?: string | null) => {
      let relevantParts: FilterPartItemType[];

      if (!type) {
        relevantParts = [];
      } else {
        relevantParts = availableParts.filter((part) => part.type === type);
      }
      setRelevantParts(relevantParts);
    },
    [availableParts]
  );

  useEffect(() => {
    getUsersFilters({
      collection: "proof",
      fields: ["type", "part"],
    }).then((result) => {
      const { availableTypes, availableParts } = result;
      setAvailableTypes(availableTypes);
      setAvailableParts(availableParts);

      if (type) {
        setRelevantParts(availableParts.filter((part) => part.type === type));
      }
    });
  }, []);

  const typesDisabled = isDisabled || availableTypes.length === 0;
  const partsDisabled = isDisabled || relevantParts.length === 0;

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
          <SortButton sortItems={proofSortItems} isDisabled={typesDisabled} />
          <FilterDropdown
            data={availableTypes}
            icons={typesDisabled ? undefined : typeIcons}
            placeholder="Filter by type"
            selectedValue={type}
            filterType="type"
            onSelect={onSelectType}
            allowDeselect
            isDisabled={typesDisabled}
            addToQuery
          />
          <FilterDropdown
            data={relevantParts}
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
