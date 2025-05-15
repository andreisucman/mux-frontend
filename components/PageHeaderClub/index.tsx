import React, { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IconChevronLeft } from "@tabler/icons-react";
import cn from "classnames";
import { ActionIcon, Group, Title } from "@mantine/core";
import TitleDropdown, { TitleType } from "@/app/results/TitleDropdown";
import FilterButton from "../FilterButton";
import SortButton from "../SortButton";
import classes from "./PageHeaderClub.module.css";

type Props = {
  title?: string;
  titles?: TitleType[];
  nowrap?: boolean;
  disableFilter?: boolean;
  disableSort?: boolean;
  sortItems?: { value: string; label: string }[];
  filterNames?: string[];
  defaultSortValue?: string;
  children?: React.ReactNode;
  userName: string;
  pageType: string;
  childrenPosition?: "first" | "last";
  onFilterClick?: () => void;
};

export default function PageHeaderClub({
  title,
  titles,
  nowrap,
  disableFilter,
  disableSort,
  sortItems,
  filterNames = [],
  defaultSortValue,
  children,
  childrenPosition = "last",
  onFilterClick,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeFiltersCount = useMemo(() => {
    const allQueryParams = Array.from(searchParams.keys());
    const included = allQueryParams.filter((k) => filterNames.includes(k));
    return included.length;
  }, [searchParams.toString()]);

  const finalTitle = useMemo(() => {
    if (titles) {
      return <TitleDropdown titles={titles} />;
    } else {
      return (
        <Title order={1} lineClamp={3} className={cn(classes.title, { [classes.nowrap]: nowrap })}>
          {title}
        </Title>
      );
    }
  }, [titles, title]);

  return (
    <Group className={classes.container}>
      <ActionIcon variant="default" onClick={() => router.back()}>
        <IconChevronLeft className="icon" />
      </ActionIcon>
      {finalTitle}
      {childrenPosition === "first" && children}
      {sortItems && (
        <SortButton
          sortItems={sortItems}
          defaultSortValue={defaultSortValue}
          isDisabled={disableSort}
        />
      )}
      {onFilterClick && (
        <FilterButton
          isDisabled={disableFilter}
          onFilterClick={onFilterClick}
          activeFiltersCount={activeFiltersCount}
        />
      )}
      {childrenPosition === "last" && children}
    </Group>
  );
}
