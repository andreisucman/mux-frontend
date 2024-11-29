"use client";

import React, { useCallback, useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { Group, HoverCard, Stack, Title } from "@mantine/core";
import { useDisclosure, useElementSize } from "@mantine/hooks";
import { useRouter } from "@/helpers/custom-router";
import classes from "./TitleDropdown.module.css";

type Props = {
  titles: { label: string; value: string }[];
};

export default function TitleDropdown({ titles }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { ref, width } = useElementSize();
  const currentPage = useMemo(() => titles.find((record) => record.value === pathname), [pathname]);

  const [collapseOpened, { toggle, close }] = useDisclosure(false);

  const icon = collapseOpened ? (
    <IconChevronUp className="icon" stroke={1.5} />
  ) : (
    <IconChevronDown className="icon" stroke={1.5} />
  );

  const handleRedirect = useCallback(
    (pathname: string) => {
      router.push(`${pathname}?${searchParams.toString()}`);
      close();
    },
    [searchParams.toString(), pathname]
  );

  return (
    <HoverCard
      width={width}
      onClose={close}
      closeOnClickOutside
      classNames={{ dropdown: classes.dropdown }}
    >
      <HoverCard.Target>
        <Group className={classes.head} onClick={toggle} ref={ref}>
          <Title order={1}>{currentPage?.label}</Title>
          {icon}
        </Group>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Stack className={classes.content}>
          {titles.map((record, index) => (
            <Title
              order={2}
              key={index}
              className={classes.item}
              onClick={() => handleRedirect(record.value)}
            >
              {record.label}
            </Title>
          ))}
        </Stack>
      </HoverCard.Dropdown>
    </HoverCard>
  );
}
