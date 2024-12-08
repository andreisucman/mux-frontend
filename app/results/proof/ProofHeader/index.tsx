import React, { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IconChevronLeft, IconSearch } from "@tabler/icons-react";
import { ActionIcon, Group } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import { createSpotlight, Spotlight, SpotlightActionData } from "@mantine/spotlight";
import FilterDropdown from "@/components/FilterDropdown";
import { FilterItemType } from "@/components/FilterDropdown/types";
import { partIcons, partItems, typeIcons, typeItems } from "@/components/PageHeader/data";
import SearchButton from "@/components/SearchButton";
import fetchAutocompleteData from "@/functions/fetchAutocompleteData";
import getUsersFilters from "@/functions/getUsersFilters";
import modifyQuery from "@/helpers/modifyQuery";
import TitleDropdown from "../../TitleDropdown";
import classes from "./ProofHeader.module.css";

type FilterDataType = {
  icons: { [key: string]: React.ReactNode | undefined };
  items: FilterItemType[];
};

type Props = {
  titles: { label: string; value: string }[];
  showReturn?: boolean;
};

const [spotlightStore, solutionsSpotlight] = createSpotlight();

export default function ProofHeader({ showReturn, titles }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { width, ref } = useElementSize();
  const [spotlightActions, setSpotlightActions] = useState<SpotlightActionData[]>([]);
  const [typeFilterData, setTypeFilterData] = useState<FilterDataType>({ icons: {}, items: [] });
  const [partFilterData, setPartFilterData] = useState<FilterDataType>({ icons: {}, items: [] });
  const [rawAutocompleteData, setRawAutocompleteData] = useState<{ [key: string]: any }[]>();

  const type = searchParams.get("type") || "head";
  const part = searchParams.get("part");
  const followingUserId = searchParams.get("followingUserId");

  const handleActionClick = useCallback(
    (value: string) => {
      const newQuery = modifyQuery({ params: [{ name: "query", value, action: "replace" }] });
      router.replace(`${pathname}?${newQuery}`);
    },
    [pathname]
  );

  const handleUpdatePartsFilterData = useCallback(
    (selectedType: string | null, data: { [key: string]: any }[]) => {
      if (!selectedType) return;
      const filteredParts = data.filter((record) => record.type === selectedType);
      const uniqueParts = Array.from(
        new Set(filteredParts.map((record) => record.part).filter(Boolean))
      );

      setPartFilterData({
        icons: Object.keys(partIcons).reduce(
          (a: { [key: string]: React.ReactNode }, c: string) => ((a[c] = typeIcons[c]), a),
          {}
        ),
        items: uniqueParts.reduce((a: FilterItemType[], c: string) => {
          const relevantPart = partItems.find((item) => item.value === c);
          if (relevantPart) a.push(relevantPart);
          return a;
        }, []),
      });
    },
    []
  );

  const getAutocompleteData = useCallback(
    async (followingUserId: string | null) => {
      const { data, actions } = await fetchAutocompleteData({
        endpoint: `getUsersProofAutocomplete${followingUserId ? `/${followingUserId}` : ""}`,
        fields: ["taskName", "concern", "part", "type"],
        handleActionClick,
      });

      setRawAutocompleteData(data);
      setSpotlightActions(actions);

      console.log("data", data);
      console.log("actions", actions);

      const uniqueTypes = Array.from(new Set(data.map((record) => record.type).filter(Boolean)));

      setTypeFilterData({
        icons: Object.keys(typeIcons).reduce(
          (a: { [key: string]: React.ReactNode }, c: string) => ((a[c] = typeIcons[c]), a),
          {}
        ),
        items: uniqueTypes.reduce((a, c) => a.push(typeItems.find((item) => item.value === c)), []),
      });

      const selectedType = type || uniqueTypes[0];

      handleUpdatePartsFilterData(selectedType, data);
    },
    [pathname, type]
  );

  useEffect(() => {
    getAutocompleteData(followingUserId);
  }, [followingUserId]);

  useEffect(() => {
    if (!rawAutocompleteData) return;
    const selectedType = type || typeFilterData.items[0].value;
    if (!selectedType) return;

    handleUpdatePartsFilterData(selectedType, rawAutocompleteData);
  }, [type]);

  return (
    <>
      <Group className={classes.container}>
        <Group className={classes.left}>
          {showReturn && (
            <ActionIcon variant="default" onClick={() => router.back()}>
              <IconChevronLeft className="icon" />
            </ActionIcon>
          )}
          <TitleDropdown titles={titles} />
        </Group>
        <Group className={classes.right} ref={ref}>
          <SearchButton maxPillWidth={width / 2} onSearchClick={() => solutionsSpotlight.open()} />
          {typeFilterData.items.length > 1 && (
            <FilterDropdown
              data={typeFilterData.items}
              icons={typeFilterData.icons}
              placeholder="Select type"
              defaultSelected={typeFilterData.items.find((obj) => obj.value === type)?.value}
              filterType="type"
              addToQuery
            />
          )}
          {partFilterData.items.length > 1 && (
            <FilterDropdown
              data={partFilterData.items}
              icons={partFilterData.icons}
              placeholder="Select part"
              defaultSelected={partFilterData.items.find((obj) => obj.value === part)?.value}
              filterType="part"
              addToQuery
            />
          )}
        </Group>
      </Group>
      <Spotlight
        store={spotlightStore}
        actions={spotlightActions}
        nothingFound="Nothing found"
        searchProps={{
          leftSection: <IconSearch className="icon" stroke={1.5} />,
          placeholder: "Search...",
        }}
        highlightQuery
        overlayProps={{ blur: 0 }}
        limit={10}
      />
    </>
  );
}
