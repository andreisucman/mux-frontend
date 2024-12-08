import React, { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IconChevronLeft } from "@tabler/icons-react";
import { ActionIcon, Group } from "@mantine/core";
import FilterDropdown from "@/components/FilterDropdown";
import { FilterItemType, FilterPartItemType } from "@/components/FilterDropdown/types";
import { partIcons, partItems, positionItems, typeIcons } from "@/components/PageHeader/data";
import callTheServer from "@/functions/callTheServer";
import getUsersFilters from "@/functions/getUsersFilters";
import modifyQuery from "@/helpers/modifyQuery";
import TitleDropdown from "../TitleDropdown";
import { PositionsFilterItemType } from "./types";
import classes from "./ProgressHeader.module.css";

const typeItems = [
  { label: "Head", value: "head" },
  { label: "Body", value: "body" },
];

type Props = {
  titles: { label: string; value: string }[];
  isDisabled?: boolean;
  showReturn?: boolean;
  onSelect?: (value?: string | null) => void;
};

export default function ProgressHeader({ titles, showReturn, isDisabled, onSelect }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const type = searchParams.get("type") || "head";
  const part = searchParams.get("part");
  const position = searchParams.get("position");
  const followingUserId = searchParams.get("followingUserId");

  const [availableTypes, setAvailableTypes] = useState<FilterItemType[]>([]);
  const [availableParts, setAvailableParts] = useState<FilterPartItemType[]>([]);
  const [relevantTypes, setRelevantTypes] = useState<FilterItemType[]>([]);
  const [relevantParts, setRelevantParts] = useState<FilterPartItemType[]>([]);
  const [relevantPositions, setRelevantPositions] = useState<PositionsFilterItemType[]>([]);

  useEffect(() => {
    getUsersFilters({ followingUserId, collection: "progress", fields: ["type", "part"] }).then(
      (result) => {
        const { availableParts, availableTypes } = result;
        setAvailableTypes(availableTypes);
        setAvailableParts(availableParts);
      }
    );
  }, [followingUserId]);

  useEffect(() => {
    const firstAvailableType = availableTypes[0];

    const relevantTypes = availableTypes.filter(
      (item) => item.value === type || firstAvailableType.value
    );

    setRelevantTypes(relevantTypes);

    const firstRelevantType = relevantTypes[0];

    const relevantParts = availableParts.filter((p) => p.type === type || firstRelevantType.value);

    setRelevantParts(relevantParts);

    if (relevantParts.length > 0) {
      const firstRelevantPart = relevantParts[0];

      const relevantPositions = positionItems.filter((p) => {
        const relevantPartValue = part || firstRelevantPart?.value;

        if (relevantPartValue) {
          return p.types.includes(type) && p.parts.includes(relevantPartValue);
        } else {
          return p.types.includes(type);
        }
      });

      setRelevantPositions(relevantPositions);
    }

    const params = [];

    if (relevantPositions.length === 0) {
      params.push({ name: "position", value: null, action: "delete" });
    }

    if (relevantParts.length === 0) {
      params.push({ name: "part", value: null, action: "delete" });
    }

    if (relevantTypes.length === 0) {
      params.push({ name: "type", value: null, action: "delete" });
    }

    if (params.length > 0) {
      const newQuery = modifyQuery({ params });
      router.replace(`${pathname}?${newQuery}`);
    }
  }, [type, part, availableTypes.length]);

  return (
    <Group className={classes.container}>
      <Group className={classes.left}>
        {showReturn && (
          <ActionIcon variant="default" onClick={() => router.back()}>
            <IconChevronLeft className="icon" />
          </ActionIcon>
        )}
        <TitleDropdown titles={titles} />
      </Group>
      {relevantTypes.length > 0 && (
        <FilterDropdown
          data={relevantTypes}
          icons={typeIcons}
          filterType="type"
          defaultSelected={relevantTypes.find((item) => item.value === type)?.value}
          onSelect={onSelect}
          placeholder="Select type"
          isDisabled={isDisabled}
          addToQuery
        />
      )}
      {relevantParts.length > 0 && (
        <FilterDropdown
          data={relevantParts}
          icons={partIcons}
          filterType="part"
          placeholder="Select part"
          defaultSelected={relevantParts.find((item) => item.value === part)?.value}
          onSelect={onSelect}
          isDisabled={isDisabled}
          addToQuery
        />
      )}
      {relevantPositions.length > 0 && (
        <FilterDropdown
          data={relevantPositions}
          filterType="position"
          placeholder="Select position"
          defaultSelected={relevantPositions.find((item) => item.value === position)?.value}
          onSelect={onSelect}
          isDisabled={isDisabled}
          addToQuery
        />
      )}
    </Group>
  );
}
