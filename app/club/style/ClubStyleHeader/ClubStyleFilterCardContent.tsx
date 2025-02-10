import React, { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import FilterDropdown from "@/components/FilterDropdown";
import { FilterItemType } from "@/components/FilterDropdown/types";
import getUsersFilters from "@/functions/getUsersFilters";
import { styleIcons } from "@/helpers/icons";
import modifyQuery from "@/helpers/modifyQuery";
import classes from "./ClubStyleFilterCardContent.module.css";

type Props = {
  userName?: string;
};

export default function ClubStyleFilterCardContent({ userName }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [availableStyles, setAvailableStyles] = useState<FilterItemType[]>([]);

  const styleName = searchParams.get("styleName");

  const stylesDisabled = availableStyles.length === 0;

  const handleResetFilters = () => {
    const query = modifyQuery({
      params: [
        { name: "part", value: null, action: "delete" },
        { name: "position", value: null, action: "delete" },
      ],
    });

    router.replace(`${pathname}?${query}`);
    modals.closeAll();
  };

  useEffect(() => {
    getUsersFilters({
      userName,
      collection: "style",
      fields: ["styleName"],
    }).then((result) => {
      const { availableStyleNames } = result;
      setAvailableStyles(availableStyleNames);
    });
  }, [userName]);

  return (
    <Stack className={classes.container}>
      <FilterDropdown
        data={availableStyles}
        filterType="styleName"
        icons={stylesDisabled ? undefined : styleIcons}
        selectedValue={styleName}
        placeholder="Filter by style"
        isDisabled={stylesDisabled}
        customStyles={{ maxWidth: "unset" }}
        allowDeselect
        addToQuery
      />
      <Button onClick={handleResetFilters} variant="default">
        Reset
      </Button>
    </Stack>
  );
}
