import React, { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IconFilterOff } from "@tabler/icons-react";
import { Button, rem, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import FilterDropdown from "@/components/FilterDropdown";
import { FilterItemType, FilterPartItemType } from "@/components/FilterDropdown/types";
import getUsersFilters from "@/functions/getUsersFilters";
import { partIcons, typeIcons } from "@/helpers/icons";
import modifyQuery from "@/helpers/modifyQuery";
import classes from "./ClubProofFilterCardContent.module.css";

export default function ClubProofFilterCardContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [availableTypes, setAvailableTypes] = useState<FilterItemType[]>([]);
  const [availableParts, setAvailableParts] = useState<FilterPartItemType[]>([]);
  const [relevantParts, setRelevantParts] = useState<FilterPartItemType[]>([]);

  const followingUserId = searchParams.get("id");
  const part = searchParams.get("part");
  const type = searchParams.get("type");

  const handleResetFilters = () => {
    const query = modifyQuery({
      params: [
        { name: "type", value: null, action: "delete" },
        { name: "part", value: null, action: "delete" },
        { name: "position", value: null, action: "delete" },
      ],
    });

    router.replace(`${pathname}?${query}`);
    modals.closeAll();
  };

  const onSelectType = (type?: string | null) => {
    let relevantParts: FilterPartItemType[];

    if (!type) {
      relevantParts = [];
    } else {
      relevantParts = availableParts.filter((part) => part.type === type);
    }
    setRelevantParts(relevantParts);
  };

  useEffect(() => {
    getUsersFilters({
      followingUserId,
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
  }, [followingUserId]);

  const typesDisabled = availableTypes.length === 0;
  const partsDisabled = relevantParts.length === 0;

  return (
    <Stack className={classes.container}>
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
      <Button onClick={handleResetFilters} variant="default">
        <IconFilterOff className="icon icon__small" style={{ marginRight: rem(8) }} /> Reset
      </Button>
    </Stack>
  );
}
