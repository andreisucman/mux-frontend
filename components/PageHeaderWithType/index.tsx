import React, { use } from "react";
import { useSearchParams } from "next/navigation";
import { IconChevronLeft, IconHeart, IconMan, IconMoodSmile } from "@tabler/icons-react";
import { ActionIcon, Group, Title } from "@mantine/core";
import { useRouter } from "@/helpers/custom-router";
import FilterDropdown from "../FilterDropdown";
import { FilterItemType } from "../FilterDropdown/types";
import classes from "./PageHeaderWithType.module.css";

const filterData = [
  { label: "Head", icon: <IconMoodSmile className="icon" />, value: "head" },
  { label: "Body", icon: <IconMan className="icon" />, value: "body" },
  { label: "Health", icon: <IconHeart className="icon" />, value: "health" },
];

type Props = {
  title: string;
  isDisabled?: boolean;
  showReturn?: boolean;
  onSelect?: (item?: FilterItemType) => void;
};

export default function PageHeaderWithType({ title, showReturn, isDisabled, onSelect }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "head";

  return (
    <Group className={classes.container}>
      <Group className={classes.head}>
        {showReturn && (
          <ActionIcon variant="default" onClick={() => router.back()}>
            <IconChevronLeft className="icon" />
          </ActionIcon>
        )}
        <Title order={1}>{title}</Title>
      </Group>
      <FilterDropdown
        data={filterData}
        filterType="type"
        defaultSelected={filterData.find((item) => item.value === type)}
        onSelect={onSelect}
        isDisabled={isDisabled}
        addToQuery
      />
    </Group>
  );
}
