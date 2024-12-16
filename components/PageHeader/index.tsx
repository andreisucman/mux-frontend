import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconChevronLeft } from "@tabler/icons-react";
import { ActionIcon, Group, Title } from "@mantine/core";
import { useRouter } from "@/helpers/custom-router";
import { partIcons, typeIcons } from "@/helpers/icons";
import FilterButton from "../FilterButton";
import FilterDropdown from "../FilterDropdown";
import SearchButton from "../SearchButton";
import { partItems, typeItems } from "./data";
import classes from "./PageHeader.module.css";

type Props = {
  title: string;
  isDisabled?: boolean;
  showReturn?: boolean;
  hideTypeDropdown?: boolean;
  hidePartDropdown?: boolean;
  filterNames?: string[];
  searchCollection?: string;
  children?: React.ReactNode;
  onSelect?: (value?: string | null) => void;
  onFilterClick?: () => void;
};

export default function PageHeader({
  title,
  showReturn,
  hideTypeDropdown,
  hidePartDropdown,
  isDisabled,
  filterNames = [],
  children,
  searchCollection,
  onSelect,
  onFilterClick,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const type = searchParams.get("type");
  const part = searchParams.get("part");

  const [relevantParts, setRelevantParts] = useState(partItems.filter((p) => p.type === type));

  const activeFiltersCount = useMemo(() => {
    const allQueryParams = Array.from(searchParams.keys());
    const included = allQueryParams.filter((k) => filterNames?.includes(k));
    return included.length;
  }, [searchParams.toString()]);

  useEffect(() => {
    if (hideTypeDropdown || hidePartDropdown) return;
    const relParts = partItems.filter((p) => p.type === type);
    setRelevantParts(relParts);
  }, [type]);

  return (
    <Group className={classes.container}>
      {showReturn && (
        <ActionIcon variant="default" onClick={() => router.back()}>
          <IconChevronLeft className="icon" />
        </ActionIcon>
      )}
      <Title order={1} lineClamp={2} mr="auto">
        {title}
      </Title>
      {children}
      {onFilterClick && (
        <FilterButton onFilterClick={onFilterClick} activeFiltersCount={activeFiltersCount} />
      )}
      {!hideTypeDropdown && (
        <FilterDropdown
          data={typeItems}
          icons={typeIcons}
          filterType="type"
          placeholder="Filter by type"
          selectedValue={type}
          onSelect={onSelect}
          isDisabled={isDisabled}
          addToQuery
        />
      )}
      {!hidePartDropdown && relevantParts.length > 0 && (
        <FilterDropdown
          data={relevantParts}
          icons={partIcons}
          filterType="part"
          placeholder="Filter by part"
          selectedValue={part}
          onSelect={onSelect}
          isDisabled={isDisabled}
          addToQuery
        />
      )}
    </Group>
  );
}
