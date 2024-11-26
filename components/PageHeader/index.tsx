import React, { useCallback, useEffect, useState } from "react";
import { useRouter as useOriginalRouter, usePathname, useSearchParams } from "next/navigation";
import {
  IconChevronLeft,
  IconDental,
  IconFilter,
  IconHeart,
  IconMan,
  IconMoodNeutral,
  IconMoodSmile,
  IconSearch,
  IconWhirl,
} from "@tabler/icons-react";
import { ActionIcon, Group, Pill, rem, Title } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import { useRouter } from "@/helpers/custom-router";
import modifyQuery from "@/helpers/modifyQuery";
import FilterDropdown from "../FilterDropdown";
import { FilterItemType } from "../FilterDropdown/types";
import classes from "./PageHeader.module.css";

const typeData = [
  { label: "Head", icon: <IconMoodSmile className="icon" />, value: "head" },
  { label: "Body", icon: <IconMan className="icon" />, value: "body" },
  { label: "Health", icon: <IconHeart className="icon" />, value: "health" },
];

const partData = [
  { label: "Face", icon: <IconMoodNeutral className="icon" />, value: "face", type: "head" },
  { label: "Mouth", icon: <IconDental className="icon" />, value: "mouth", type: "head" },
  { label: "Scalp", icon: <IconWhirl className="icon" />, value: "scalp", type: "head" },
];

type Props = {
  title: string;
  isDisabled?: boolean;
  showReturn?: boolean;
  hideTypeDropdown?: boolean;
  hidePartDropdown?: boolean;
  onSelect?: (item?: FilterItemType) => void;
  onFilterClick?: () => void;
  onSearchClick?: () => void;
};

export default function PageHeader({
  title,
  showReturn,
  hideTypeDropdown,
  hidePartDropdown,
  isDisabled,
  onSelect,
  onFilterClick,
  onSearchClick,
}: Props) {
  const router = useRouter();
  const originalRouter = useOriginalRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { ref, width } = useElementSize();

  const type = searchParams.get("type") || "head";
  const part = searchParams.get("part") || "face";
  const query = searchParams.get("query");

  const [relevantParts, setRelevantParts] = useState(partData.filter((p) => p.type === type));

  const removeSearchQuery = useCallback(() => {
    const newQuery = modifyQuery({ params: [{ name: "query", value: null, action: "delete" }] });
    let newUrl = pathname;
    if (newQuery) newUrl += `?${newQuery}`;
    originalRouter.replace(newUrl);
  }, []);

  const showRightSide = !hideTypeDropdown || onSearchClick || onFilterClick;

  useEffect(() => {
    if (hidePartDropdown) return;
    const relParts = partData.filter((p) => p.type === type);
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
          {!hideTypeDropdown && (
            <FilterDropdown
              data={typeData}
              filterType="type"
              defaultSelected={typeData.find((item) => item.value === type)}
              onSelect={onSelect}
              isDisabled={isDisabled}
              addToQuery
            />
          )}
          {!hidePartDropdown && (
            <FilterDropdown
              data={relevantParts}
              filterType="part"
              defaultSelected={relevantParts.find((item) => item.value === part)}
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
