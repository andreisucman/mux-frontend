import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconChevronLeft } from "@tabler/icons-react";
import { ActionIcon, Group, Title } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
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
  children?: React.ReactNode;
  onSelect?: (value?: string | null) => void;
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
  children,
  onSelect,
  onFilterClick,
  onSearchClick,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { ref, width } = useElementSize();

  const type = searchParams.get("type") || "head";
  const part = searchParams.get("part") || "face";

  const [relevantParts, setRelevantParts] = useState(partItems.filter((p) => p.type === type));
  const showRightSide = !hideTypeDropdown || onSearchClick || onFilterClick || children;

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
          {children}
          {onSearchClick && <SearchButton onSearchClick={onSearchClick} maxPillWidth={width / 2} />}
          {onFilterClick && (
            <FilterButton onFilterClick={onFilterClick} activeFiltersCount={activeFiltersCount} />
          )}
          {!hideTypeDropdown && (
            <FilterDropdown
              data={typeItems}
              icons={typeIcons}
              filterType="type"
              placeholder="Select type"
              defaultSelected={typeItems.find((item) => item.value === type)?.value}
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
              placeholder="Select part"
              defaultSelected={relevantParts.find((item) => item.value === part)?.value}
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
