import React, { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { outlookStyles } from "@/app/analysis/style/SelectStyleGoalModalContent/outlookStyles";
import FilterDropdown from "@/components/FilterDropdown";

type Props = {
  allExistingStyleNames: string[];
};

export default function StyleFilterContent({ allExistingStyleNames }: Props) {
  const searchParams = useSearchParams();
  const styleName = searchParams.get("styleName");

  const styleDropdownData = useMemo(
    () =>
      allExistingStyleNames.map((styleName: string) => {
        const relevantStyle = outlookStyles.find((obj) => obj.name === styleName);
        return {
          label: styleName,
          value: styleName,
          icon: (relevantStyle && relevantStyle.icon) || "",
        };
      }),
    [allExistingStyleNames.length]
  );

  return (
    <FilterDropdown
      data={styleDropdownData}
      filterType="styleName"
      defaultSelected={styleDropdownData.find((rec) => rec.value === styleName)}
      addToQuery
    />
  );
}
