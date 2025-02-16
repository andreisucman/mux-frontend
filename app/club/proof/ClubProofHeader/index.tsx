import React, { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IconChevronLeft } from "@tabler/icons-react";
import { ActionIcon, Group, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { createSpotlight } from "@mantine/spotlight";
import TitleDropdown from "@/app/results/TitleDropdown";
import FilterButton from "@/components/FilterButton";
import FilterDropdown from "@/components/FilterDropdown";
import { clubPageTypeItems } from "@/components/PageHeader/data";
import SearchButton from "@/components/SearchButton";
import SortButton from "@/components/SortButton";
import { proofSortItems } from "@/data/sortItems";
import getPageTypeRedirect from "@/helpers/getPageTypeRedirect";
import { pageTypeIcons } from "@/helpers/icons";
import ClubProofFilterCardContent from "./ClubProofFilterCardContent";
import classes from "./ProofHeader.module.css";

type Props = {
  titles: { label: string; value: string }[];
  showReturn?: boolean;
  userName?: string;
  isDisabled?: boolean;
};

const [spotlightStore, proofSpotlight] = createSpotlight();

export default function ClubProofHeader({ userName, showReturn, isDisabled, titles }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const paramsCount = useMemo(() => {
    const allParams = Array.from(searchParams.keys());
    const requiredParams = allParams.filter((param) => ["part"].includes(param));
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
      innerProps: <ClubProofFilterCardContent userName={userName} />,
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
      <SortButton sortItems={proofSortItems} isDisabled={isDisabled} />
      <FilterButton
        activeFiltersCount={paramsCount}
        onFilterClick={openFiltersCard}
        isDisabled={isDisabled}
      />
      <SearchButton
        isDisabled={isDisabled}
        collection="proof"
        searchPlaceholder="Search proof"
        userName={userName}
        spotlight={proofSpotlight}
        spotlightStore={spotlightStore}
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
