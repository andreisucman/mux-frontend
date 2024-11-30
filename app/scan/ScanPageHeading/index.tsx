import React, { memo } from "react";
import { IconChevronLeft, IconMan, IconMoodSmile } from "@tabler/icons-react";
import { ActionIcon, Group, rem } from "@mantine/core";
import TitleDropdown from "@/app/results/TitleDropdown";
import FilterDropdown from "@/components/FilterDropdown";
import { useRouter } from "@/helpers/custom-router";
import { TypeEnum } from "@/types/global";
import classes from "./ScanPageHeading.module.css";

const typeFilters = [
  { label: "Head", icon: <IconMoodSmile className="icon" />, value: "head" },
  { label: "Body", icon: <IconMan className="icon" />, value: "body" },
];

const titles = [
  { label: "Scan progress", value: "/scan/progress" },
  { label: "Scan style", value: "/scan/style" },
  { label: "Scan food", value: "/scan/food" },
];

type Props = {
  type?: TypeEnum;
};

function ScanPageHeading({ type }: Props) {
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
          defaultSelected={typeFilters.find((rec) => rec.value === type)}
          filterType={"type"}
          addToQuery
        />
      )}
    </Group>
  );
}

export default memo(ScanPageHeading);
