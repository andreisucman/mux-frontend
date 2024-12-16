import React, { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IconChevronLeft, IconSearch } from "@tabler/icons-react";
import { ActionIcon, Group } from "@mantine/core";
import { createSpotlight, Spotlight, SpotlightActionData } from "@mantine/spotlight";
import FilterDropdown from "@/components/FilterDropdown";
import { FilterItemType, FilterPartItemType } from "@/components/FilterDropdown/types";
import SearchButton from "@/components/SearchButton";
import fetchAutocompleteData from "@/functions/fetchAutocompleteData";
import getUsersFilters from "@/functions/getUsersFilters";
import { partIcons, typeIcons } from "@/helpers/icons";
import modifyQuery from "@/helpers/modifyQuery";
import TitleDropdown from "../../TitleDropdown";
import classes from "./ProofHeader.module.css";

type Props = {
  titles: { label: string; value: string }[];
  showReturn?: boolean;
  isDisabled?: boolean;
};

const [spotlightStore, solutionsSpotlight] = createSpotlight();

export default function ProofHeader({ showReturn, isDisabled, titles }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [spotlightActions, setSpotlightActions] = useState<SpotlightActionData[]>([]);
  const [availableTypes, setAvailableTypes] = useState<FilterItemType[]>([]);
  const [availableParts, setAvailableParts] = useState<FilterPartItemType[]>([]);
  const [relevantParts, setRelevantParts] = useState<FilterPartItemType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const type = searchParams.get("type");
  const part = searchParams.get("part");

  const handleActionClick = useCallback(
    (value: string) => {
      const newQuery = modifyQuery({ params: [{ name: "query", value, action: "replace" }] });
      router.replace(`${pathname}?${newQuery}`);
    },
    [pathname]
  );

  const onSelectType = (type?: string | null) => {
    let relevantParts: FilterPartItemType[];

    if (!type) {
      relevantParts = [];
    } else {
      relevantParts = availableParts.filter((part) => part.type === type);
    }
    setRelevantParts(relevantParts);
  };

  const getAutocompleteData = useCallback(
    async (userName?: string | string[]) => {
      const { actions } = await fetchAutocompleteData({
        endpoint: `getUsersProofAutocomplete${userName ? `/${userName}` : ""}`,
        fields: ["taskName", "concern"],
        handleActionClick,
      });

      setSpotlightActions(actions);
    },
    [pathname, type]
  );

  const handleSearch = useCallback(
    (searchQuery: string) => {
      const newQuery = modifyQuery({
        params: [{ name: "query", value: searchQuery, action: searchQuery ? "replace" : "delete" }],
      });
      router.replace(`${pathname}?${newQuery}`);
      solutionsSpotlight.close();
    },
    [pathname]
  );

  useEffect(() => {
    getAutocompleteData();
  }, []);

  useEffect(() => {
    getUsersFilters({
      collection: "proof",
      fields: ["type", "part"],
    }).then((result) => {
      const { availableTypes, availableParts } = result;
      setAvailableTypes(availableTypes);
      setAvailableParts(availableParts);

      if (type) {
        setRelevantParts(availableParts.filter((part) => part.type === type));
      }
    });
  }, []);

  const typesDisabled = isDisabled || availableTypes.length === 0;
  const partsDisabled = isDisabled || relevantParts.length === 0;

  return (
    <>
      <Group className={classes.container}>
        {showReturn && (
          <ActionIcon variant="default" onClick={() => router.back()}>
            <IconChevronLeft className="icon" />
          </ActionIcon>
        )}
        <TitleDropdown titles={titles} />
        <>
          <FilterDropdown
            data={availableTypes}
            icons={typesDisabled ? undefined : typeIcons}
            placeholder="Filter by type"
            selectedValue={type}
            filterType="type"
            onSelect={onSelectType}
            allowDeselect
            isDisabled={typesDisabled}
            addToQuery
          />
          <FilterDropdown
            data={relevantParts}
            icons={partsDisabled ? undefined : partIcons}
            placeholder="Filter by part"
            selectedValue={part}
            filterType="part"
            isDisabled={partsDisabled}
            allowDeselect
            addToQuery
          />
          <SearchButton
            onSearchClick={() => solutionsSpotlight.open()}
            isDisabled={isDisabled || spotlightActions.length === 0}
          />
        </>
      </Group>
      <Spotlight
        store={spotlightStore}
        actions={spotlightActions}
        nothingFound="Nothing found"
        onQueryChange={(query: string) => {
          if (query === "") {
            handleSearch(query);
          }
        }}
        searchProps={{
          leftSection: <IconSearch className="icon" stroke={1.5} />,
          placeholder: "Search...",
          value: searchQuery || "",
          onChange: (e: React.FormEvent<HTMLInputElement>) => setSearchQuery(e.currentTarget.value),
          onKeyDown: (e: React.KeyboardEvent) => {
            if (e.key !== "Enter") return;
            handleSearch(searchQuery || "");
          },
        }}
        clearQueryOnClose={false}
        overlayProps={{ blur: 0 }}
        limit={10}
        centered
      />
    </>
  );
}
