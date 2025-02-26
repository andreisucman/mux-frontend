import React, { useCallback, useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { IconChevronLeft } from "@tabler/icons-react";
import { ActionIcon, Group, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import FilterButton from "@/components/FilterButton";
import FilterDropdown from "@/components/FilterDropdown";
import { clubPageTypeItems } from "@/components/PageHeader/data";
import SortButton from "@/components/SortButton";
import { useRouter } from "@/helpers/custom-router";
import getPageTypeRedirect from "@/helpers/getPageTypeRedirect";
import { pageTypeIcons } from "@/helpers/icons";
import classes from "./ClubHeader.module.css";

type Props = {
  title: string;
  activeFiltersCount?: number;
  isDisabled?: boolean;
  showReturn?: boolean;
  filterNames?: string[];
  children?: React.ReactNode;
  sortItems?: { value: string; label: string }[];
  pageType: string;
  onFilterClick?: (value?: string | null) => void;
};

export default function ClubHeader({
  title,
  showReturn,
  isDisabled,
  children,
  pageType,
  sortItems,
  filterNames,
  onFilterClick,
}: Props) {
  const isMobile = useMediaQuery("(max-width: 36em)");
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const userName = Array.isArray(params?.userName) ? params?.userName?.[0] : params.userName;

  const activeFiltersCount = useMemo(() => {
    const allQueryParams = Array.from(searchParams.keys());
    const included = allQueryParams.filter((k) => filterNames?.includes(k));
    return included.length;
  }, [searchParams.toString()]);

  const handleRedirect = useCallback(
    (pageName?: string | null) => {
      if (!pageName) return;
      const path = getPageTypeRedirect(pageName, userName);

      router.replace(path);
    },
    [userName]
  );

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
      {children}
      {sortItems && <SortButton sortItems={sortItems} isDisabled={isDisabled} />}
      {onFilterClick && (
        <FilterButton
          isDisabled={isDisabled}
          onFilterClick={onFilterClick}
          activeFiltersCount={activeFiltersCount}
        />
      )}
      {isMobile && (
        <FilterDropdown
          icons={pageTypeIcons}
          data={clubPageTypeItems}
          selectedValue={pageType}
          onSelect={handleRedirect}
          placeholder="Select page"
          filterType="page"
        />
      )}
      {!isMobile && (
        <FilterDropdown
          icons={pageTypeIcons}
          data={clubPageTypeItems}
          selectedValue={pageType}
          onSelect={handleRedirect}
          placeholder="Select page"
          filterType="page"
        />
      )}
    </Group>
  );
}
