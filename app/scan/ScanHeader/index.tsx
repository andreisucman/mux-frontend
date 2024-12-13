import React, { memo } from "react";
import { IconChevronLeft } from "@tabler/icons-react";
import { ActionIcon, Group, rem } from "@mantine/core";
import TitleDropdown from "@/app/results/TitleDropdown";
import FilterDropdown from "@/components/FilterDropdown";
import { useRouter } from "@/helpers/custom-router";
import { typeIcons } from "@/helpers/icons";
import { TypeEnum } from "@/types/global";
import classes from "./ScanHeader.module.css";

const typeFilters = [
  { label: "Head", value: "head" },
  { label: "Body", value: "body" },
];

const titles = [
  { label: "Scan progress", value: "/scan/progress" },
  { label: "Scan style", value: "/scan/style" },
  { label: "Scan food", value: "/scan/food" },
];

type Props = {
  type?: TypeEnum;
  onSelect?: () => void;
};

function ScanHeader({ type, onSelect }: Props) {
  const router = useRouter();

  return (
    <Group className={classes.container}>
      <Group className={classes.head}>
        <ActionIcon variant="default" onClick={() => router.back()}>
          <IconChevronLeft className="icon" />
        </ActionIcon>
        <TitleDropdown titles={titles} customDropdownStyles={{ minWidth: rem(210) }} />
      </Group>

      {type && (
        <FilterDropdown
          data={typeFilters}
          icons={typeIcons}
          onSelect={onSelect}
          selectedValue={type}
          filterType={"type"}
          placeholder="Select type"
          addToQuery
        />
      )}
    </Group>
  );
}

export default memo(ScanHeader);
