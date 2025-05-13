"use client";

import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import cn from "classnames";
import { Alert, Button, Loader, Stack, Text } from "@mantine/core";
import InstructionContainer from "@/components/InstructionContainer";
import PageHeader from "@/components/PageHeader";
import { CreateRoutineSuggestionContext } from "@/context/CreateRoutineSuggestionContext";
import { RoutineSuggestionType } from "@/context/CreateRoutineSuggestionContext/types";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import { useRouter } from "@/helpers/custom-router";
import { getFromLocalStorage, saveToLocalStorage } from "@/helpers/localStorage";
import useCheckActionAvailability from "@/helpers/useCheckActionAvailability";
import { ScoreType } from "@/types/global";
import ScoreDisplayRow from "./ScoreDisplayRow";
import classes from "./select-concerns.module.css";

export const runtime = "edge";

export default function SuggestSelectConcerns() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedConcerns, setSelectedConcerns] = useState<ScoreType[]>([]);
  const { userDetails } = useContext(UserContext);
  const { routineSuggestion, setRoutineSuggestion } = useContext(CreateRoutineSuggestionContext);

  const part = searchParams.get("part") || "face";

  const { concerns, latestConcernScores, nextRoutineSuggestion } = userDetails || {};

  const { isActionAvailable, checkBackDate } = useCheckActionAvailability({
    part,
    nextAction: nextRoutineSuggestion,
  });

  const updateRoutineSuggestions = useCallback(
    async (concernScores: ScoreType[]) => {
      if (isLoading) return;
      setIsLoading(true);

      const response = await callTheServer({
        endpoint: "updateRoutineSuggestion",
        method: "POST",
        body: { part, concernScores },
      });

      if (response.status === 200) {
        setRoutineSuggestion((prev: RoutineSuggestionType) => ({ ...prev, concernScores }));

        const stringParams = searchParams.toString();
        router.push(`/suggest/add-details${stringParams ? `?${stringParams}` : ""}`);
      }
    },
    [router, part, routineSuggestion, isLoading]
  );

  const handleSelectConcerns = async (item: ScoreType) => {
    let newSelected = null;
    const exists = selectedConcerns.some((i) => i.name === item.name);

    if (exists) {
      newSelected = selectedConcerns.filter((i) => i.name !== item.name);
    } else {
      if (!isActionAvailable) return;
      newSelected = [...selectedConcerns, item];
    }

    saveToLocalStorage("selectedRoutineConcerns", newSelected);
    setSelectedConcerns(newSelected);
  };

  const rows = useMemo(() => {
    if (!latestConcernScores) return;

    const relevantScores = latestConcernScores[part];

    return relevantScores.map((cso, i) => {
      const isSelected = selectedConcerns?.some((co) => co.name === cso.name);

      return (
        <ScoreDisplayRow
          key={i}
          item={cso}
          isChecked={!!isSelected}
          handleSelectConcerns={handleSelectConcerns}
          isDisabled={!isActionAvailable}
        />
      );
    });
  }, [
    handleSelectConcerns,
    selectedConcerns,
    routineSuggestion,
    isActionAvailable,
    latestConcernScores?.[part],
  ]);

  const checkBackNotice = isActionAvailable ? undefined : (
    <Text className={classes.alert}>
      The next {part} routine suggestion is after{" "}
      {new Date(checkBackDate || new Date()).toDateString()}.{" "}
    </Text>
  );

  useEffect(() => {
    if (!latestConcernScores) return;
    const exists = (item: { [key: string]: any }, key: string) =>
      latestConcernScores[part].some((obj) => obj.name === item[key]);

    const savedSelectedConcerns: ScoreType[] | null =
      getFromLocalStorage("selectedRoutineConcerns");

    if (savedSelectedConcerns)
      setSelectedConcerns(savedSelectedConcerns.filter((item) => exists(item, "name")));
  }, [part, latestConcernScores]);

  return (
    <Stack className={cn(classes.container, "smallPage")}>
      <PageHeader title="Select concerns" />
      {concerns ? (
        <>
          {checkBackNotice && <Alert p="0.5rem 1rem">{checkBackNotice}</Alert>}
          <InstructionContainer
            title="Description"
            instruction={"Select the concerns for your next routine"}
            customStyles={{ flex: 0 }}
          />
          {rows}
          <Button
            disabled={!concerns || isLoading}
            loading={isLoading}
            onClick={() => updateRoutineSuggestions(selectedConcerns || [])}
            mb={"20%"}
            className={classes.button}
          >
            Next
          </Button>
        </>
      ) : (
        <Loader
          m="0 auto"
          mt="30%"
          color="light-dark(var(--mantine-color-gray-4), var(--mantine-color-dark-4))"
        />
      )}
    </Stack>
  );
}
