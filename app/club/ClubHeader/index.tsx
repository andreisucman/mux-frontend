import React, { useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { IconChevronLeft } from "@tabler/icons-react";
import { ActionIcon, Group, Title } from "@mantine/core";
import FilterDropdown from "@/components/FilterDropdown";
import { clubPageTypeItems, typeItems } from "@/components/PageHeader/data";
import { useRouter } from "@/helpers/custom-router";
import getPageTypeRedirect from "@/helpers/getPageTypeRedirect";
import { pageTypeIcons, typeIcons } from "@/helpers/icons";
import classes from "./ClubHeader.module.css";

type Props = {
  title: string;
  isDisabled?: boolean;
  showReturn?: boolean;
  pageType: string;
  hideTypeDropdown?: boolean;
  onSelect?: (value?: string | null) => void;
};

export default function ClubHeader({
  title,
  showReturn,
  hideTypeDropdown,
  isDisabled,
  pageType,
  onSelect,
}: Props) {
  const router = useRouter();
  const { userName } = useParams();
  const searchParams = useSearchParams();

  const type = searchParams.get("type");

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
      <Group className={classes.left}>
        {showReturn && (
          <ActionIcon variant="default" onClick={() => router.back()}>
            <IconChevronLeft className="icon" />
          </ActionIcon>
        )}
        <Title order={1} lineClamp={2}>
          {title}
        </Title>
      </Group>
      <FilterDropdown
        icons={pageTypeIcons}
        data={clubPageTypeItems}
        selectedValue={pageType}
        onSelect={handleRedirect}
        placeholder="Select page"
        filterType="page"
        isDisabled={isDisabled}
      />
      {!hideTypeDropdown && (
        <FilterDropdown
          icons={typeIcons}
          data={typeItems}
          filterType="type"
          selectedValue={typeItems.find((item) => item.value === type)?.value}
          onSelect={onSelect}
          placeholder="Select type"
          isDisabled={isDisabled}
          addToQuery
        />
      )}
    </Group>
  );
}
