import React, { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  IconChevronLeft,
  IconHeart,
  IconMan,
  IconMoodSmile,
  IconSearch,
} from "@tabler/icons-react";
import { ActionIcon, Group, Title } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import { createSpotlight, Spotlight, SpotlightActionData } from "@mantine/spotlight";
import FilterButton from "@/components/FilterButton";
import { FilterItemType } from "@/components/FilterDropdown/types";
import SearchButton from "@/components/SearchButton";
import fetchAutocompleteData from "@/functions/fetchAutocompleteData";
import modifyQuery from "@/helpers/modifyQuery";
import classes from "./ProofHeader.module.css";

const typeData = [
  { label: "Head", icon: <IconMoodSmile className="icon" />, value: "head" },
  { label: "Body", icon: <IconMan className="icon" />, value: "body" },
  { label: "Health", icon: <IconHeart className="icon" />, value: "health" },
];

type Props = {
  title: string;
  isDisabled?: boolean;
  showReturn?: boolean;
  showFilter?: boolean;
  onSelect?: (item?: FilterItemType) => void;
};

const [spotlightStore, solutionsSpotlight] = createSpotlight();

export default function ProofHeader({ title, showReturn, showFilter, onSelect }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { width, ref } = useElementSize();
  const [spotlightActions, setSpotlightActions] = useState<SpotlightActionData[]>([]);
  const numParams = searchParams ? Array.from(searchParams.values()).length : 0;

  const handleActionClick = useCallback(
    (value: string) => {
      const newQuery = modifyQuery({ params: [{ name: "query", value, action: "replace" }] });
      router.replace(`${pathname}?${newQuery}`);
    },
    [pathname]
  );

  const getAutocompleteData = useCallback(async () => {
    const autocompleteData = await fetchAutocompleteData({
      endpoint: "getProofAutocomplete",
      fields: ["taskName", "concern", "part", "type"],
      handleActionClick,
    });

    setSpotlightActions(autocompleteData);
  }, [pathname]);

  useEffect(() => {
    getAutocompleteData();
  }, []);

  return (
    <>
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
        <Group className={classes.right} ref={ref}>
          <SearchButton maxPillWidth={width / 2} onSearchClick={() => solutionsSpotlight.open()} />
          {showFilter && <FilterButton activeFiltersCount={numParams} />}
        </Group>
      </Group>
      <Spotlight
        store={spotlightStore}
        actions={spotlightActions}
        nothingFound="Nothing found..."
        searchProps={{
          leftSection: <IconSearch className="icon" stroke={1.5} />,
          placeholder: "Search...",
        }}
        highlightQuery
        overlayProps={{ blur: 0 }}
        limit={10}
      />
    </>
  );
}
