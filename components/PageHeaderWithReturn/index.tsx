import React from "react";
import { useSearchParams } from "next/navigation";
import { IconChevronLeft } from "@tabler/icons-react";
import cn from "classnames";
import { ActionIcon, Group, Title } from "@mantine/core";
import { useRouter } from "@/helpers/custom-router";
import FilterDropdown from "../FilterDropdown";
import { FilterItemType } from "../FilterDropdown/types";
import classes from "./PageHeaderWithReturn.module.css";

type Props = {
  title: string;
  showReturn?: boolean;
  isDisabled?: boolean;
  nowrap?: boolean;
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
