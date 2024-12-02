import React, { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IconChevronLeft, IconMan, IconMoodSmile } from "@tabler/icons-react";
import { ActionIcon, Group, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import FilterButton from "@/components/FilterButton";
import FilterDropdown from "@/components/FilterDropdown";
import TitleDropdown from "../../TitleDropdown";
import StyleFilterContent from "./StyleFilterContent";
import classes from "./StyleHeader.module.css";

const icons = {
  head: <IconMoodSmile className="icon" />,
  body: <IconMan className="icon" />,
};

const typeData = [
  { label: "Head", value: "head" },
  { label: "Body", value: "body" },
];

const titles = [
  { label: "Progress", value: "/results" },
  { label: "Style", value: "/results/style" },
  { label: "Proof", value: "/results/proof" },
];

type Props = {
  title: string;
  isDisabled?: boolean;
  showReturn?: boolean;
  onSelect?: (item?: string | null) => void;
};

export default function StyleHeader({ showReturn, isDisabled, onSelect }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const styleName = searchParams.get("styleName");

  const type = searchParams.get("type") || "head";
  const activeFiltersCount = styleName ? 1 : 0;

  const handleOpenStyleFilters = useCallback(() => {
    modals.openContextModal({
      modal: "general",
      title: (
        <Title order={5} component={"p"}>
          Style filters
        </Title>
      ),
      innerProps: <StyleFilterContent />,
      centered: true,
    });
  }, []);

  return (
    <Group className={classes.container}>
      <Group className={classes.left}>
        {showReturn && (
          <ActionIcon variant="default" onClick={() => router.back()}>
            <IconChevronLeft className="icon" />
          </ActionIcon>
        )}
        <TitleDropdown titles={titles} />
      </Group>
      {!isDisabled && (
        <Group className={classes.right}>
          <FilterButton
            onFilterClick={handleOpenStyleFilters}
            activeFiltersCount={activeFiltersCount}
            isDisabled={isDisabled}
          />
          <FilterDropdown
            data={typeData}
            filterType="type"
            icons={icons}
            defaultSelected={typeData.find((item) => item.value === type)?.value}
            onSelect={onSelect}
            placeholder="Select type"
            isDisabled={isDisabled}
            addToQuery
          />
        </Group>
      )}
    </Group>
  );
}
