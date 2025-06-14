import React, { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button, Skeleton, Stack } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import FilterDropdown from "@/components/FilterDropdown";
import { FilterItemType } from "@/components/FilterDropdown/types";
import { normalizeString } from "@/helpers/utils";
import classes from "./FilterCardContent.module.css";

export type ExistingFiltersType = {
  ethnicity: string[];
  skinColor: string[];
  concerns: string[];
  ageInterval: string[];
  sex: string[];
  type: string[];
  part: string[];
  styleName: string[];
  taskName: string[];
};

type Props = {
  filters?: ExistingFiltersType | null;
};

export default function FilterCardContent({ filters }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [ageIntervalFilters, setAgeIntervalFilters] = useState<FilterItemType[]>([]);
  const [ethnicityFilters, setEthnicityFilters] = useState<FilterItemType[]>([]);
  const [sexFilters, setSexFilters] = useState<FilterItemType[]>([]);
  const [partFilters, setPartFilters] = useState<FilterItemType[]>([]);
  const [concernFilters, setConcernFilters] = useState<FilterItemType[]>([]);

  const ageInterval = searchParams.get("ageInterval");
  const ethnicity = searchParams.get("ethnicity");
  const sex = searchParams.get("sex");
  const part = searchParams.get("part");
  const concern = searchParams.get("concern");

  const noFilters =
    [ageInterval, concern, ethnicity, sex, part, concern].filter(Boolean).length === 0;

  useEffect(() => {
    if (!filters) return;
    if (filters.part)
      setPartFilters(filters.part.map((key) => ({ label: upperFirst(key), value: key })));
    if (filters.ageInterval)
      setAgeIntervalFilters(
        filters.ageInterval.map((key) => ({ label: upperFirst(key), value: key }))
      );
    if (filters.ethnicity)
      setEthnicityFilters(filters.ethnicity.map((key) => ({ label: upperFirst(key), value: key })));
    if (filters.sex)
      setSexFilters(filters.sex.map((key) => ({ label: upperFirst(key), value: key })));
    if (filters.concerns)
      setConcernFilters(filters.concerns.map((key) => ({ label: upperFirst(key), value: key })));
  }, [typeof filters]);

  const styles = useMemo(() => ({ flex: "unset", width: "100%", maxWidth: "unset" }), []);

  return (
    <Stack className={classes.container}>
      {filters ? (
        <>
          {partFilters.length > 0 && (
            <FilterDropdown
              data={partFilters}
              selectedValue={part}
              filterType="part"
              placeholder="Select part"
              customStyles={styles}
              searchValue={normalizeString(part || "")}
              allowDeselect
              addToQuery
            />
          )}
          {concernFilters.length > 0 && (
            <FilterDropdown
              data={concernFilters}
              selectedValue={concern}
              isDisabled={concernFilters.length === 0}
              customStyles={styles}
              filterType="concern"
              placeholder="Select concern"
              searchValue={normalizeString(concern || "")}
              addToQuery
            />
          )}
          {sexFilters.length > 0 && (
            <FilterDropdown
              data={sexFilters}
              selectedValue={sex}
              filterType="sex"
              placeholder="Select sex"
              customStyles={styles}
              searchValue={normalizeString(sex || "")}
              allowDeselect
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
              searchValue={normalizeString(ethnicity || "")}
              allowDeselect
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
              searchValue={normalizeString(ageInterval || "")}
              allowDeselect
              addToQuery
            />
          )}

          <Button
            disabled={noFilters}
            variant="default"
            onClick={() => {
              modals.closeAll();
              router.replace(pathname);
            }}
          >
            Clear filters
          </Button>
        </>
      ) : (
        <Skeleton className="skeleton" flex={1}></Skeleton>
      )}
    </Stack>
  );
}
