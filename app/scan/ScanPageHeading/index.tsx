import React, { memo } from "react";
import { IconChevronLeft, IconMan, IconMoodSmile } from "@tabler/icons-react";
import { ActionIcon, Group, Title } from "@mantine/core";
import FilterDropdown from "@/components/FilterDropdown";
import { useRouter } from "@/helpers/custom-router";
import { TypeEnum } from "@/types/global";
import classes from "./ScanPageHeading.module.css";

const typeFilters = [
  { label: "Head", icon: <IconMoodSmile className="icon" />, value: "head" },
  { label: "Body", icon: <IconMan className="icon" />, value: "body" },
];

type Props = {
  type: TypeEnum;
  title: string;
};

function ScanPageHeading({ type, title }: Props) {
  const router = useRouter();

  return (
    <Group className={classes.container}>
      <Group className={classes.head}>
        <ActionIcon variant="default" onClick={() => router.back()}>
          <IconChevronLeft className="icon" />
        </ActionIcon>
        <Title order={1}>{title}</Title>
      </Group>

      <FilterDropdown
        data={typeFilters}
        defaultSelected={typeFilters.find((rec) => rec.value === type)}
        filterType={"type"}
        addToQuery
      />
    </Group>
  );
}

export default memo(ScanPageHeading);
