import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IconChevronLeft, IconMan, IconMoodSmile } from "@tabler/icons-react";
import { ActionIcon, Group, Title } from "@mantine/core";
import FilterButton from "@/components/FilterButton";
import FilterDropdown from "@/components/FilterDropdown";
import { FilterItemType } from "@/components/FilterDropdown/types";
import classes from "./StyleHeader.module.css";

const typeData = [
  { label: "Head", icon: <IconMoodSmile className="icon" />, value: "head" },
  { label: "Body", icon: <IconMan className="icon" />, value: "body" },
];

type Props = {
  title: string;
  isDisabled?: boolean;
  showReturn?: boolean;
  onSelect?: (item?: FilterItemType) => void;
};

export default function StyleHeader({ title, showReturn, isDisabled, onSelect }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const type = searchParams.get("type") || "head";

  return (
    <Group className={classes.container}>
      <Group className={classes.left}>
        {showReturn && (
          <ActionIcon variant="default" onClick={() => router.back()}>
            <IconChevronLeft className="icon" />
          </ActionIcon>
        )}
        <Title order={1} lineClamp={2}>
          {title}
        </Title>
      </Group>
      <FilterButton  />
      <FilterDropdown
        data={typeData}
        filterType="type"
        defaultSelected={typeData.find((item) => item.value === type)}
        onSelect={onSelect}
        isDisabled={isDisabled}
        addToQuery
      />
    </Group>
  );
}
