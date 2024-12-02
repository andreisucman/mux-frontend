import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Stack } from "@mantine/core";
import FilterDropdown from "@/components/FilterDropdown";
import { FilterItemType } from "@/components/FilterDropdown/types";
import { ExistingFiltersType } from "./types";

type Props = {
  filters?: ExistingFiltersType;
};

export default function FilterCardContent({ filters }: Props) {
  const searchParams = useSearchParams();
  const [ageIntervalFilters, setAgeIntervalFilters] = useState<FilterItemType[]>([]);
  const [concernFilters, setConcernFilters] = useState<FilterItemType[]>([]);
  const [ethnicityFilters, setEthnicityFilters] = useState<FilterItemType[]>([]);
  const [bodyTypeFilters, setBodyTypeFilters] = useState<FilterItemType[]>([]);
  const [sexFilters, setSexFilters] = useState<FilterItemType[]>([]);
  const [styleNameFilters, setStyleNameFilters] = useState<FilterItemType[]>([]);

  const ageInterval = searchParams.get("ageInterval");
  const concern = searchParams.get("concern");
  const ethnicity = searchParams.get("ethnicity");
  const bodyType = searchParams.get("bodyType");
  const sex = searchParams.get("sex");
  const styleName = searchParams.get("styleName");

  useEffect(() => {
    if (!filters) return;
    setAgeIntervalFilters(filters.ageInterval.map((key) => ({ label: key, value: key })));
    setConcernFilters(filters.concern.map((key) => ({ label: key, value: key })));
    setEthnicityFilters(filters.ethnicity.map((key) => ({ label: key, value: key })));
    setBodyTypeFilters(filters.bodyType.map((key) => ({ label: key, value: key })));
    setSexFilters(filters.sex.map((key) => ({ label: key, value: key })));
    setStyleNameFilters(filters.styleName.map((key) => ({ label: key, value: key })));
  }, [typeof filters]);

  return (
    <Stack>
      {sexFilters.length > 0 && (
        <FilterDropdown
          data={sexFilters}
          defaultSelected={sexFilters.find((obj) => obj.value === sex)?.value}
          filterType="sex"
          placeholder="Select sex"
          addToQuery
        />
      )}
      {ethnicityFilters.length > 0 && (
        <FilterDropdown
          data={ethnicityFilters}
          defaultSelected={ethnicityFilters.find((obj) => obj.value === ethnicity)?.value}
          filterType="ethnicity"
          placeholder="Select ethnicity"
          addToQuery
        />
      )}
      {ageIntervalFilters.length > 0 && (
        <FilterDropdown
          data={ageIntervalFilters}
          defaultSelected={ageIntervalFilters.find((obj) => obj.value === ageInterval)?.value}
          filterType="ageInterval"
          placeholder="Select age interval"
          addToQuery
        />
      )}
      {concernFilters.length > 0 && (
        <FilterDropdown
          data={concernFilters}
          defaultSelected={concernFilters.find((obj) => obj.value === concern)?.value}
          filterType="concern"
          placeholder="Select concern"
          addToQuery
        />
      )}
      {bodyTypeFilters.length > 0 && (
        <FilterDropdown
          data={bodyTypeFilters}
          defaultSelected={bodyTypeFilters.find((obj) => obj.value === bodyType)?.value}
          filterType="bodyType"
          placeholder="Select body type"
          addToQuery
        />
      )}
      {styleNameFilters.length > 0 && (
        <FilterDropdown
          data={styleNameFilters}
          defaultSelected={styleNameFilters.find((obj) => obj.value === styleName)?.value}
          filterType="styleName"
          placeholder="Select style name"
          addToQuery
        />
      )}
    </Stack>
  );
}
