import React, { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import { PositionsFilterItemType } from "@/app/results/proof/ProofHeader/types";
import FilterDropdown from "@/components/FilterDropdown";
import { FilterPartItemType } from "@/components/FilterDropdown/types";
import { positionItems } from "@/components/PageHeader/data";
import getUsersFilters from "@/functions/getUsersFilters";
import { partIcons } from "@/helpers/icons";
import modifyQuery from "@/helpers/modifyQuery";
import classes from "./ClubProgressFilterCardContent.module.css";

type Props = {
  userName?: string;
};

export default function ClubProgressFilterCardContent({ userName }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const part = searchParams.get("part");
  const position = searchParams.get("position");

  const [availableParts, setAvailableParts] = useState<FilterPartItemType[]>([]);
  const [relevantPositions, setRelevantPositions] = useState<PositionsFilterItemType[]>([]);

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
        { name: "part", value: null, action: "delete" },
        { name: "position", value: null, action: "delete" },
      ],
    });
    modals.closeAll();
    router.replace(`${pathname}?${query}`);
  };

  useEffect(() => {
    getUsersFilters({ userName, collection: "progress", fields: ["part"] }).then((result) => {
      const { availableParts } = result;
      setAvailableParts(availableParts);
    });
  }, [userName]);

  useEffect(() => {
    if (availableParts.length === 0) return;
    onSelectPart(part);
  }, [part, availableParts.length]);

  const partsDisabled = availableParts.length === 0;
  const positionsDisabled = relevantPositions.length === 0;

  return (
    <Stack className={classes.container}>
      <FilterDropdown
        data={availableParts}
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
        Reset
      </Button>
    </Stack>
  );
}
