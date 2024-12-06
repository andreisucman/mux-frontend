import React, { useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  IconChevronLeft,
  IconClipboardText,
  IconTargetArrow,
  IconUserCircle,
} from "@tabler/icons-react";
import { ActionIcon, Group, Title } from "@mantine/core";
import FilterDropdown from "@/components/FilterDropdown";
import { typeIcons } from "@/components/PageHeader/data";
import { useRouter } from "@/helpers/custom-router";
import classes from "./ClubHeader.module.css";

export const pageTypeIcons: { [key: string]: React.ReactNode } = {
  "/club/about": <IconUserCircle className="icon" />,
  "/club/routine": <IconClipboardText className="icon" />,
  "/club/results": <IconTargetArrow className="icon" />,
};

const clubPageTypeData: { label: string; value: string }[] = [
  { label: "About", value: "/club/about" },
  { label: "Routine", value: "/club/routine" },
  { label: "Results", value: "/club/results" },
];

const typeData: { label: string; value: string }[] = [
  { label: "Head", value: "head" },
  { label: "Body", value: "body" },
  { label: "Health", value: "health" },
];

type Props = {
  title: string;
  isDisabled?: boolean;
  showReturn?: boolean;
  hideTypeDropdown?: boolean;
  onSelect?: (value?: string | null) => void;
};

export default function ClubHeader({
  title,
  showReturn,
  hideTypeDropdown,
  isDisabled,
  onSelect,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const type = searchParams.get("type") || "head";

  const handleRedirect = useCallback(
    (value?: string | null) => {
      if (!value) return;

      router.push(`${value}?${searchParams.toString()}`);
    },
    [searchParams.toString()]
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
        data={clubPageTypeData}
        defaultSelected={clubPageTypeData.find((item) => item.value === pathname)?.value}
        onSelect={handleRedirect}
        placeholder="Select page"
        isDisabled={isDisabled}
      />
      {!hideTypeDropdown && (
        <FilterDropdown
          icons={typeIcons}
          data={typeData}
          filterType="type"
          defaultSelected={typeData.find((item) => item.value === type)?.value}
          onSelect={onSelect}
          placeholder="Select type"
          isDisabled={isDisabled}
          addToQuery
        />
      )}
    </Group>
  );
}
