import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconChevronLeft } from "@tabler/icons-react";
import { ActionIcon, Group } from "@mantine/core";
import FilterDropdown from "@/components/FilterDropdown";
import { FilterItemType } from "@/components/FilterDropdown/types";
import getUsersFilters from "@/functions/getUsersFilters";
import { useRouter } from "@/helpers/custom-router";
import { styleIcons, typeIcons } from "@/helpers/icons";
import TitleDropdown from "../../TitleDropdown";
import classes from "./StyleHeader.module.css";

type Props = {
  titles: { label: string; value: string }[];
  isDisabled?: boolean;
  showReturn?: boolean;
  onSelect?: (item?: string | null) => void;
};

export default function StyleHeader({ showReturn, isDisabled, titles, onSelect }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [availableTypes, setAvailableTypes] = useState<FilterItemType[]>([]);
  const [availableStyles, setAvailableStyles] = useState<FilterItemType[]>([]);

  const followingUserId = searchParams.get("id");
  const styleName = searchParams.get("styleName");
  const type = searchParams.get("type");

  const typesDisabled = isDisabled || availableTypes.length === 0;
  const stylesDisabled = isDisabled || availableStyles.length === 0;

  useEffect(() => {
    getUsersFilters({
      followingUserId,
      collection: "style",
      fields: ["type"],
    }).then((result) => {
      const { availableTypes } = result;
      setAvailableTypes(availableTypes);
    });
  }, [followingUserId]);

  useEffect(() => {
    getUsersFilters({
      followingUserId,
      collection: "style",
      fields: ["styleName"],
      type,
    }).then((result) => {
      const { availableStyleNames } = result;
      setAvailableStyles(availableStyleNames);
    });
  }, [type, followingUserId]);

  return (
    <Group className={classes.container}>
      {showReturn && (
        <ActionIcon variant="default" onClick={() => router.back()}>
          <IconChevronLeft className="icon" />
        </ActionIcon>
      )}
      <TitleDropdown titles={titles} />

      <FilterDropdown
        filterType="type"
        data={availableTypes}
        icons={typesDisabled ? undefined : typeIcons}
        selectedValue={type}
        onSelect={onSelect}
        placeholder="Filter by type"
        isDisabled={typesDisabled}
        allowDeselect
        addToQuery
      />
      <FilterDropdown
        data={availableStyles}
        filterType="styleName"
        icons={stylesDisabled ? undefined : styleIcons}
        selectedValue={styleName}
        onSelect={onSelect}
        placeholder="Filter by style"
        isDisabled={stylesDisabled}
        allowDeselect
        addToQuery
      />
    </Group>
  );
}
