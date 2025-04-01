import React, { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import cn from "classnames";
import { Group, Title } from "@mantine/core";
import TitleDropdown, { TitleType } from "@/app/results/TitleDropdown";
import FilterButton from "../FilterButton";
import SortButton from "../SortButton";
import classes from "./PageHeader.module.css";

type Props = {
  title?: string | React.ReactNode;
  titles?: TitleType[];
  nowrapTitle?: boolean;
  nowrapContainer?: boolean;
  isDisabled?: boolean;
  sortItems?: { value: string; label: string }[];
  defaultSortValue?: string;
  filterNames?: string[];
  children?: React.ReactNode;
  onFilterClick?: () => void;
};

export default function PageHeader({
  title,
  titles,
  nowrapTitle,
  nowrapContainer,
  isDisabled,
  sortItems,
  defaultSortValue,
  filterNames = [],
  children,
  onFilterClick,
}: Props) {
  const searchParams = useSearchParams();

  const activeFiltersCount = useMemo(() => {
    const allQueryParams = Array.from(searchParams.keys());
    const included = allQueryParams.filter((k) => filterNames?.includes(k));
    return included.length;
  }, [searchParams.toString()]);

  const finalTitle = useMemo(() => {
    if (titles) {
      return <TitleDropdown titles={titles} />;
    } else {
      if (typeof title === "string") {
        return (
          <Title
            order={1}
            lineClamp={3}
            className={cn(classes.title, { [classes.nowrapTitle]: nowrapTitle })}
          >
            {title}
          </Title>
        );
      } else {
        return title;
      }
    }
  }, [titles, title]);

  return (
    <Group className={cn(classes.container, { [classes.nowrapContainer]: nowrapContainer })}>
      {finalTitle}
      {children}
      {sortItems && (
        <SortButton
          sortItems={sortItems}
          defaultSortValue={defaultSortValue}
          isDisabled={isDisabled}
        />
      )}
      {onFilterClick && (
        <FilterButton
          isDisabled={isDisabled}
          onFilterClick={onFilterClick}
          activeFiltersCount={activeFiltersCount}
        />
      )}
    </Group>
  );
}
