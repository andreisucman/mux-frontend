import React, { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IconFilterOff } from "@tabler/icons-react";
import { Button, rem, Skeleton, Stack } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import FilterDropdown from "@/components/FilterDropdown";
import { FilterItemType } from "@/components/FilterDropdown/types";
import modifyQuery from "@/helpers/modifyQuery";
import { modals } from "@mantine/modals";
import { ExistingFiltersType } from "./types";
import classes from "./FilterCardContent.module.css";

type Props = {
  filters: ExistingFiltersType | null;
};

export default function FilterCardContent({ filters }: Props) {
  const router = useRouter();
  const pathname = usePathname();
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

  const handleResetFilters = useCallback(() => {
    const params = [
      { name: "ageInterval", value: null, action: "delete" },
      { name: "concern", value: null, action: "delete" },
      { name: "ethnicity", value: null, action: "delete" },
      { name: "bodyType", value: null, action: "delete" },
      { name: "sex", value: null, action: "delete" },
      { name: "styleName", value: null, action: "delete" },
    ];
    const newQuery = modifyQuery({ params });
    router.replace(`${pathname}?${newQuery}`);
    modals.closeAll();
  }, [pathname]);

  useEffect(() => {
    if (!filters) return;
    setAgeIntervalFilters(
      filters.ageInterval.map((key) => ({ label: upperFirst(key), value: key }))
    );
    setConcernFilters(filters.concern.map((key) => ({ label: upperFirst(key), value: key })));
    setEthnicityFilters(filters.ethnicity.map((key) => ({ label: upperFirst(key), value: key })));
    setBodyTypeFilters(filters.bodyType.map((key) => ({ label: upperFirst(key), value: key })));
    setSexFilters(filters.bodyType.map((key) => ({ label: upperFirst(key), value: key })));
    setStyleNameFilters(filters.styleName.map((key) => ({ label: upperFirst(key), value: key })));
  }, [typeof filters]);

  const styles = useMemo(() => ({ flex: "unset", width: "100%", maxWidth: "unset" }), []);

  return (
    <Stack className={classes.container}>
      {filters ? (
        <>
          {sexFilters.length > 0 && (
            <FilterDropdown
              data={sexFilters}
              defaultSelected={ageInterval}
              filterType="sex"
              placeholder="Select sex"
              customStyles={styles}
              addToQuery
            />
          )}
          {ethnicityFilters.length > 0 && (
            <FilterDropdown
              data={ethnicityFilters}
              defaultSelected={ethnicity}
              filterType="ethnicity"
              placeholder="Select ethnicity"
              customStyles={styles}
              addToQuery
            />
          )}
          {ageIntervalFilters.length > 0 && (
            <FilterDropdown
              data={ageIntervalFilters}
              defaultSelected={ageInterval}
              filterType="ageInterval"
              placeholder="Select age interval"
              customStyles={styles}
              addToQuery
            />
          )}
          {concernFilters.length > 0 && (
            <FilterDropdown
              data={concernFilters}
              defaultSelected={concern}
              filterType="concern"
              placeholder="Select concern"
              customStyles={styles}
              addToQuery
            />
          )}
          {bodyTypeFilters.length > 0 && (
            <FilterDropdown
              data={bodyTypeFilters}
              defaultSelected={bodyType}
              filterType="bodyType"
              placeholder="Select body type"
              customStyles={styles}
              addToQuery
            />
          )}
          {styleNameFilters.length > 0 && (
            <FilterDropdown
              data={styleNameFilters}
              defaultSelected={styleName}
              filterType="styleName"
              placeholder="Select style name"
              customStyles={styles}
              addToQuery
            />
          )}
          <Button onClick={handleResetFilters} variant="default">
            <IconFilterOff className="icon icon__small" style={{ marginRight: rem(8) }} /> Reset
          </Button>
        </>
      ) : (
        <Skeleton className="skeleton" flex={1}></Skeleton>
      )}
    </Stack>
  );
}
