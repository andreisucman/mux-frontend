import React, { useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import cn from "classnames";
import { Group, Title } from "@mantine/core";
import TitleDropdown from "@/app/results/TitleDropdown";
import { useRouter } from "@/helpers/custom-router";
import getPageTypeRedirect from "@/helpers/getPageTypeRedirect";
import { pageTypeIcons } from "@/helpers/icons";
import FilterButton from "../FilterButton";
import FilterDropdown from "../FilterDropdown";
import { clubPageTypeItems } from "../PageHeader/data";
import SortButton from "../SortButton";
import classes from "./PageHeaderClub.module.css";

type Props = {
  title?: string;
  titles?: { label: string; value: string }[];
  nowrap?: boolean;
  isDisabled?: boolean;
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
  isDisabled,
  sortItems,
  filterNames = [],
  defaultSortValue,
  children,
  userName,
  pageType,
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

  const handleRedirect = useCallback(
    (value?: string | null) => {
      if (!value) return;

      const path = getPageTypeRedirect(value, userName);

      router.push(`${path}?${searchParams.toString()}`);
    },
    [userName, searchParams.toString()]
  );

  return (
    <Group className={classes.container}>
      {finalTitle}
      {childrenPosition === "first" && children}
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
      <FilterDropdown
        icons={pageTypeIcons}
        data={clubPageTypeItems}
        selectedValue={pageType}
        onSelect={handleRedirect}
        placeholder="Select page"
        filterType="page"
      />
      {childrenPosition === "last" && children}
    </Group>
  );
}
