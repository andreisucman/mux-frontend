import React from "react";
import { IconChevronLeft } from "@tabler/icons-react";
import { ActionIcon, Group, Title } from "@mantine/core";
import FilterDropdown from "@/components/FilterDropdown";
import { partItems } from "@/components/PageHeader/data";
import SortButton from "@/components/SortButton";
import { historySortItems } from "@/data/sortItems";
import { useRouter } from "@/helpers/custom-router";
import { partIcons, statusIcons } from "@/helpers/icons";
import classes from "./HistoryHeader.module.css";

type Props = {
  title: React.ReactNode | string;
  selectedStatus: string | null;
  selectedPart: string | null;
  onSelect?: (key?: string | null) => void;
};

const statuses = [
  { label: "Completed", value: "completed" },
  { label: "Expired", value: "expired" },
  { label: "Canceled", value: "canceled" },
];

export default function HistoryHeader({ selectedStatus, selectedPart, title, onSelect }: Props) {
  const router = useRouter();

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
      <SortButton sortItems={historySortItems} />
      <FilterDropdown
        data={statuses}
        icons={statusIcons}
        selectedValue={selectedStatus}
        placeholder={`Filter by status`}
        filterType={"status"}
        onSelect={onSelect}
        addToQuery
        allowDeselect
      />
      <FilterDropdown
        data={partItems}
        icons={partIcons}
        selectedValue={selectedPart}
        placeholder={`Filter by part`}
        filterType={"part"}
        onSelect={onSelect}
        addToQuery
        allowDeselect
      />
    </Group>
  );
}
