import React, { useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { IconChevronLeft } from "@tabler/icons-react";
import { ActionIcon, Group, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import FilterDropdown from "@/components/FilterDropdown";
import { clubPageTypeItems } from "@/components/PageHeader/data";
import SortButton from "@/components/SortButton";
import { useRouter } from "@/helpers/custom-router";
import getPageTypeRedirect from "@/helpers/getPageTypeRedirect";
import { pageTypeIcons } from "@/helpers/icons";
import classes from "./ClubHeader.module.css";

type Props = {
  title: string;
  isDisabled?: boolean;
  showReturn?: boolean;
  children?: React.ReactNode;
  sortItems?: { value: string; label: string }[];
  pageType: string;
  onSelect?: (value?: string | null) => void;
};

export default function ClubHeader({
  title,
  showReturn,
  isDisabled,
  children,
  pageType,
  sortItems,
}: Props) {
  const isMobile = useMediaQuery("(max-width: 36em)");
  const router = useRouter();
  const params = useParams();
  const userName = Array.isArray(params?.userName) ? params?.userName?.[0] : params.userName;

  const handleRedirect = useCallback(
    (pageName?: string | null) => {
      if (!pageName) return;
      const path = getPageTypeRedirect(pageName, userName);

      router.replace(path);
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
      {children}
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
