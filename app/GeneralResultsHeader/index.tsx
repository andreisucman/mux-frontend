import React, { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Group, Title } from "@mantine/core";
import { createSpotlight } from "@mantine/spotlight";
import FilterButton from "@/components/FilterButton";
import { FilterItemType } from "@/components/FilterDropdown/types";
import SearchButton from "@/components/SearchButton";
import callTheServer from "@/functions/callTheServer";
import openFiltersCard, { FilterCardNamesEnum } from "@/functions/openFilterCard";
import TitleDropdown from "../results/TitleDropdown";
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
  children?: React.ReactNode;
  filterNames?: string[];
};

export default function GeneralResultsHeader({ children, filterNames = [] }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<ExistingFiltersType | null>(null);

  const paramsCount = useMemo(() => {
    const allParams = Array.from(searchParams.keys());
    const requiredParams = allParams.filter((param) => filterNames.includes(param));
    return requiredParams.length;
  }, [searchParams.toString()]);

  const filtersActive = useMemo(() => {
    return Object.values(filters || {}).some((value: any) => value && value.length > 0);
  }, [filters]);

  const getExistingFilters = useCallback(async (pathname: string) => {
    try {
      const response = await callTheServer({
        endpoint: `getExistingFilters/${collectionMap[pathname]}`,
        method: "GET",
      });

      if (response.status === 200) {
        setFilters(response.message);
      }
    } catch (err) {}
  }, []);

  useEffect(() => {
    getExistingFilters(pathname);
  }, []);

  return (
    <Group className={classes.container}>
      <Group className={classes.wrapper}>
        <Title order={1}>Results</Title>
        {children}
        <FilterButton
          activeFiltersCount={paramsCount}
          onFilterClick={() =>
            openFiltersCard({
              cardName: FilterCardNamesEnum.FilterCardContent,
              childrenProps: { filters },
            })
          }
          isDisabled={!filtersActive}
        />
      </Group>
    </Group>
  );
}
