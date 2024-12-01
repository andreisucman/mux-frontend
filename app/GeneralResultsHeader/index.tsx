import React, { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IconSearch } from "@tabler/icons-react";
import { Group, Stack } from "@mantine/core";
import { useElementSize, useMediaQuery } from "@mantine/hooks";
import { createSpotlight, Spotlight, SpotlightActionData } from "@mantine/spotlight";
import FilterButton from "@/components/FilterButton";
import { FilterItemType } from "@/components/FilterDropdown/types";
import SearchButton from "@/components/SearchButton";
import callTheServer from "@/functions/callTheServer";
import fetchAutocompleteData from "@/functions/fetchAutocompleteData";
import modifyQuery from "@/helpers/modifyQuery";
import openErrorModal from "@/helpers/openErrorModal";
import { normalizeString } from "@/helpers/utils";
import TitleDropdown from "../results/TitleDropdown";
import ProofFilterContent from "./ProofFilterContent";
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
  const numParams = searchParams ? Array.from(searchParams.values()).length : 0;

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
          const { styleName, concern, taskName } = response.message;

          const spotlightActions = [...styleName, ...concern, ...taskName].map((filter) => ({
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

    const autocompleteData = await fetchAutocompleteData({
      endpoint: "getAllProofAutocomplete",
      fields: ["taskName", "concern", "part", "type"],
      handleActionClick,
    });

    setSpotlightActions(autocompleteData);
  }, [pathname]);

  useEffect(() => {
    if (!showSearch) return;
    getExistingFilters();
  }, []);

  return (
    <>
      <Group className={classes.container}>
        <TitleDropdown titles={titles} />
        <Group className={classes.right} ref={ref}>
          {showSearch && (
            <SearchButton maxPillWidth={width / 2} onSearchClick={() => spotlight.open()} />
          )}
          {showFilter && (
            <>
              {isMobile && <FilterButton activeFiltersCount={numParams} />}
              {!isMobile && (
                <Stack className={classes.filterCard}>
                  <ProofFilterContent />
                </Stack>
              )}
            </>
          )}
        </Group>
      </Group>
      {showSearch && (
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
      )}
    </>
  );
}
