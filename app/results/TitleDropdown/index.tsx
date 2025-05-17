"use client";

import React, { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { Group, HoverCard, Stack, Title } from "@mantine/core";
import { useDisclosure, useElementSize } from "@mantine/hooks";
import classes from "./TitleDropdown.module.css";

export type TitleType = {
  label: string;
  value: string;
  onClick?: () => void;
  method?: string;
  addQuery?: boolean;
};

type Props = {
  titles: TitleType[];
  customDropdownStyles?: { [key: string]: any };
  customHeadStyles?: { [key: string]: any };
};

export default function TitleDropdown({ titles, customDropdownStyles, customHeadStyles }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { ref, width } = useElementSize();
  const [collapseOpened, { toggle, close }] = useDisclosure(false);
  const currentPage = useMemo(
    () => titles.find((record) => pathname.includes(record.value)),
    [pathname]
  );

  const icon = collapseOpened ? (
    <IconChevronUp size={20} stroke={1.5} />
  ) : (
    <IconChevronDown size={20} stroke={1.5} />
  );

  const handleRedirect = useCallback(
    (pathname: string, method = "replace", addQuery = false) => {
      let url = `/${pathname}`;
      if (addQuery) {
        if (searchParams.toString()) {
          url += `?${searchParams.toString()}`;
        }
      }

      if (method === "push") {
        router.push(url);
        return;
      }
      router.replace(url);
    },
    [searchParams.toString(), pathname]
  );

  return (
    <HoverCard
      width={width}
      onClose={close}
      defaultOpened={false}
      classNames={{ dropdown: classes.dropdown }}
      styles={{ dropdown: customDropdownStyles ? customDropdownStyles : {} }}
    >
      <HoverCard.Target>
        <Group className={classes.head} style={customHeadStyles || {}} onClick={toggle} ref={ref}>
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
              onClick={() => handleRedirect(record.value, record.method, record.addQuery)}
            >
              {record.label}
            </Title>
          ))}
        </Stack>
      </HoverCard.Dropdown>
    </HoverCard>
  );
}
