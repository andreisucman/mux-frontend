import React from "react";
import { IconChevronLeft } from "@tabler/icons-react";
import cn from "classnames";
import { ActionIcon, Group, Title } from "@mantine/core";
import { useRouter } from "@/helpers/custom-router";
import FilterDropdown from "../FilterDropdown";
import { FilterItemType } from "../FilterDropdown/types";
import SortButton from "../SortButton";
import classes from "./PageHeaderWithReturn.module.css";

type Props = {
  title: string;
  showReturn?: boolean;
  isDisabled?: boolean;
  nowrap?: boolean;
  sortItems?: { value: string; label: string }[];
  selectedValue?: string | null;
  children?: React.ReactNode;
  filterData?: FilterItemType[];
  icons?: { [key: string]: any };
  onSelect?: (key?: string | null) => void;
};

export default function PageHeaderWithReturn({
  isDisabled,
  title,
  nowrap,
  sortItems,
  showReturn,
  children,
  filterData,
  selectedValue,
  icons,
  onSelect,
}: Props) {
  const router = useRouter();

  return (
    <Group className={classes.container}>
      <Group className={classes.left}>
        {showReturn && (
          <ActionIcon variant="default" onClick={() => router.back()}>
            <IconChevronLeft className="icon" />
          </ActionIcon>
        )}
        <Title order={1} lineClamp={3} className={cn(classes.title, { [classes.nowrap]: nowrap })}>
          {title}
        </Title>
      </Group>
      {children}
      {sortItems && <SortButton sortItems={sortItems} isDisabled={isDisabled} />}
      {filterData && (
        <FilterDropdown
          isDisabled={isDisabled}
          data={filterData}
          icons={icons}
          selectedValue={selectedValue}
          placeholder="Filter by type"
          filterType="type"
          onSelect={onSelect}
          addToQuery
          allowDeselect
        />
      )}
    </Group>
  );
}
