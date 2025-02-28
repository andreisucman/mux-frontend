import React, { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { IconChevronLeft } from "@tabler/icons-react";
import cn from "classnames";
import { ActionIcon, Group, Title } from "@mantine/core";
import TitleDropdown from "@/app/results/TitleDropdown";
import { useRouter } from "@/helpers/custom-router";
import FilterButton from "../FilterButton";
import SortButton from "../SortButton";
import classes from "./PageHeader.module.css";

type Props = {
  title?: string | React.ReactNode;
  titles?: { label: string; value: string }[];
  isDisabled?: boolean;
  showReturn?: boolean;
  hidePartDropdown?: boolean;
  sortItems?: { value: string; label: string }[];
  filterNames?: string[];
  children?: React.ReactNode;
  nowrapTitle?: boolean;
  nowrapContainer?: boolean;
  onSelect?: (value?: string | null) => void;
  onFilterClick?: () => void;
};

export default function PageHeader({
  title,
  titles,
  nowrapTitle,
  nowrapContainer,
  showReturn,
  isDisabled,
  sortItems,
  filterNames = [],
  children,
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
      {showReturn && (
        <ActionIcon variant="default" onClick={() => router.back()}>
          <IconChevronLeft className="icon" />
        </ActionIcon>
      )}
      {finalTitle}
      {children}
      {sortItems && <SortButton sortItems={sortItems} isDisabled={isDisabled} />}
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
