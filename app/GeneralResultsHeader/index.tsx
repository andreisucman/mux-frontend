import React, { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IconSearch } from "@tabler/icons-react";
import { Group, Title } from "@mantine/core";
import { useShallowEffect } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { createSpotlight, Spotlight, SpotlightActionData } from "@mantine/spotlight";
import FilterButton from "@/components/FilterButton";
import FilterDropdown from "@/components/FilterDropdown";
import { FilterItemType, FilterPartItemType } from "@/components/FilterDropdown/types";
import { partItems, typeItems } from "@/components/PageHeader/data";
import SearchButton from "@/components/SearchButton";
import callTheServer from "@/functions/callTheServer";
import { partIcons, typeIcons } from "@/helpers/icons";
import modifyQuery from "@/helpers/modifyQuery";
import openErrorModal from "@/helpers/openErrorModal";
import { normalizeString } from "@/helpers/utils";
import TitleDropdown from "../results/TitleDropdown";
import FilterCardContent from "./FilterCardContent";
import { ExistingFiltersType } from "./types";
import classes from "./GeneralResultsHeader.module.css";

const collectionMap: { [key: string]: string } = {
  "/": "progress",
  "/style": "style",
  "/proof": "proof",
};

const titles = [
  { label: "Progress", value: "/" },
  { label: "Style", value: "/style" },
  { label: "Proof", value: "/proof" },
];

type Props = {
  showFilter?: boolean;
  showSearch?: boolean;
  hideTypeDropdown?: boolean;
  hidePartDropdown?: boolean;
  onSelect?: (item?: FilterItemType) => void;
};

const [spotlightStore, spotlight] = createSpotlight();

export default function GeneralResultsHeader({
  showFilter,
  showSearch,
  hideTypeDropdown,
  hidePartDropdown,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const type = searchParams.get("type");
  const part = searchParams.get("part");
  const query = searchParams.get("query");

  const [availableTypes, setAvailableTypes] = useState<FilterItemType[]>([]);
  const [relevantParts, setRelevantParts] = useState<FilterItemType[]>([]);
  const [spotlightActions, setSpotlightActions] = useState<SpotlightActionData[]>([]);
  const [filters, setFilters] = useState<ExistingFiltersType | null>(null);
  const [searchQuery, setSearchQuery] = useState(query || "");

  const paramsCount = useMemo(() => {
    const allParams = Array.from(searchParams.keys());
    const requiredParams = allParams.filter((param) => !["type", "part", "query"].includes(param));
    return requiredParams.length;
  }, [searchParams.toString()]);

  const additionalFiltersActive = useMemo(() => {
    const { type, part, ...otherFilters } = filters || {};
    return Object.values(otherFilters || {}).some((value: any) => value.length > 0);
  }, [filters]);

  const handleActionClick = useCallback(
    (value: string) => {
      const newQuery = modifyQuery({ params: [{ name: "query", value, action: "replace" }] });
      router.replace(`${pathname}?${newQuery}`);
      setSearchQuery(value);
    },
    [pathname]
  );

  const handleSearch = useCallback(
    (searchQuery: string) => {
      const newQuery = modifyQuery({
        params: [{ name: "query", value: searchQuery, action: searchQuery ? "replace" : "delete" }],
      });
      router.replace(`${pathname}?${newQuery}`);
      spotlight.close();
    },
    [pathname]
  );

  const createSpotlightActions = useCallback(
    (existingFilters: ExistingFiltersType) => {
      const { concern, taskName } = existingFilters;

      const keys = [];

      if (pathname === "/proof") {
        keys.push(...concern, ...taskName);
      }

      let actions: SpotlightActionData[] = [];

      if (keys.length > 0) {
        actions = keys.map((filter) => {
          const normalizedLabel = normalizeString(filter as string);

          return {
            id: filter as string,
            label: normalizedLabel.toLowerCase(),
            leftSection: <IconSearch className={"icon"} stroke={1.5} />,
            onClick: () => handleActionClick(normalizedLabel as string),
          };
        });
      }

      return actions;
    },
    [pathname]
  );

  const getExistingFilters = useCallback(async (pathname: string, type: string | null) => {
    try {
      const response = await callTheServer({
        endpoint: `getExistingFilters/${collectionMap[pathname]}`,
        method: "GET",
      });

      if (response.status === 200) {
        setFilters(response.message);

        const actions = createSpotlightActions(response.message);
        setSpotlightActions(actions);

        const relevantTypeItems = typeItems.filter((item) =>
          response.message.type.includes(item.value)
        );
        setAvailableTypes(relevantTypeItems);

        const relevantParts = partItems.filter((part) => response.message.type.includes(part.type));
        setRelevantParts(relevantParts.filter((item) => item.type === type));
      }
    } catch (err) {
      console.log("Error in getExistingFilters: ", err);
      openErrorModal({
        description: "Please try refreshing the page and inform us if the error persists.",
      });
    }
  }, []);

  const openFiltersCard = useCallback(() => {
    modals.openContextModal({
      modal: "general",
      title: (
        <Title order={5} component="p">
          Filters
        </Title>
      ),
      centered: true,
      innerProps: <FilterCardContent filters={filters} />,
    });
  }, [filters]);

  useEffect(() => {
    getExistingFilters(pathname, type);
  }, []);

  useShallowEffect(() => {
    if (!filters) return;

    let partFilterItems: FilterPartItemType[] = [];

    if (type) {
      partFilterItems = partItems.filter((part) => part.type === type);
    }

    setRelevantParts(partFilterItems);
  }, [type, filters]);

  const typesDisabled = availableTypes.length === 0;
  const partsDisabled = relevantParts.length === 0;

  return (
    <Group className={classes.container}>
      <Group className={classes.wrapper}>
        <TitleDropdown titles={titles} />
        {!hideTypeDropdown && (
          <FilterDropdown
            data={availableTypes}
            icons={typesDisabled ? undefined : typeIcons}
            placeholder="Filter by type"
            selectedValue={type}
            filterType="type"
            allowDeselect
            addToQuery
            isDisabled={typesDisabled}
          />
        )}
        {!hidePartDropdown && (
          <FilterDropdown
            data={relevantParts}
            icons={partsDisabled ? undefined : partIcons}
            placeholder="Filter by part"
            selectedValue={part}
            filterType="part"
            allowDeselect
            addToQuery
            isDisabled={partsDisabled}
          />
        )}
        {showSearch && (
          <SearchButton
            onSearchClick={() => spotlight.open()}
            isDisabled={spotlightActions.length === 0}
          />
        )}
        {showFilter && (
          <FilterButton
            activeFiltersCount={paramsCount}
            onFilterClick={openFiltersCard}
            isDisabled={!additionalFiltersActive}
          />
        )}
      </Group>

      {showSearch && (
        <Spotlight
          store={spotlightStore}
          actions={spotlightActions}
          nothingFound="Nothing found"
          onQueryChange={(query: string) => {
            if (query === "") {
              handleSearch(query);
            }
          }}
          searchProps={{
            leftSection: <IconSearch className="icon" stroke={1.5} />,
            placeholder: "Search...",
            value: searchQuery || "",
            onChange: (e: React.FormEvent<HTMLInputElement>) =>
              setSearchQuery(e.currentTarget.value),
            onKeyDown: (e: React.KeyboardEvent) => {
              if (e.key !== "Enter") return;
              handleSearch(searchQuery);
            },
          }}
          centered
          clearQueryOnClose={false}
          overlayProps={{ blur: 0 }}
          limit={10}
        />
      )}
    </Group>
  );
}
