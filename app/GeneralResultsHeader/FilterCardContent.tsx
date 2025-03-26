import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Skeleton, Stack } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import FilterDropdown from "@/components/FilterDropdown";
import { FilterItemType } from "@/components/FilterDropdown/types";
import { ExistingFiltersType } from "./types";
import classes from "./FilterCardContent.module.css";

type Props = {
  filters?: ExistingFiltersType | null;
};

export default function FilterCardContent({ filters }: Props) {
  const searchParams = useSearchParams();
  const [ageIntervalFilters, setAgeIntervalFilters] = useState<FilterItemType[]>([]);
  const [concernFilters, setConcernFilters] = useState<FilterItemType[]>([]);
  const [ethnicityFilters, setEthnicityFilters] = useState<FilterItemType[]>([]);
  const [bodyTypeFilters, setBodyTypeFilters] = useState<FilterItemType[]>([]);
  const [sexFilters, setSexFilters] = useState<FilterItemType[]>([]);

  const ageInterval = searchParams.get("ageInterval");
  const concern = searchParams.get("concern");
  const ethnicity = searchParams.get("ethnicity");
  const bodyType = searchParams.get("bodyType");
  const sex = searchParams.get("sex");

  useEffect(() => {
    if (!filters) return;
    setAgeIntervalFilters(
      filters.ageInterval.map((key) => ({ label: upperFirst(key), value: key }))
    );
    setConcernFilters(
      filters.concern.map((key) => {
        const label = key.split("_").join(" ");
        return { label: upperFirst(label), value: key };
      })
    );
    setEthnicityFilters(filters.ethnicity.map((key) => ({ label: upperFirst(key), value: key })));
    setBodyTypeFilters(filters.bodyType.map((key) => ({ label: upperFirst(key), value: key })));
    setSexFilters(filters.sex.map((key) => ({ label: upperFirst(key), value: key })));
  }, [typeof filters]);

  const styles = useMemo(() => ({ flex: "unset", width: "100%", maxWidth: "unset" }), []);

  return (
    <Stack className={classes.container}>
      {filters ? (
        <>
          {sexFilters.length > 0 && (
            <FilterDropdown
              data={sexFilters}
              selectedValue={sex}
              filterType="sex"
              placeholder="Select sex"
              customStyles={styles}
              addToQuery
            />
          )}
          {ethnicityFilters.length > 0 && (
            <FilterDropdown
              data={ethnicityFilters}
              selectedValue={ethnicity}
              filterType="ethnicity"
              placeholder="Select ethnicity"
              customStyles={styles}
              addToQuery
            />
          )}
          {ageIntervalFilters.length > 0 && (
            <FilterDropdown
              data={ageIntervalFilters}
              selectedValue={ageInterval}
              filterType="ageInterval"
              placeholder="Select age interval"
              customStyles={styles}
              addToQuery
            />
          )}
          {concernFilters.length > 0 && (
            <FilterDropdown
              data={concernFilters}
              selectedValue={concern}
              filterType="concern"
              placeholder="Select concern"
              customStyles={styles}
              addToQuery
            />
          )}
          {bodyTypeFilters.length > 0 && (
            <FilterDropdown
              data={bodyTypeFilters}
              selectedValue={bodyType}
              filterType="bodyType"
              placeholder="Select body type"
              customStyles={styles}
              addToQuery
            />
          )}
        </>
      ) : (
        <Skeleton className="skeleton" flex={1}></Skeleton>
      )}
    </Stack>
  );
}
