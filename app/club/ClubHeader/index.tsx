import React, { useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  IconChevronLeft,
  IconClipboardText,
  IconHeart,
  IconMan,
  IconMoodSmile,
  IconTargetArrow,
  IconUserCircle,
} from "@tabler/icons-react";
import { ActionIcon, Group, Title } from "@mantine/core";
import FilterDropdown from "@/components/FilterDropdown";
import { useRouter } from "@/helpers/custom-router";
import classes from "./ClubHeader.module.css";

const clubPageTypeData = [
  { label: "About", icon: <IconUserCircle className="icon" />, value: "/club/about" },
  { label: "Routine", icon: <IconClipboardText className="icon" />, value: "/club/routine" },
  { label: "Results", icon: <IconTargetArrow className="icon" />, value: "/club/results" },
];

const typeData = [
  { label: "Head", icon: <IconMoodSmile className="icon" />, value: "head" },
  { label: "Body", icon: <IconMan className="icon" />, value: "body" },
  { label: "Health", icon: <IconHeart className="icon" />, value: "health" },
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
      <Group className={classes.right}>
        <FilterDropdown
          data={clubPageTypeData}
          defaultSelected={clubPageTypeData.find((item) => item.value === pathname)?.value}
          onSelect={handleRedirect}
          placeholder="Select page"
          isDisabled={isDisabled}
        />
        {!hideTypeDropdown && (
          <FilterDropdown
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
    </Group>
  );
}
