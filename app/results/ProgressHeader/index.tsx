import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IconChevronLeft } from "@tabler/icons-react";
import { ActionIcon, Group } from "@mantine/core";
import FilterDropdown from "@/components/FilterDropdown";
import { FilterItemType, FilterPartItemType } from "@/components/FilterDropdown/types";
import { partItems, positionItems } from "@/components/PageHeader/data";
import getUsersFilters from "@/functions/getUsersFilters";
import { partIcons, typeIcons } from "@/helpers/icons";
import TitleDropdown from "../TitleDropdown";
import { PositionsFilterItemType } from "./types";
import classes from "./ProgressHeader.module.css";

type Props = {
  titles: { label: string; value: string }[];
  isDisabled?: boolean;
  showReturn?: boolean;
  onSelect?: (value?: string | null) => void;
};

export default function ProgressHeader({ titles, showReturn, isDisabled }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const type = searchParams.get("type");
  const part = searchParams.get("part");
  const position = searchParams.get("position");
  const followingUserId = searchParams.get("followingUserId");

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
    getUsersFilters({ followingUserId, collection: "progress", fields: ["type"] }).then(
      (result) => {
        const { availableTypes } = result;
        setAvailableTypes(availableTypes);
      }
    );
  }, [followingUserId]);

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
        icons={partsDisabled ? undefined :partIcons}
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
    </Group>
  );
}
