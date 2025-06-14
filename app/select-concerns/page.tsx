"use client";

import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IconCircleOff, IconSearch } from "@tabler/icons-react";
import cn from "classnames";
import InfiniteScroll from "react-infinite-scroller";
import { Alert, Button, Group, Loader, Pill, rem, Stack, TextInput } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import { FilterItemType } from "@/components/FilterDropdown/types";
import OverlayWithText from "@/components/OverlayWithText";
import PageHeader from "@/components/PageHeader";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import checkActionAvailability from "@/helpers/checkActionAvailability";
import {
  deleteFromLocalStorage,
  getFromLocalStorage,
  saveToLocalStorage,
} from "@/helpers/localStorage";
import { normalizeString } from "@/helpers/utils";
import { PartEnum, UserConcernType } from "@/types/global";
import ConcernRow from "./ConcernRow";
import NextNoConcernsButton from "./NextNoConcernsButton";
import classes from "./select-concerns.module.css";

export const runtime = "edge";

export interface SelectedConcernItemType extends FilterItemType {
  part: PartEnum;
}

const transformConcerns = (concernItems: { name: string }[]): FilterItemType[] => {
  const items = concernItems.map((c: { name: string }) => ({
    value: c.name,
    label: upperFirst(c.name.split("_").join(" ")),
  }));

  return items;
};

export default function SelectConcernsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status, userDetails } = useContext(UserContext);
  const [query, setQuery] = useState("");
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [noSearchResults, setNoSearchResults] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [concerns, setConcerns] = useState<FilterItemType[]>([]);
  const [selectedConcerns, setSelectedConcerns] = useState<SelectedConcernItemType[]>([]);
  const [nextNoConcern, setNextNoConcern] = useState(false);

  const { nextScan } = userDetails || {};

  const disableAdd = nextNoConcern || selectedConcerns.length >= 5;
  const part = searchParams.get("part") || "face";

  const handleRedirect = useCallback(() => {
    setIsButtonLoading(true);

    const { isActionAvailable } = checkActionAvailability({
      part,
      nextAction: nextScan,
    });

    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("part", part);
    const query = newSearchParams.toString();
    let url = `/scan${query ? `?${query}` : ""}`;

    if (isActionAvailable) {
      if (status !== "authenticated") {
        url = `/accept?redirectUrl=${encodeURIComponent(url)}`;
      }
    } else {
      url = `/analysis${query ? `?${query}` : ""}`;
    }
    router.push(url);
  }, [status, userDetails]);

  const handleSelectConcerns = async (item: FilterItemType) => {
    let newSelected = null;
    const exists = selectedConcerns.some((i) => i.value === item.value);

    if (exists) {
      newSelected = selectedConcerns.filter((i) => i.value !== item.value);
    } else {
      if (disableAdd) return;
      newSelected = [...selectedConcerns, item];
    }

    const selectedWithPart = newSelected.map((i) => ({ ...i, part: part as PartEnum }));

    saveToLocalStorage("selectedConcerns", selectedWithPart);
    setSelectedConcerns(selectedWithPart);
  };

  const handleFetchConcerns = async (text?: string, skip = 0) => {
    let endpoint = "getConcerns";
    const params = new URLSearchParams();

    if (part) params.append("part", part);
    if (text) params.append("q", text);
    params.append("skip", skip.toString());

    if ([...params].length) endpoint += `?${params.toString()}`;

    const res = await callTheServer({ endpoint, method: "GET" });

    if (res.status === 200) {
      const items = res.message || [];
      setHasMore(items.length === 21);

      const newIncoming = transformConcerns(items.slice(0, 20));
      const newData = skip ? [...concerns, ...newIncoming] : newIncoming;

      setConcerns(newData);
      setNoSearchResults(items.length === 0);

      return newData;
    }
  };

  const handleSetNextNoConcern = () => {
    setNextNoConcern((prev) => {
      if (!prev) {
        deleteFromLocalStorage("selectedConcerns");
        setSelectedConcerns([]);
      }

      return !prev;
    });
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
  }, [disableAdd, concerns, selectedConcerns.length]);

  const selectedConcernsPills = useMemo(() => {
    const pills = selectedConcerns.map((concern, index) => (
      <Pill key={index} withRemoveButton onRemove={() => handleSelectConcerns(concern)}>
        {upperFirst(concern.label)}
      </Pill>
    ));

    return pills;
  }, [selectedConcerns, handleSelectConcerns]);

  useEffect(() => {
    handleFetchConcerns().then((data) => {
      if (data) {
        const exists = (item: { [key: string]: any }, key: string) =>
          data.some((obj) => obj.value === item[key]);

        const { concerns: userConcerns } = userDetails || {};

        if (userConcerns && userConcerns.length > 0) {
          const filtered = (userConcerns as UserConcernType[]).filter((item) =>
            exists(item, "name")
          );
          const transformed = filtered.map((item) => ({
            label: normalizeString(item.name),
            value: item.name,
            part: item.part,
          }));
          setSelectedConcerns(transformed);
        } else {
          const savedSelectedConcerns: SelectedConcernItemType[] | null =
            getFromLocalStorage("selectedConcerns");
          if (savedSelectedConcerns) {
            setSelectedConcerns(savedSelectedConcerns.filter((item) => exists(item, "value")));
          }
        }
      }
      setIsLoading(false);
    });
  }, [part]);

  const disableNext = !nextNoConcern && (isButtonLoading || !selectedConcerns.length);

  return (
    <Stack className={cn(classes.container, "smallPage")}>
      <PageHeader title="Select concerns" />
      <Stack className={classes.content}>
        <Alert p={"0.5rem 1rem"}>What concern are you targeting?</Alert>
        <TextInput
          radius="xl"
          placeholder={"Search concerns"}
          rightSectionWidth={42}
          disabled={disableAdd}
          leftSection={<IconSearch size={16} stroke={1.5} />}
          onChange={(e) => {
            setQuery(e.currentTarget.value);
            handleFetchConcerns(e.currentTarget.value);
          }}
        />
        {selectedConcernsPills.length > 0 && <Group gap={12}>{selectedConcernsPills}</Group>}
        <NextNoConcernsButton
          nextNoConcern={nextNoConcern}
          toggleNoConcern={handleSetNextNoConcern}
        />
        <Stack className={cn(classes.listWrapper, "scrollbar")}>
          {isLoading ? (
            <Stack>
              <Loader
                m="0 auto"
                pt="20%"
                color="light-dark(var(--mantine-color-gray-4), var(--mantine-color-dark-4))"
              />
            </Stack>
          ) : (
            <InfiniteScroll
              loader={
                <Stack mb={rem(16)} key={0}>
                  <Loader
                    m="auto"
                    color="light-dark(var(--mantine-color-gray-4), var(--mantine-color-dark-4))"
                  />
                </Stack>
              }
              loadMore={() => handleFetchConcerns(query, concerns.length)}
              useWindow={false}
              hasMore={disableAdd ? false : hasMore}
              pageStart={0}
              className={classes.list}
            >
              {noSearchResults ? (
                <OverlayWithText icon={<IconCircleOff size={16} />} text="Nothing found" />
              ) : (
                list
              )}
            </InfiniteScroll>
          )}
        </Stack>
        <Button
          className={classes.button}
          loading={isButtonLoading}
          disabled={disableNext}
          onClick={handleRedirect}
        >
          Next
        </Button>
      </Stack>
    </Stack>
  );
}
