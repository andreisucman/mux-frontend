"use client";

import React, { useEffect, useMemo, useState } from "react";
import { IconSearch } from "@tabler/icons-react";
import InfiniteScroll from "react-infinite-scroller";
import { Button, Group, Loader, Pill, rem, Stack, TextInput } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import { FilterItemType } from "@/components/FilterDropdown/types";
import PageHeader from "@/components/PageHeader";
import callTheServer from "@/functions/callTheServer";
import { useRouter } from "@/helpers/custom-router";
import { getFromLocalStorage, saveToLocalStorage } from "@/helpers/localStorage";
import AddNewContentButton from "./AddNewConcernButton";
import ConcernRow from "./ConcernRow";
import classes from "./concerns.module.css";

export const runtime = "edge";

export interface SelectedConcernItemType extends FilterItemType {
  isNew?: boolean;
}

const transformConcerns = (concernItems: { name: string }[]): FilterItemType[] => {
  const items = concernItems.map((c: { name: string }) => ({
    value: c.name,
    label: upperFirst(c.name.split("_").join(" ")),
  }));

  return items;
};

export default function ConcernsPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [noSearchResults, setNoSearchResults] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [concerns, setConcerns] = useState<SelectedConcernItemType[]>([]);
  const [selectedConcerns, setSelectedConcerns] = useState<SelectedConcernItemType[]>([]);

  const disableAdd = selectedConcerns.length >= 5;

  const handleNext = () => {
    setIsButtonLoading(true);
    router.push("/scan");
  };

  const handleSelectConcerns = async (item: FilterItemType) => {
    if (disableAdd) return;

    let newSelected = null;
    const exists = selectedConcerns.some((i) => i.value === item.value);

    if (exists) {
      newSelected = selectedConcerns.filter((i) => i.value !== item.value);
    } else {
      newSelected = [...selectedConcerns, item];
    }

    saveToLocalStorage("selectedConcerns", newSelected);
    setSelectedConcerns(newSelected);
  };

  const handleFetchConcerns = async (text?: string, skip = 0) => {
    if (disableAdd) return;

    let endpoint = "getConcerns";
    const params = new URLSearchParams();

    if (text) params.append("q", text);
    params.append("skip", skip.toString());

    if ([...params].length) endpoint += `?${params.toString()}`;

    const res = await callTheServer({ endpoint, method: "GET" });

    if (res.status === 200) {
      const items = res.message || [];
      setHasMore(items.length === 21);

      const newIncoming = transformConcerns(items.slice(0, 20));
      const newData = skip
        ? [...concerns, ...newIncoming]
        : [...concerns.filter((o) => o.isNew), ...newIncoming];

      setConcerns(newData);
      setNoSearchResults(items.length === 0);

      return newData;
    }
  };

  const handleAddNewConcern = async (newConcernName: string) => {
    const newConcern = {
      value: newConcernName.toLowerCase().split(" ").join("_"),
      label: upperFirst(newConcernName.toLowerCase()),
      isNew: true,
    };

    const newConcerns = [...selectedConcerns, newConcern];

    setConcerns(newConcerns);
    setSelectedConcerns(newConcerns);
    saveToLocalStorage("selectedConcerns", newConcerns);
  };

  const list = useMemo(() => {
    return concerns.map((item, index) => {
      const checked = selectedConcerns.some((concern) => concern.value === item.value);

      return (
        <ConcernRow
          key={index}
          item={item}
          isDisabled={disableAdd}
          handleSelectConcerns={handleSelectConcerns}
          isChecked={checked}
        />
      );
    });
  }, [concerns.length, selectedConcerns.length]);

  const selectedConcernsPills = useMemo(() => {
    const pills = selectedConcerns.map((concern, index) => (
      <Pill
        key={index}
        withRemoveButton
        onRemove={() =>
          setSelectedConcerns((prev) => prev.filter((item) => item.value !== concern.value))
        }
      >
        {upperFirst(concern.label)}
      </Pill>
    ));

    return pills;
  }, [selectedConcerns]);

  useEffect(() => {
    handleFetchConcerns().then((data) => {
      if (data) {
        const savedSelectedConcerns = getFromLocalStorage("selectedConcerns");

        if (savedSelectedConcerns) {
          setSelectedConcerns(
            (savedSelectedConcerns as FilterItemType[]).filter((item: FilterItemType) =>
              data.some((obj) => obj.value === item.value)
            ) as FilterItemType[]
          );
        }
      }
      setIsLoading(false);
    });
  }, []);

  const disableNext = isButtonLoading || !selectedConcerns.length;

  return (
    <Stack className={`${classes.container} smallPage`}>
      <PageHeader title="Select your concerns" />
      <Stack className={classes.content}>
        <TextInput
          radius="xl"
          placeholder={disableAdd ? "Max limit reached" : "Search questions"}
          rightSectionWidth={42}
          disabled={disableAdd}
          leftSection={<IconSearch size={16} stroke={1.5} />}
          onChange={(e) => {
            setQuery(e.currentTarget.value);
            handleFetchConcerns(e.currentTarget.value);
          }}
        />
        {selectedConcernsPills.length > 0 && <Group gap={12}>{selectedConcernsPills}</Group>}
        <Stack className={`${classes.listWrapper} scrollbar`}>
          {isLoading ? (
            <Loader m="auto" />
          ) : (
            <InfiniteScroll
              loader={
                <Stack mb={rem(16)} key={0}>
                  <Loader style={{ margin: "auto" }} />
                </Stack>
              }
              loadMore={() => handleFetchConcerns(query, concerns.length)}
              useWindow={false}
              hasMore={disableAdd ? false : hasMore}
              pageStart={0}
              className={classes.list}
            >
              {noSearchResults ? (
                <AddNewContentButton
                  isDisabled={disableAdd}
                  handleAddNewConcern={handleAddNewConcern}
                />
              ) : (
                list
              )}
            </InfiniteScroll>
          )}
        </Stack>
        <Button loading={isButtonLoading} disabled={disableNext} onClick={handleNext}>
          Next
        </Button>
      </Stack>
    </Stack>
  );
}
