"use client";

import React, { useCallback, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IconSearch } from "@tabler/icons-react";
import { ActionIcon, Group, Indicator } from "@mantine/core";
import { Spotlight, SpotlightActionData, SpotlightStore } from "@mantine/spotlight";
import callTheServer from "@/functions/callTheServer";
import modifyQuery from "@/helpers/modifyQuery";
import { normalizeString } from "@/helpers/utils";
import classes from "./SearchButton.module.css";

type Props = {
  isDisabled?: boolean;
  forceEnabled?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  showActivityIndicator?: boolean;
  collection: string;
  searchPlaceholder: string;
  userName?: string;
  spotlightStore: SpotlightStore;
  spotlight: any;
  customConstructAction?: (items: { name: string; avatar: any }[]) => SpotlightActionData[];
};

export default function SearchButton({
  size = "md",
  isDisabled,
  forceEnabled,
  collection,
  showActivityIndicator,
  searchPlaceholder,
  userName,
  spotlightStore,
  spotlight,
  customConstructAction,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [spotlightActions, setSpotlightActions] = useState<SpotlightActionData[]>([]);

  const query = searchParams.get("query");

  const disableSpotlight = isDisabled || (spotlightActions.length === 0 && !forceEnabled);

  const handleSearch = useCallback(
    (searchQuery: string) => {
      const newQuery = modifyQuery({
        params: [{ name: "query", value: searchQuery, action: searchQuery ? "replace" : "delete" }],
      });
      router.replace(`${pathname}?${newQuery}`);
      spotlight.close();
    },
    [pathname]
  );

  const handleActionClick = useCallback(
    (value: string) => {
      const newQuery = modifyQuery({ params: [{ name: "query", value, action: "replace" }] });
      router.replace(`${pathname}?${newQuery}`);
    },
    [pathname]
  );

  const getAutocompleteData = useCallback(
    async (collection: string, query: string) => {
      let finalEndpoint = "getAutocomplete";

      if (userName) finalEndpoint += `/${userName}`;

      const parts = [`collection=${collection}`];

      if (query) {
        parts.push(`query=${query}`);
      }

      if (parts.length > 0) {
        const queryString = parts.join("&");
        finalEndpoint += `?${queryString}`;
      }

      const response = await callTheServer({
        endpoint: finalEndpoint,
        method: "GET",
      });

      if (response.status === 200) {
        if (response.message) {
          let actions: SpotlightActionData[] = [];

          if (customConstructAction) {
            actions = customConstructAction(response.message);
          } else {
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
                leftSection: <IconSearch className={"icon"} stroke={1.5} />,
                onClick: () => handleActionClick(value as string),
              });
            }
          }
          setSpotlightActions(actions);
        }
      }
    },
    [userName]
  );

  return (
    <>
      <Group className={classes.container}>
        {query && showActivityIndicator && <Indicator size={12} className={classes.indicator} />}
        <ActionIcon
          size={size}
          variant="default"
          onClick={() => spotlight.open()}
          disabled={disableSpotlight}
        >
          <IconSearch className="icon" />
        </ActionIcon>
      </Group>
      <Spotlight
        disabled={disableSpotlight}
        store={spotlightStore}
        actions={spotlightActions}
        classNames={{overlay:"overlay"}}
        onQueryChange={(query: string) => {
          setSearchQuery(query);
          if (query) getAutocompleteData(collection, query);
        }}
        nothingFound="Nothing found"
        searchProps={{
          leftSection: <IconSearch className="icon" stroke={1.5} />,
          placeholder: searchPlaceholder,
          onKeyDown: (e: React.KeyboardEvent) => {
            if (e.key !== "Enter") return;
            if (searchQuery.length > 0) return;
            handleSearch("");
          },
        }}
        overlayProps={{ blur: 0 }}
        scrollable={false}
        limit={10}
      />
    </>
  );
}
