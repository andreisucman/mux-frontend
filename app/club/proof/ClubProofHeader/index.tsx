import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { IconChevronLeft, IconSearch } from "@tabler/icons-react";
import { ActionIcon, Group, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { createSpotlight, Spotlight, SpotlightActionData } from "@mantine/spotlight";
import TitleDropdown from "@/app/results/TitleDropdown";
import FilterButton from "@/components/FilterButton";
import FilterDropdown from "@/components/FilterDropdown";
import SearchButton from "@/components/SearchButton";
import fetchAutocompleteData from "@/functions/fetchAutocompleteData";
import { pageTypeIcons } from "@/helpers/icons";
import modifyQuery from "@/helpers/modifyQuery";
import ClubProofFilterCardContent from "./ClubProofFilterCardContent";
import classes from "./ProofHeader.module.css";

type Props = {
  titles: { label: string; value: string }[];
  showReturn?: boolean;
  isDisabled?: boolean;
};

const clubPageTypeItems: { label: string; value: string }[] = [
  { label: "About", value: "/club/about" },
  { label: "Routines", value: "/club/routines" },
  {
    label: "Results",
    value: "/club/proof",
  },
];

const [spotlightStore, solutionsSpotlight] = createSpotlight();

export default function ClubProofHeader({ showReturn, isDisabled, titles }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { userName } = useParams();
  const searchParams = useSearchParams();
  const [spotlightActions, setSpotlightActions] = useState<SpotlightActionData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const paramsCount = useMemo(() => {
    const allParams = Array.from(searchParams.keys());
    const requiredParams = allParams.filter((param) => ["type", "part"].includes(param));
    return requiredParams.length;
  }, [searchParams.toString()]);

  const handleActionClick = useCallback(
    (value: string) => {
      const newQuery = modifyQuery({ params: [{ name: "query", value, action: "replace" }] });
      router.replace(`${pathname}?${newQuery}`);
    },
    [pathname]
  );

  const getAutocompleteData = useCallback(async (userName?: string | string[]) => {
    const { actions } = await fetchAutocompleteData({
      endpoint: `getUsersProofAutocomplete${userName ? `/${userName}` : ""}`,
      fields: ["taskName", "concern"],
      handleActionClick,
    });

    setSpotlightActions(actions);
  }, []);

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

  const handleRedirect = useCallback(
    (value?: string | null) => {
      if (!value) return;

      router.push(`${value}?${searchParams.toString()}`);
    },
    [searchParams.toString()]
  );

  const openFiltersCard = useCallback(() => {
    modals.openContextModal({
      modal: "general",
      title: (
        <Title order={5} component="p">
          Filters
        </Title>
      ),
      centered: true,
      innerProps: <ClubProofFilterCardContent />,
    });
  }, []);

  useEffect(() => {
    getAutocompleteData(userName);
  }, [userName]);

  return (
    <>
      <Group className={classes.container}>
        {showReturn && (
          <ActionIcon variant="default" onClick={() => router.back()}>
            <IconChevronLeft className="icon" />
          </ActionIcon>
        )}
        <TitleDropdown titles={titles} />
        <FilterButton
          activeFiltersCount={paramsCount}
          onFilterClick={openFiltersCard}
          isDisabled={isDisabled}
        />
        <SearchButton
          onSearchClick={() => solutionsSpotlight.open()}
          isDisabled={isDisabled || spotlightActions.length === 0}
        />
        <FilterDropdown
          icons={pageTypeIcons}
          data={clubPageTypeItems}
          selectedValue={clubPageTypeItems.find((item) => item.value === pathname)?.value}
          onSelect={handleRedirect}
          placeholder="Select page"
          filterType="page"
        />
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
