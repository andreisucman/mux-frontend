import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Stack } from "@mantine/core";
import { outlookStyles } from "@/app/analysis/style/SelectStyleGoalModalContent/outlookStyles";
import FilterDropdown from "@/components/FilterDropdown";
import { FilterItemType } from "@/components/FilterDropdown/types";
import callTheServer from "@/functions/callTheServer";

interface AllFiltersIitemType extends FilterItemType {
  field: string;
}

export default function ProofFilterContent() {
  const searchParams = useSearchParams();
  const [typeFilters, setTypeFilters] = useState<AllFiltersIitemType[]>();
  const [partFilters, setPartFilters] = useState<AllFiltersIitemType[]>();

  const type = searchParams.get("type");
  const part = searchParams.get("part");

  return (
    <Stack>
      {typeFilters && typeFilters.length > 0 && (
        <FilterDropdown
          data={typeFilters || []}
          defaultSelected={typeFilters && typeFilters.find((obj) => obj.value === type)}
          filterType="type"
          addToQuery
        />
      )}
      {partFilters && partFilters.length > 0 && (
        <FilterDropdown
          data={partFilters || []}
          defaultSelected={partFilters && partFilters.find((obj) => obj.value === part)}
          filterType="part"
          addToQuery
        />
      )}
    </Stack>
  );
}
