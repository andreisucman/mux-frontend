import React from "react";
import { usePathname } from "next/navigation";
import { IconChevronLeft, IconHanger, IconProgress, IconSoup } from "@tabler/icons-react";
import { ActionIcon, Group, Title } from "@mantine/core";
import FilterDropdown from "@/components/FilterDropdown";
import { useRouter } from "@/helpers/custom-router";
import classes from "./AnalysisHeader.module.css";

const categoryIcons = {
  "/analysis": <IconProgress className="icon" />,
  "/analysis/style": <IconHanger className="icon" />,
  "/analysis/food": <IconSoup className="icon" />,
};

const categories = [
  { label: "Progress", value: "/analysis" },
  { label: "Style", value: "/analysis/style" },
  { label: "Food", value: "/analysis/food" },
];

type Props = {
  showReturn?: boolean;
  title: string;
  type?: string | null;
  onTypeChange?: (newType?: null | string) => void;
};

export default function AnalysisHeader({ title, showReturn }: Props) {
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
        selectedValue={pathname}
        filterType="category"
        placeholder="Select category"
        onSelect={(url?: string | null) => router.replace(url || "/")}
      />
    </Group>
  );
}
