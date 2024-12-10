import React from "react";
import { usePathname } from "next/navigation";
import { IconChevronLeft, IconHanger, IconProgress } from "@tabler/icons-react";
import { ActionIcon, Group, Title } from "@mantine/core";
import FilterDropdown from "@/components/FilterDropdown";
import { useRouter } from "@/helpers/custom-router";
import { typeIcons } from "@/helpers/icons";
import classes from "./AnalysisHeader.module.css";

type Props = {
  showReturn?: boolean;
  title: string;
  onTypeChange: (newType?: null | string) => void;
};

const categoryIcons = {
  "/analysis": <IconProgress className="icon" />,
  "/analysis/style": <IconHanger className="icon" />,
};

const types = [
  { label: "Head", value: "head" },
  { label: "Body", value: "body" },
];

const categories = [
  { label: "Progress", value: "/analysis" },
  { label: "Style", value: "/analysis/style" },
];

export default function AnalysisHeader({ title, showReturn, onTypeChange }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Group className={classes.heading}>
      {showReturn && (
        <ActionIcon variant="default" onClick={() => router.back()}>
          <IconChevronLeft className="icon" />
        </ActionIcon>
      )}
      <Title order={1} mr="auto">
        {title}
      </Title>
      <FilterDropdown
        data={categories}
        icons={categoryIcons}
        defaultSelected={pathname}
        placeholder="Select category"
        onSelect={(url?: string | null) => router.replace(url || "/")}
      />
      <FilterDropdown
        data={types}
        icons={typeIcons}
        filterType="type"
        placeholder="Select type"
        onSelect={onTypeChange}
        addToQuery
      />
    </Group>
  );
}
