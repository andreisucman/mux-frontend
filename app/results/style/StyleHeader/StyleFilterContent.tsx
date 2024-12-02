import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { upperFirst } from "@mantine/hooks";
import { outlookStyles } from "@/app/analysis/style/SelectStyleGoalModalContent/outlookStyles";
import FilterDropdown from "@/components/FilterDropdown";
import { FilterItemType } from "@/components/FilterDropdown/types";
import callTheServer from "@/functions/callTheServer";

export default function StyleFilterContent() {
  const searchParams = useSearchParams();
  const [styleItems, setStyleItems] = useState<FilterItemType[]>();
  const [icons, setIcons] = useState<{ [key: string]: any }>();

  const styleName = searchParams.get("styleName");

  const handleGetUsersStyleNames = useCallback(async () => {
    try {
      const response = await callTheServer({ endpoint: "getUsersStyleNames", method: "GET" });

      if (response.status === 200) {
        const iconsAndFilterItems = response.message.reduce(
          (
            a: { icons: { [key: string]: any }; items: { label: string; value: string }[] },
            c: string
          ) => {
            if (!a.icons[c]) {
              const relevantStyle = outlookStyles.find((obj) => obj.name === c);
              a.icons[c] = relevantStyle?.icon;
              a.items.push({ label: upperFirst(c), value: c });
            }
          },
          {
            icons: {},
            items: [],
          }
        );

        setStyleItems(iconsAndFilterItems.items);
        setIcons(iconsAndFilterItems.icons);
      }
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
      icons={icons}
      defaultSelected={styleItems && styleItems.find((obj) => obj.value === styleName)?.value}
      filterType="styleName"
      placeholder="Select style name"
      addToQuery
    />
  );
}
