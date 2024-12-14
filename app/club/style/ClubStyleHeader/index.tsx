import React, { useCallback, useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { IconChevronLeft } from "@tabler/icons-react";
import { ActionIcon, Group, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import TitleDropdown from "@/app/results/TitleDropdown";
import FilterButton from "@/components/FilterButton";
import FilterDropdown from "@/components/FilterDropdown";
import { useRouter } from "@/helpers/custom-router";
import { pageTypeIcons } from "@/helpers/icons";
import ClubStyleFilterCardContent from "./ClubStyleFilterCardContent";
import classes from "./ClubStyleHeader.module.css";

type Props = {
  titles: { label: string; value: string }[];
  isDisabled?: boolean;
  showReturn?: boolean;
};

const clubPageTypeItems: { label: string; value: string }[] = [
  { label: "About", value: "/club/about" },
  { label: "Routines", value: "/club/routines" },
  {
    label: "Results",
    value: "/club/style",
  },
];

export default function ClubStyleHeader({ showReturn, isDisabled, titles }: Props) {
  const router = useRouter();
  const pathname = usePathname();
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
      innerProps: <ClubStyleFilterCardContent />,
    });
  }, []);

  const handleRedirect = useCallback(
    (value?: string | null) => {
      if (!value) return;

      router.push(`${value}?${searchParams.toString()}`);
    },
    [searchParams.toString()]
  );

  return (
    <Group className={classes.container}>
      {showReturn && (
        <ActionIcon variant="default" onClick={() => router.back()}>
          <IconChevronLeft className="icon" />
        </ActionIcon>
      )}
      <TitleDropdown titles={titles} />
      <FilterButton
        onFilterClick={openFiltersCard}
        activeFiltersCount={paramsCount}
        isDisabled={isDisabled}
      />
      <FilterDropdown
        icons={pageTypeIcons}
        data={clubPageTypeItems}
        selectedValue={clubPageTypeItems.find((item) => item.value === pathname)?.value}
        onSelect={handleRedirect}
        placeholder="Select page"
        filterType="page"
      />
    </Group>
  );
}
