import React, { useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { IconChevronLeft } from "@tabler/icons-react";
import { ActionIcon, Group, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import TitleDropdown from "@/app/results/TitleDropdown";
import FilterButton from "@/components/FilterButton";
import FilterDropdown from "@/components/FilterDropdown";
import SortButton from "@/components/SortButton";
import { styleSortItems } from "@/data/sortItems";
import { useRouter } from "@/helpers/custom-router";
import getPageTypeRedirect from "@/helpers/getPageTypeRedirect";
import { pageTypeIcons } from "@/helpers/icons";
import { clubPageTypeItems } from "@/components/PageHeader/data";
import ClubStyleFilterCardContent from "./ClubStyleFilterCardContent";
import classes from "./ClubStyleHeader.module.css";

type Props = {
  titles: { label: string; value: string }[];
  isDisabled?: boolean;
  showReturn?: boolean;
  userName?: string;
};

export default function ClubStyleHeader({ showReturn, userName, isDisabled, titles }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const paramsCount = useMemo(() => {
    const allParams = Array.from(searchParams.keys());
    const requiredParams = allParams.filter((param) => ["type", "styleName"].includes(param));
    return requiredParams.length;
  }, [searchParams.toString()]);

  const openFiltersCard = useCallback(() => {
    modals.openContextModal({
      modal: "general",
      title: (
        <Title order={5} component="p">
          Filters
        </Title>
      ),
      centered: true,
      innerProps: <ClubStyleFilterCardContent userName={userName} />,
    });
  }, []);

  const handleRedirect = useCallback(
    (value?: string | null) => {
      if (!value) return;

      const path = getPageTypeRedirect(value, userName);

      router.push(`${path}?${searchParams.toString()}`);
    },
    [userName, searchParams.toString()]
  );

  return (
    <Group className={classes.container}>
      {showReturn && (
        <ActionIcon variant="default" onClick={() => router.back()}>
          <IconChevronLeft className="icon" />
        </ActionIcon>
      )}
      <TitleDropdown titles={titles} />
      <SortButton sortItems={styleSortItems} isDisabled={isDisabled} />
      <FilterButton
        onFilterClick={openFiltersCard}
        activeFiltersCount={paramsCount}
        isDisabled={isDisabled}
      />
      <FilterDropdown
        icons={pageTypeIcons}
        data={clubPageTypeItems}
        selectedValue={"style"}
        onSelect={handleRedirect}
        placeholder="Select page"
        filterType="page"
      />
    </Group>
  );
}
