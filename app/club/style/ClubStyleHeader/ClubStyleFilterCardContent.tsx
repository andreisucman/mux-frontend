import React, { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IconFilterOff } from "@tabler/icons-react";
import { Button, rem, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import FilterDropdown from "@/components/FilterDropdown";
import { FilterItemType } from "@/components/FilterDropdown/types";
import getUsersFilters from "@/functions/getUsersFilters";
import { styleIcons, typeIcons } from "@/helpers/icons";
import modifyQuery from "@/helpers/modifyQuery";
import classes from "./ClubStyleFilterCardContent.module.css";

type Props = {
  userName?: string;
};

export default function ClubStyleFilterCardContent({ userName }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [availableTypes, setAvailableTypes] = useState<FilterItemType[]>([]);
  const [availableStyles, setAvailableStyles] = useState<FilterItemType[]>([]);

  const styleName = searchParams.get("styleName");
  const type = searchParams.get("type");

  const typesDisabled = availableTypes.length === 0;
  const stylesDisabled = availableStyles.length === 0;

  const handleResetFilters = () => {
    const query = modifyQuery({
      params: [
        { name: "type", value: null, action: "delete" },
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
      fields: ["type"],
    }).then((result) => {
      const { availableTypes } = result;
      setAvailableTypes(availableTypes);
    });
  }, [userName]);

  useEffect(() => {
    getUsersFilters({
      userName,
      collection: "style",
      fields: ["styleName"],
      type,
    }).then((result) => {
      const { availableStyleNames } = result;
      setAvailableStyles(availableStyleNames);
    });
  }, [type, userName]);

  return (
    <Stack className={classes.container}>
      <FilterDropdown
        filterType="type"
        data={availableTypes}
        icons={typesDisabled ? undefined : typeIcons}
        selectedValue={type}
        placeholder="Filter by type"
        isDisabled={typesDisabled}
        customStyles={{ maxWidth: "unset" }}
        allowDeselect
        addToQuery
      />
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
        <IconFilterOff className="icon icon__small" style={{ marginRight: rem(8) }} /> Reset
      </Button>
    </Stack>
  );
}
