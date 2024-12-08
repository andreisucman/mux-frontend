import React from "react";
import { IconChevronLeft } from "@tabler/icons-react";
import { ActionIcon, Group, Title } from "@mantine/core";
import { useRouter } from "@/helpers/custom-router";
import FilterDropdown from "../FilterDropdown";
import { FilterItemType } from "../FilterDropdown/types";
import classes from "./PageHeaderWithReturn.module.css";

type Props = {
  title: string;
  showReturn?: boolean;
  isDisabled?: boolean;
  filterData?: FilterItemType[];
  icons?: { [key: string]: any };
};

export default function PageHeaderWithReturn({
  isDisabled,
  title,
  showReturn,
  filterData,
  icons,
}: Props) {
  const router = useRouter();

  return (
    <Group className={classes.container}>
      <Group className={classes.left}>
        {showReturn && (
          <ActionIcon variant="default" onClick={() => router.back()}>
            <IconChevronLeft className="icon" />
          </ActionIcon>
        )}
        <Title order={1} lineClamp={2} className={classes.title}>
          {title}
        </Title>
      </Group>
      {filterData && (
        <FilterDropdown
          isDisabled={isDisabled}
          data={filterData}
          icons={icons}
          placeholder="Select type"
          filterType="type"
          addToQuery
        />
      )}
    </Group>
  );
}
