import React from "react";
import { usePathname } from "next/navigation";
import { IconChevronLeft, IconProgress, IconSoup } from "@tabler/icons-react";
import { ActionIcon, Group, Title } from "@mantine/core";
import FilterDropdown from "@/components/FilterDropdown";
import { useRouter } from "@/helpers/custom-router";

const categoryIcons = {
  "/analysis": <IconProgress className="icon" />,
  "/analysis/food": <IconSoup className="icon" />,
};

const categories = [
  { label: "Progress", value: "/analysis" },
  { label: "Food", value: "/analysis/food" },
];

type Props = {
  title: string;
  type?: string | null;
  onTypeChange?: (newType?: null | string) => void;
};

export default function AnalysisHeader({ title }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Group>
      <ActionIcon variant="default" onClick={() => router.back()}>
        <IconChevronLeft className="icon" />
      </ActionIcon>
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
