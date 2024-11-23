import React, { memo } from "react";
import { IconMan, IconMoodSmile } from "@tabler/icons-react";
import { Group, Title } from "@mantine/core";
import FilterDropdown from "@/components/FilterDropdown";
import { TypeEnum } from "@/types/global";
import classes from "./UploadPageHeading.module.css";

const typeFilters = [
  { label: "Head", icon: <IconMoodSmile className="icon" />, value: "head" },
  { label: "Body", icon: <IconMan className="icon" />, value: "body" },
];

type Props = {
  type: TypeEnum;
};

function UploadPageHeading({ type }: Props) {
  return (
    <Group className={classes.header}>
      <Title order={1}>Scan your {type}</Title>
      <FilterDropdown
        data={typeFilters}
        defaultSelected={typeFilters.find((rec) => rec.value === type)}
        filterType={"type"}
        addToQuery
      />
    </Group>
  );
}

export default memo(UploadPageHeading);
