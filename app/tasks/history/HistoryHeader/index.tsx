import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconChevronLeft } from "@tabler/icons-react";
import { ActionIcon, Group, Title } from "@mantine/core";
import FilterDropdown from "@/components/FilterDropdown";
import { FilterPartItemType } from "@/components/FilterDropdown/types";
import SortButton from "@/components/SortButton";
import { historySortItems } from "@/data/sortItems";
import getFilters from "@/functions/getFilters";
import { useRouter } from "@/helpers/custom-router";
import { partIcons, statusIcons } from "@/helpers/icons";
import classes from "./HistoryHeader.module.css";

type Props = {
  title: React.ReactNode | string;
  onSelect?: (key?: string | null) => void;
};

export default function HistoryHeader({ title, onSelect }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [availableParts, setAvaiableParts] = useState<FilterPartItemType[]>([]);
  const [availableStatuses, setAvailableStatuses] = useState<FilterPartItemType[]>([]);

  const status = searchParams.get("status");
  const part = searchParams.get("part");

  useEffect(() => {
    getFilters({ collection: "task", fields: ["part", "status"] }).then((result) => {
      const { availableParts, availableStatuses } = result;
      setAvaiableParts(availableParts);
      setAvailableStatuses(availableStatuses);
    });
  }, []);

  return (
    <Group className={classes.container}>
      <Group className={classes.left}>
        <ActionIcon variant="default" onClick={() => router.back()}>
          <IconChevronLeft className="icon" />
        </ActionIcon>
        <Title order={1} lineClamp={3} className={classes.title}>
          {title}
        </Title>
      </Group>
      <SortButton sortItems={historySortItems} isDisabled={availableParts.length === 0} />
      <FilterDropdown
        data={availableStatuses}
        icons={statusIcons}
        selectedValue={status}
        placeholder={`Filter by status`}
        filterType={"status"}
        onSelect={onSelect}
        addToQuery
        allowDeselect
        isDisabled={availableStatuses.length === 0}
      />
      <FilterDropdown
        data={availableParts}
        icons={partIcons}
        selectedValue={part}
        placeholder={`Filter by part`}
        filterType={"part"}
        onSelect={onSelect}
        addToQuery
        allowDeselect
        isDisabled={availableParts.length === 0}
      />
    </Group>
  );
}
