import React, { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { outlookStyles } from "@/app/analysis/style/SelectStyleGoalModalContent/outlookStyles";
import { FilterItemType } from "@/components/FilterDropdown/types";
import SelectAsync from "@/components/SelectAsync";
import callTheServer from "@/functions/callTheServer";
import modifyQuery from "@/helpers/modifyQuery";

export default function StyleFilterContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const styleName = searchParams.get("styleName");

  const handleGetUsersStyleNames = useCallback(async () => {
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

    return result;
  }, []);

  const handleSelectStyle = useCallback(
    (item: FilterItemType) => {
      const newQuery = modifyQuery({
        params: [{ name: "styleName", value: item.value, action: "replace" }],
      });

      router.replace(`/${pathname}?${newQuery}`);
    },
    [pathname]
  );

  return <SelectAsync fetchData={handleGetUsersStyleNames} handleSelectItem={handleSelectStyle} />;
}
