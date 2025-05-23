"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IconArrowRight, IconSearch } from "@tabler/icons-react";
import { ActionIcon, Group, HoverCard, rem, Stack, Text, TextInput, Title } from "@mantine/core";
import callTheServer from "@/functions/callTheServer";
import openFiltersCard, { FilterCardNamesEnum } from "@/functions/openFilterCard";
import modifyQuery from "@/helpers/modifyQuery";
import { normalizeString } from "@/helpers/utils";
import FilterButton from "../FilterButton";
import { ExistingFiltersType } from "../FilterCardContent/FilterCardContent";
import classes from "./ConcernSearchComponent.module.css";

type Props = {
  filterNames: string[];
};

type AutocompleteData = {
  id: string;
  label: string;
  leftSection: React.ReactNode;
  onClick: () => void;
};

const collectionMap: { [key: string]: string } = {
  "/": "progress",
  "/proof": "proof",
};

export default function ConcernSearchComponent({ filterNames }: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [filters, setFilters] = useState<ExistingFiltersType>();
  const [searchQuery, setSearchQuery] = useState("");
  const [autocompleteItems, setAutocompleteItems] = useState<AutocompleteData[]>([]);

  const userName = searchParams.get("userName");
  const savedQuery = searchParams.get("query");

  const activeFiltersCount = useMemo(() => {
    const allQueryParams = Array.from(searchParams.keys());
    const included = allQueryParams.filter((k) => filterNames?.includes(k));
    return included.length;
  }, [searchParams.toString()]);

  const redirect = (query: string) => {
    const newSearchParams = new URLSearchParams();
    newSearchParams.set("query", query);
    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  const getExistingFilters = useCallback(async (pathname: string) => {
    const response = await callTheServer({
      endpoint: `getExistingFilters/${collectionMap[pathname]}`,
      method: "GET",
    });

    if (response.status === 200) {
      setFilters(response.message);
    }
  }, []);

  const handleActionClick = useCallback(
    (value: string) => {
      const newQuery = modifyQuery({ params: [{ name: "query", value, action: "replace" }] });
      router.replace(`${pathname}?${newQuery}`);
      setSearchQuery("");
      setAutocompleteItems([]);
    },
    [pathname]
  );

  const getAutocompleteData = useCallback(
    async (collection: string, query: string) => {
      let finalEndpoint = "getAutocomplete";

      if (userName) finalEndpoint += `/${userName}`;

      const urlSearchParams = new URLSearchParams();
      urlSearchParams.set("collection", collection);
      urlSearchParams.set("isPublic", "true");

      if (query) {
        urlSearchParams.set("query", query);
      }

      const queryString = urlSearchParams.toString();

      if (queryString) {
        finalEndpoint += `?${queryString}`;
      }

      const response = await callTheServer({
        endpoint: finalEndpoint,
        method: "GET",
      });

      if (response.status === 200) {
        if (response.message) {
          let actions = [];

          const uniqueValues = new Set();

          const allValues = response.message
            .flatMap((obj: { [key: string]: any }) =>
              Object.values(obj).flatMap((value) => (Array.isArray(value) ? value : value))
            )
            .sort((a: string, b: string) => String(a).localeCompare(String(b)));

          for (const value of allValues) {
            uniqueValues.add(value);
          }

          for (const value of uniqueValues) {
            actions.push({
              id: value as string,
              label: normalizeString(value as string).toLowerCase(),
              leftSection: <IconSearch size={20} stroke={1.5} />,
              onClick: () => handleActionClick(value as string),
            });
          }
          setAutocompleteItems(actions);
        }
      }
    },
    [userName]
  );

  const handleOnChange = (text: string) => {
    if (!text) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete("query");
      router.replace(`/?${newSearchParams.toString()}`);
    }
    setSearchQuery(text);
    getAutocompleteData("beforeAfter", text);
  };

  useEffect(() => {
    getExistingFilters(pathname);
  }, []);

  useEffect(() => {
    if (!savedQuery) return;
    const lcQuery = normalizeString(savedQuery).toLowerCase();
    setSearchQuery(lcQuery);
  }, [savedQuery]);

  return (
    <Stack className={classes.container}>
      <Title ta="center" order={1}>
        Search proven routines
      </Title>
      <Group className={classes.wrapper}>
        <HoverCard
          disabled={autocompleteItems.length === 0}
          styles={{ dropdown: { width: "100%", maxWidth: rem(556) } }}
        >
          <HoverCard.Target>
            <TextInput
              placeholder="Search by concern"
              value={searchQuery}
              onChange={(e) => handleOnChange(e.currentTarget.value)}
              className={classes.textInput}
              rightSection={
                <ActionIcon variant="default" onClick={() => redirect(searchQuery)}>
                  <IconArrowRight size={18} />
                </ActionIcon>
              }
            />
          </HoverCard.Target>
          <HoverCard.Dropdown>
            <Stack>
              {autocompleteItems.map((obj) => (
                <Group key={obj.id} onClick={obj.onClick} style={{ cursor: "pointer" }}>
                  {obj.leftSection}
                  <Text>{obj.label}</Text>
                </Group>
              ))}
            </Stack>
          </HoverCard.Dropdown>
        </HoverCard>

        <FilterButton
          onFilterClick={() =>
            openFiltersCard({
              cardName: FilterCardNamesEnum.FilterCardContent,
              childrenProps: { filters },
            })
          }
          activeFiltersCount={activeFiltersCount}
        />
      </Group>
    </Stack>
  );
}
