import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  IconChevronLeft,
  IconDental,
  IconHeart,
  IconMan,
  IconMoodNeutral,
  IconMoodSmile,
  IconWhirl,
} from "@tabler/icons-react";
import { ActionIcon, Group, Title } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import { useRouter } from "@/helpers/custom-router";
import FilterButton from "../FilterButton";
import FilterDropdown from "../FilterDropdown";
import { FilterItemType } from "../FilterDropdown/types";
import SearchButton from "../SearchButton";
import classes from "./PageHeader.module.css";

const typeData = [
  { label: "Head", icon: <IconMoodSmile className="icon" />, value: "head" },
  { label: "Body", icon: <IconMan className="icon" />, value: "body" },
  { label: "Health", icon: <IconHeart className="icon" />, value: "health" },
];

const partData = [
  { label: "Face", icon: <IconMoodNeutral className="icon" />, value: "face", type: "head" },
  { label: "Mouth", icon: <IconDental className="icon" />, value: "mouth", type: "head" },
  { label: "Scalp", icon: <IconWhirl className="icon" />, value: "scalp", type: "head" },
];

type Props = {
  title: string;
  isDisabled?: boolean;
  showReturn?: boolean;
  hideTypeDropdown?: boolean;
  hidePartDropdown?: boolean;
  filterNames?: string[];
  onSelect?: (item?: FilterItemType) => void;
  onFilterClick?: () => void;
  onSearchClick?: () => void;
};

export default function PageHeader({
  title,
  showReturn,
  hideTypeDropdown,
  hidePartDropdown,
  isDisabled,
  filterNames = [],
  onSelect,
  onFilterClick,
  onSearchClick,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { ref, width } = useElementSize();

  const type = searchParams.get("type") || "head";
  const part = searchParams.get("part") || "face";

  const [relevantParts, setRelevantParts] = useState(partData.filter((p) => p.type === type));
  const showRightSide = !hideTypeDropdown || onSearchClick || onFilterClick;

  const activeFiltersCount = useMemo(() => {
    const allQueryParams = Array.from(searchParams.keys());
    const included = allQueryParams.filter((k) => filterNames?.includes(k));
    return included.length;
  }, [searchParams.toString()]);

  useEffect(() => {
    if (hideTypeDropdown || hidePartDropdown) return;
    const relParts = partData.filter((p) => p.type === type);
    setRelevantParts(relParts);
  }, [type]);

  return (
    <Group className={classes.container}>
      <Group className={classes.left}>
        {showReturn && (
          <ActionIcon variant="default" onClick={() => router.back()}>
            <IconChevronLeft className="icon" />
          </ActionIcon>
        )}
        <Title order={1} lineClamp={2}>
          {title}
        </Title>
      </Group>
      {showRightSide && (
        <Group className={classes.right} ref={ref}>
          {onSearchClick && <SearchButton onSearchClick={onSearchClick} maxPillWidth={width / 2} />}
          {onFilterClick && (
            <FilterButton onFilterClick={onFilterClick} activeFiltersCount={activeFiltersCount} />
          )}
          {!hideTypeDropdown && (
            <FilterDropdown
              data={typeData}
              filterType="type"
              defaultSelected={typeData.find((item) => item.value === type)}
              onSelect={onSelect}
              isDisabled={isDisabled}
              addToQuery
            />
          )}
          {!hidePartDropdown && (
            <FilterDropdown
              data={relevantParts}
              filterType="part"
              defaultSelected={relevantParts.find((item) => item.value === part)}
              onSelect={onSelect}
              isDisabled={isDisabled}
              addToQuery
            />
          )}
        </Group>
      )}
    </Group>
  );
}
