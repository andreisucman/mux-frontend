import React, { useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { IconChevronLeft } from "@tabler/icons-react";
import { ActionIcon, Group, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import FilterDropdown from "@/components/FilterDropdown";
import { clubPageTypeItems, typeItems } from "@/components/PageHeader/data";
import SortButton from "@/components/SortButton";
import { useRouter } from "@/helpers/custom-router";
import getPageTypeRedirect from "@/helpers/getPageTypeRedirect";
import { pageTypeIcons, typeIcons } from "@/helpers/icons";
import { TypeEnum } from "@/types/global";
import classes from "./ClubHeader.module.css";

type Props = {
  title: string;
  isDisabled?: boolean;
  showReturn?: boolean;
  sortItems?: { value: string; label: string }[];
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
  sortItems,
  onSelect,
}: Props) {
  const isMobile = useMediaQuery("(max-width: 36em)");
  const router = useRouter();
  const params = useParams();
  const userName = Array.isArray(params?.userName) ? params?.userName?.[0] : params.userName;
  const searchParams = useSearchParams();

  const type = searchParams.get("type") || TypeEnum.HEAD;

  const handleRedirect = useCallback(
    (pageName?: string | null) => {
      if (!pageName) return;
      const path = getPageTypeRedirect(pageName, userName);

      router.push(path);
    },
    [userName]
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
      {sortItems && <SortButton sortItems={sortItems} isDisabled={isDisabled} />}
      {isMobile && (
        <FilterDropdown
          icons={pageTypeIcons}
          data={clubPageTypeItems}
          selectedValue={pageType}
          onSelect={handleRedirect}
          placeholder="Select page"
          filterType="page"
          isDisabled={isDisabled}
        />
      )}
      {!hideTypeDropdown && (
        <FilterDropdown
          icons={typeIcons}
          data={typeItems}
          filterType="type"
          selectedValue={type}
          onSelect={onSelect}
          placeholder="Select type"
          isDisabled={isDisabled}
          addToQuery
        />
      )}
      {!isMobile && (
        <FilterDropdown
          icons={pageTypeIcons}
          data={clubPageTypeItems}
          selectedValue={pageType}
          onSelect={handleRedirect}
          placeholder="Select page"
          filterType="page"
          isDisabled={isDisabled}
        />
      )}
    </Group>
  );
}
