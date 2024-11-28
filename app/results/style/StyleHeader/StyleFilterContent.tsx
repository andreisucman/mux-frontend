import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { outlookStyles } from "@/app/analysis/style/SelectStyleGoalModalContent/outlookStyles";
import FilterDropdown from "@/components/FilterDropdown";
import { FilterItemType } from "@/components/FilterDropdown/types";
import callTheServer from "@/functions/callTheServer";

export default function StyleFilterContent() {
  const searchParams = useSearchParams();
  const [styleItems, setStyleItems] = useState<FilterItemType[]>();
  const styleName = searchParams.get("styleName");

  const handleGetUsersStyleNames = useCallback(async () => {
    try {
      let result = [];

      const response = await callTheServer({ endpoint: "getUsersStyleNames", method: "GET" });

      if (response.status === 200) {
        const styleDropdownData = response.message.map((styleName: string) => {
          const relevantStyle = outlookStyles.find((obj) => obj.name === styleName);
          return {
            label: styleName,
            value: styleName,
            icon: (relevantStyle && relevantStyle.icon) || "",
          };
        });

        result = styleDropdownData;
      }

      setStyleItems(result);
    } catch (err) {
      console.log("Error in handleGetUsersStyleNames: ", err);
    }
  }, []);

  useEffect(() => {
    handleGetUsersStyleNames();
  }, []);

  return (
    <FilterDropdown
      data={styleItems || []}
      defaultSelected={styleItems && styleItems.find((obj) => obj.value === styleName)}
      filterType="styleName"
      addToQuery
    />
  );
}
