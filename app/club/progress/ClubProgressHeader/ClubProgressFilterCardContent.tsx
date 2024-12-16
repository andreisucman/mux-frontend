import React, { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IconFilterOff } from "@tabler/icons-react";
import { Button, rem, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import { PositionsFilterItemType } from "@/app/results/proof/ProofHeader/types";
import FilterDropdown from "@/components/FilterDropdown";
import { FilterItemType, FilterPartItemType } from "@/components/FilterDropdown/types";
import { partItems, positionItems } from "@/components/PageHeader/data";
import getUsersFilters from "@/functions/getUsersFilters";
import { partIcons, typeIcons } from "@/helpers/icons";
import modifyQuery from "@/helpers/modifyQuery";
import classes from "./ClubProgressFilterCardContent.module.css";

type Props = {
  userName?: string;
};

export default function ClubProgressFilterCardContent({ userName }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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

  const handleResetFilters = () => {
    const query = modifyQuery({
      params: [
        { name: "type", value: null, action: "delete" },
        { name: "part", value: null, action: "delete" },
        { name: "position", value: null, action: "delete" },
      ],
    });
    modals.closeAll();
    router.replace(`${pathname}?${query}`);
  };

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

  const typesDisabled = availableTypes.length === 0;
  const partsDisabled = relevantParts.length === 0;
  const positionsDisabled = relevantPositions.length === 0;

  return (
    <Stack className={classes.container}>
      <FilterDropdown
        data={availableTypes}
        icons={typesDisabled ? undefined : typeIcons}
        filterType="type"
        selectedValue={type}
        placeholder="Filter by type"
        isDisabled={typesDisabled}
        onSelect={onSelectType}
        customStyles={{ maxWidth: "unset" }}
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
        customStyles={{ maxWidth: "unset" }}
        allowDeselect
        addToQuery
      />
      <FilterDropdown
        data={relevantPositions}
        filterType="position"
        placeholder="Filter by position"
        selectedValue={position}
        isDisabled={positionsDisabled}
        customStyles={{ maxWidth: "unset" }}
        allowDeselect
        addToQuery
      />
      <Button onClick={handleResetFilters} variant="default">
        <IconFilterOff className="icon icon__small" style={{ marginRight: rem(8) }} /> Reset
      </Button>
    </Stack>
  );
}
