import React, { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IconSearch } from "@tabler/icons-react";
import { Group, Title } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { createSpotlight, Spotlight, SpotlightActionData } from "@mantine/spotlight";
import FilterButton from "@/components/FilterButton";
import FilterDropdown from "@/components/FilterDropdown";
import { FilterItemType } from "@/components/FilterDropdown/types";
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
  "/": "BeforeAfter",
  "/style": "StyleAnalysis",
  "/proof": "Proof",
};

const titles = [
  { label: "Progress", value: "/" },
  { label: "Style", value: "/style" },
  { label: "Proof", value: "/proof" },
];

type Props = {
  showFilter?: boolean;
  showSearch?: boolean;
  onSelect?: (item?: FilterItemType) => void;
};

const [spotlightStore, spotlight] = createSpotlight();

export default function GeneralResultsHeader({ showFilter, showSearch }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { width, ref } = useElementSize();
  const [typeFilterItems, setTypeFilterItems] = useState<FilterItemType[]>();
  const [partFilterItems, setPartFilterItems] = useState<FilterItemType[]>();
  const [spotlightActions, setSpotlightActions] = useState<SpotlightActionData[]>([]);
  const [filters, setFilters] = useState<ExistingFiltersType | null>(null);

  const type = searchParams.get("type") || "head";
  const part = searchParams.get("part");

  const paramsCount = useMemo(() => {
    const allParams = Array.from(searchParams.values());
    const requiredParams = allParams.filter((param) => !["type", "part"].includes(param));
    return requiredParams.length;
  }, [searchParams.toString()]);

  const handleActionClick = useCallback(
    (value: string) => {
      const newQuery = modifyQuery({ params: [{ name: "query", value, action: "replace" }] });
      router.replace(`${pathname}?${newQuery}`);
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
        actions = keys.map((filter) => ({
          id: filter as string,
          label: normalizeString(filter as string).toLowerCase(),
          leftSection: <IconSearch className={"icon"} stroke={1.5} />,
          onClick: () => handleActionClick(filter as string),
        }));
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
        setTypeFilterItems(relevantTypeItems);

        const relevantParts = partItems.filter((part) => response.message.type.includes(part.type));
        setPartFilterItems(relevantParts.filter((item) => item.type === type));
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
      innerProps: <FilterCardContent filters={filters} />,
    });
  }, [typeof filters]);

  useEffect(() => {
    getExistingFilters(pathname, type);
  }, [pathname, type]);

  const showRightPart = useMemo(() => {
    const anyTypeFilter = typeFilterItems && typeFilterItems.length > 1;
    const anyPartFilter = partFilterItems && partFilterItems.length > 1;
    return (showFilter && (anyTypeFilter || anyPartFilter)) || showSearch;
  }, [typeFilterItems, partFilterItems, showFilter, showSearch]);

  return (
    <Group className={classes.container}>
      <Group className={classes.wrapper}>
        <TitleDropdown titles={titles} />
        {showRightPart && (
          <Group className={classes.right} ref={ref}>
            {typeFilterItems && typeFilterItems.length > 1 && (
              <FilterDropdown
                data={typeFilterItems || []}
                icons={typeIcons}
                placeholder="Select type"
                defaultSelected={type}
                filterType="type"
                addToQuery
              />
            )}
            {partFilterItems && partFilterItems.length > 1 && (
              <FilterDropdown
                data={partFilterItems || []}
                icons={partIcons}
                placeholder="Select part"
                defaultSelected={part}
                filterType="type"
                addToQuery
              />
            )}
            {showSearch && (
              <SearchButton maxPillWidth={width / 2} onSearchClick={() => spotlight.open()} />
            )}
            {showFilter && (
              <FilterButton activeFiltersCount={paramsCount} onFilterClick={openFiltersCard} />
            )}
          </Group>
        )}
      </Group>
      {showSearch && (
        <Spotlight
          store={spotlightStore}
          actions={spotlightActions}
          nothingFound="Nothing found"
          searchProps={{
            leftSection: <IconSearch className="icon" stroke={1.5} />,
            placeholder: "Search...",
          }}
          overlayProps={{ blur: 0 }}
          highlightQuery
          centered
          limit={10}
        />
      )}
    </Group>
  );
}
