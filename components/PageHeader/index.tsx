"use client";

import React, { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IconChevronLeft } from "@tabler/icons-react";
import cn from "classnames";
import { ActionIcon, Group, Title } from "@mantine/core";
import TitleDropdown, { TitleType } from "@/app/results/TitleDropdown";
import FilterButton from "../FilterButton";
import SortButton from "../SortButton";
import classes from "./PageHeader.module.css";

type Props = {
  title?: string | React.ReactNode;
  titles?: TitleType[];
  childrenPosition?: "first" | "last";
  hideReturn?: boolean;
  nowrapTitle?: boolean;
  nowrapContainer?: boolean;
  disableSort?: boolean;
  disableFilter?: boolean;
  sortItems?: { value: string; label: string }[];
  defaultSortValue?: string;
  filterNames?: string[];
  children?: React.ReactNode;
  onFilterClick?: () => void;
  center?: boolean;
};

export default function PageHeader({
  title,
  titles,
  nowrapTitle,
  nowrapContainer,
  disableSort,
  disableFilter,
  sortItems,
  defaultSortValue,
  filterNames = [],
  hideReturn,
  children,
  center,
  childrenPosition = "last",
  onFilterClick,
}: Props) {
  const router = useRouter();
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
            className={cn(classes.title, {
              [classes.nowrapTitle]: nowrapTitle,
            })}
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
    <Group
      className={cn(classes.container, {
        [classes.nowrapContainer]: nowrapContainer,
        [classes.center]: center,
      })}
    >
      {!hideReturn && (
        <ActionIcon variant="default" onClick={() => router.back()}>
          <IconChevronLeft size={20} />
        </ActionIcon>
      )}
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
