import React, { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Group, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { createSpotlight } from "@mantine/spotlight";
import FilterButton from "@/components/FilterButton";
import FilterDropdown from "@/components/FilterDropdown";
import { FilterItemType } from "@/components/FilterDropdown/types";
import SearchButton from "@/components/SearchButton";
import callTheServer from "@/functions/callTheServer";
import { partIcons } from "@/helpers/icons";
import TitleDropdown from "../results/TitleDropdown";
import FilterCardContent from "./FilterCardContent";
import { ExistingFiltersType } from "./types";
import classes from "./GeneralResultsHeader.module.css";

const collectionMap: { [key: string]: string } = {
  "/": "progress",
  "/proof": "proof",
};

const titles = [
  { label: "Progress", value: "/" },
  { label: "Proof", value: "/proof" },
];

type Props = {
  showFilter?: boolean;
  showSearch?: boolean;
  hidePartDropdown?: boolean;
  onSelect?: (item?: FilterItemType) => void;
};

const [spotlightStore, proofSpotlight] = createSpotlight();

export default function GeneralResultsHeader({ showFilter, showSearch, hidePartDropdown }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const part = searchParams.get("part");

  const [relevantParts, setRelevantParts] = useState<FilterItemType[]>([]);
  const [filters, setFilters] = useState<ExistingFiltersType | null>(null);

  const paramsCount = useMemo(() => {
    const allParams = Array.from(searchParams.keys());
    const requiredParams = allParams.filter((param) => !["part", "query"].includes(param));
    return requiredParams.length;
  }, [searchParams.toString()]);

  const additionalFiltersActive = useMemo(() => {
    const { type, part, ...otherFilters } = filters || {};
    return Object.values(otherFilters || {}).some((value: any) => value.length > 0);
  }, [filters]);

  const getExistingFilters = useCallback(async (pathname: string) => {
    try {
      const response = await callTheServer({
        endpoint: `getExistingFilters/${collectionMap[pathname]}`,
        method: "GET",
      });

      if (response.status === 200) {
        setFilters(response.message);
        setRelevantParts(response.message.part);
      }
    } catch (err) {}
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
    getExistingFilters(pathname);
  }, []);

  const partsDisabled = relevantParts.length === 0;

  return (
    <Group className={classes.container}>
      <Group className={classes.wrapper}>
        <TitleDropdown titles={titles} />
        {showSearch && (
          <SearchButton
            collection="proof"
            searchPlaceholder="Search proof"
            spotlight={proofSpotlight}
            spotlightStore={spotlightStore}
            showActivityIndicator
          />
        )}
        {showFilter && (
          <FilterButton
            activeFiltersCount={paramsCount}
            onFilterClick={openFiltersCard}
            isDisabled={!additionalFiltersActive}
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
      </Group>
    </Group>
  );
}
