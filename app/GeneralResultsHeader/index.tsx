import React, { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IconSearch } from "@tabler/icons-react";
import { Group, Stack, Title } from "@mantine/core";
import { useElementSize, useMediaQuery } from "@mantine/hooks";
import { createSpotlight, Spotlight, SpotlightActionData } from "@mantine/spotlight";
import FilterButton from "@/components/FilterButton";
import FilterDropdown from "@/components/FilterDropdown";
import { FilterItemType } from "@/components/FilterDropdown/types";
import { partIcons, partItems, typeIcons, typeItems } from "@/components/PageHeader/data";
import SearchButton from "@/components/SearchButton";
import callTheServer from "@/functions/callTheServer";
import modifyQuery from "@/helpers/modifyQuery";
import openErrorModal from "@/helpers/openErrorModal";
import { normalizeString } from "@/helpers/utils";
import TitleDropdown from "../results/TitleDropdown";
import FilterCardContent from "./FilterCardContent";
import { ExistingFiltersType } from "./types";
import classes from "./GeneralResultsHeader.module.css";

const titles = [
  { label: "Progress", value: "/" },
  { label: "Style", value: "/style" },
  { label: "Proof", value: "/proof" },
];

const collectionMap: { [key: string]: string } = {
  "/": "BeforeAfter",
  "/style": "StyleAnalysis",
  "/proof": "Proof",
};

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
  const isMobile = useMediaQuery("(max-width: 36em)");
  const [filters, setFilters] = useState<ExistingFiltersType>();
  const [spotlightActions, setSpotlightActions] = useState<SpotlightActionData[]>([]);
  const [partFilterItems, setPartFilterItems] = useState<FilterItemType[]>();

  const type = searchParams.get("type") || "head";
  const part = searchParams.get("part");

  const typeFilterItems = useMemo(
    () => filters && typeItems.filter((item) => filters.type.includes(item.value)),
    [typeof filters]
  );

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

  const getExistingFilters = useCallback(async () => {
    try {
      const response = await callTheServer({
        endpoint: `getExistingFilters/${collectionMap[pathname]}`,
        method: "GET",
      });

      if (response.status === 200) {
        setFilters(response.message);

        if (showSearch) {
          const { concern, taskName } = response.message;

          const keys = [];

          if (pathname === "/proof") {
            keys.push(...concern, taskName);
          }

          const spotlightActions = keys.map((filter) => ({
            id: filter as string,
            label: normalizeString(filter as string).toLowerCase(),
            leftSection: <IconSearch className={"icon"} stroke={1.5} />,
            onClick: () => handleActionClick(filter as string),
          }));

          setSpotlightActions(spotlightActions);
        }
      }
    } catch (err) {
      console.log("Error in getExistingFilters: ", err);
      openErrorModal({
        description: "Please try refreshing the page and inform us if the error persists.",
      });
    }
  }, [pathname]);

  useEffect(() => {
    if (!showSearch) return;
    getExistingFilters();
  }, []);

  useEffect(() => {
    setPartFilterItems(partItems.filter((item) => item.type === type));
  }, [type]);

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
            {showFilter && isMobile && <FilterButton activeFiltersCount={paramsCount} />}
          </Group>
        )}
      </Group>
      {showFilter && (
        <>
          {!isMobile && (
            <Stack className={classes.filterCard}>
              <Title order={3}>Filters</Title>
              <FilterCardContent filters={filters} />
            </Stack>
          )}
        </>
      )}
      {showSearch && (
        <Spotlight
          store={spotlightStore}
          actions={spotlightActions}
          nothingFound="Nothing found..."
          searchProps={{
            leftSection: <IconSearch className="icon" stroke={1.5} />,
            placeholder: "Search...",
          }}
          overlayProps={{ blur: 0 }}
          highlightQuery
          limit={10}
        />
      )}
    </Group>
  );
}
