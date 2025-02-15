import React, { useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { IconChevronLeft } from "@tabler/icons-react";
import { ActionIcon, Group, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import TitleDropdown from "@/app/results/TitleDropdown";
import FilterButton from "@/components/FilterButton";
import FilterDropdown from "@/components/FilterDropdown";
import { clubPageTypeItems } from "@/components/PageHeader/data";
import SortButton from "@/components/SortButton";
import { progressSortItems } from "@/data/sortItems";
import { useRouter } from "@/helpers/custom-router";
import getPageTypeRedirect from "@/helpers/getPageTypeRedirect";
import { pageTypeIcons } from "@/helpers/icons";
import ClubProgressFilterCardContent from "./ClubProgressFilterCardContent";
import classes from "./ProgressHeader.module.css";

type Props = {
  titles: { label: string; value: string }[];
  isDisabled?: boolean;
  showReturn?: boolean;
  userName?: string;
};

export default function ClubProgressHeader({ titles, userName, showReturn, isDisabled }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const paramsCount = useMemo(() => {
    const allParams = Array.from(searchParams.keys());
    const requiredParams = allParams.filter((param) => param === "part");
    return requiredParams.length;
  }, [searchParams.toString()]);

  const handleRedirect = useCallback(
    (value?: string | null) => {
      if (!value) return;

      const path = getPageTypeRedirect(value, userName);

      router.push(`${path}?${searchParams.toString()}`);
    },
    [userName, searchParams.toString()]
  );

  const openFiltersCard = useCallback(() => {
    modals.openContextModal({
      modal: "general",
      title: (
        <Title order={5} component="p">
          Filters
        </Title>
      ),
      centered: true,
      innerProps: <ClubProgressFilterCardContent userName={userName} />,
    });
  }, [userName]);

  return (
    <Group className={classes.container}>
      {showReturn && (
        <ActionIcon variant="default" onClick={() => router.back()}>
          <IconChevronLeft className="icon" />
        </ActionIcon>
      )}
      <TitleDropdown titles={titles} />
      <SortButton sortItems={progressSortItems} isDisabled={isDisabled} />
      <FilterButton
        onFilterClick={openFiltersCard}
        activeFiltersCount={paramsCount}
        isDisabled={isDisabled}
      />
      <FilterDropdown
        icons={pageTypeIcons}
        data={clubPageTypeItems}
        selectedValue={"progress"}
        onSelect={handleRedirect}
        placeholder="Select page"
        filterType="page"
      />
    </Group>
  );
}
