import React, { useCallback, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { IconChevronLeft } from "@tabler/icons-react";
import { ActionIcon, Group } from "@mantine/core";
import FilterDropdown from "@/components/FilterDropdown";
import { FilterItemType, FilterPartItemType } from "@/components/FilterDropdown/types";
import { partItems, positionItems } from "@/components/PageHeader/data";
import getUsersFilters from "@/functions/getUsersFilters";
import { partIcons, typeIcons } from "@/helpers/icons";
import { PositionsFilterItemType } from "../proof/ProofHeader/types";
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
  const { userName } = useParams();

  const type = searchParams.get("type");
  const part = searchParams.get("part");
  const position = searchParams.get("position");

  const [availableTypes, setAvailableTypes] = useState<FilterItemType[]>([]);
  const [relevantParts, setRelevantParts] = useState<FilterPartItemType[]>([]);
  const [relevantPositions, setRelevantPositions] = useState<PositionsFilterItemType[]>([]);

  const onSelectType = useCallback(
    (type?: string | null) => {
      let relevantParts: FilterPartItemType[] = [];
      if (type) {
        relevantParts = partItems.filter((part) => part.type === type);
      }
      setRelevantParts(relevantParts);
    },
    [partItems]
  );

  const onSelectPart = useCallback(
    (part?: string | null) => {
      let relevantPositions: PositionsFilterItemType[] = [];
      if (part) {
        relevantPositions = positionItems.filter((position) => position.parts.includes(part));
      }
      setRelevantPositions(relevantPositions);
    },
    [positionItems]
  );

  useEffect(() => {
    getUsersFilters({ userName, collection: "progress", fields: ["type"] }).then((result) => {
      const { availableTypes } = result;
      setAvailableTypes(availableTypes);
    });
  }, [userName]);

  useEffect(() => {
    if (availableTypes.length === 0) return;
    onSelectType(type);
  }, [type, availableTypes.length]);

  useEffect(() => {
    if (relevantParts.length === 0) return;
    onSelectPart(part);
  }, [part, relevantParts.length]);

  const typesDisabled = isDisabled || availableTypes.length === 0;
  const partsDisabled = isDisabled || relevantParts.length === 0;
  const positionsDisabled = isDisabled || relevantPositions.length === 0;

  return (
    <Group className={classes.container}>
      {showReturn && (
        <ActionIcon variant="default" onClick={() => router.back()}>
          <IconChevronLeft className="icon" />
        </ActionIcon>
      )}
      <TitleDropdown titles={titles} />
      {!hideDropdowns && (
        <>
          <FilterDropdown
            data={availableTypes}
            icons={typesDisabled ? undefined : typeIcons}
            filterType="type"
            selectedValue={type}
            placeholder="Filter by type"
            isDisabled={typesDisabled}
            onSelect={onSelectType}
            allowDeselect
            addToQuery
          />
          <FilterDropdown
            data={relevantParts}
            icons={partsDisabled ? undefined : partIcons}
            filterType="part"
            placeholder="Filter by part"
            selectedValue={part}
            onSelect={onSelectPart}
            isDisabled={partsDisabled}
            allowDeselect
            addToQuery
          />
          <FilterDropdown
            data={relevantPositions}
            filterType="position"
            placeholder="Filter by position"
            selectedValue={position}
            isDisabled={positionsDisabled}
            allowDeselect
            addToQuery
          />
        </>
      )}
    </Group>
  );
}
