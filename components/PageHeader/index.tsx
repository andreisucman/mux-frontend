import React, { useCallback } from "react";
import { useRouter as useOriginalRouter, usePathname, useSearchParams } from "next/navigation";
import {
  IconChevronLeft,
  IconFilter,
  IconHeart,
  IconMan,
  IconMoodSmile,
  IconSearch,
} from "@tabler/icons-react";
import { ActionIcon, Group, Pill, rem, Title } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import { useRouter } from "@/helpers/custom-router";
import modifyQuery from "@/helpers/modifyQuery";
import FilterDropdown from "../FilterDropdown";
import { FilterItemType } from "../FilterDropdown/types";
import classes from "./PageHeader.module.css";

const filterData = [
  { label: "Head", icon: <IconMoodSmile className="icon" />, value: "head" },
  { label: "Body", icon: <IconMan className="icon" />, value: "body" },
  { label: "Health", icon: <IconHeart className="icon" />, value: "health" },
];

type Props = {
  title: string;
  isDisabled?: boolean;
  showReturn?: boolean;
  hideDropdown?: boolean;
  onSelect?: (item?: FilterItemType) => void;
  onFilterClick?: () => void;
  onSearchClick?: () => void;
};

export default function PageHeader({
  title,
  showReturn,
  hideDropdown,
  isDisabled,
  onSelect,
  onFilterClick,
  onSearchClick,
}: Props) {
  const router = useRouter();
  const originalRouter = useOriginalRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "head";
  const query = searchParams.get("query");

  const { ref, width } = useElementSize();

  const removeSearchQuery = useCallback(() => {
    const newQuery = modifyQuery({ params: [{ name: "query", value: null, action: "delete" }] });
    let newUrl = pathname;
    if (newQuery) newUrl += `?${newQuery}`;
    originalRouter.replace(newUrl);
  }, []);

  const showRightSide = !hideDropdown || onSearchClick || onFilterClick;

  return (
    <Group className={classes.container}>
      <Group className={classes.left}>
        {showReturn && (
          <ActionIcon variant="default" onClick={() => router.back()}>
            <IconChevronLeft className="icon" />
          </ActionIcon>
        )}
        <Title order={1}>{title}</Title>
      </Group>
      {showRightSide && (
        <Group className={classes.right} ref={ref}>
          {!hideDropdown && (
            <FilterDropdown
              data={filterData}
              filterType="type"
              defaultSelected={filterData.find((item) => item.value === type)}
              onSelect={onSelect}
              isDisabled={isDisabled}
              addToQuery
            />
          )}
          {onSearchClick && (
            <Group className={classes.searchGroup}>
              {query && (
                <Pill
                  className={classes.pill}
                  styles={{ root: { maxWidth: rem(width / 2) } }}
                  onRemove={removeSearchQuery}
                  withRemoveButton
                >
                  {query}
                </Pill>
              )}
              <ActionIcon variant="default" onClick={onSearchClick}>
                <IconSearch className="icon icon__small" />
              </ActionIcon>
            </Group>
          )}
          {onFilterClick && (
            <Group className={classes.filterGroup}>
              <ActionIcon variant="default" onClick={onFilterClick}>
                <IconFilter className="icon" />
              </ActionIcon>
            </Group>
          )}
        </Group>
      )}
    </Group>
  );
}
