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
import useCheckActionAvailability from "@/helpers/useCheckActionAvailability";
import { normalizeString } from "@/helpers/utils";
import AnswerBox from "../answer-questions/AnswerBox";
import classes from "./add-details.module.css";

export const runtime = "edge";

export default function AddDetails() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const { userDetails } = useContext(UserContext);
  const { routineSuggestion, setRoutineSuggestion } = useContext(CreateRoutineSuggestionContext);

  const part = searchParams.get("part") || "face";

  const { previousExperience, concernScores, specialConsiderations } = routineSuggestion || {};
  const { nextRoutineSuggestion } = userDetails || {};

  const { isActionAvailable, checkBackDate } = useCheckActionAvailability({
    part,
    nextAction: nextRoutineSuggestion,
  });

  const updateRoutineSuggestions = useCallback(
    async (previousExperience: { [key: string]: string }, specialConsiderations: string) => {
      if (isLoading) return;
      setIsLoading(true);

      const response = await callTheServer({
        endpoint: "updateRoutineSuggestion",
        method: "POST",
        body: { part, previousExperience, specialConsiderations },
      });

      if (response.status === 200) {
        setRoutineSuggestion((prev: RoutineSuggestionType) => ({ ...prev, previousExperience }));

        const stringParams = searchParams.toString();
        router.push(`/suggest/answer-questions${stringParams ? `?${stringParams}` : ""}`);
      }
    },
    [router, part, isLoading]
  );

  const handleType = (concern: string, text: string) => {
    setRoutineSuggestion((prev: RoutineSuggestionType) => {
      const previousExperience = (prev || {}).previousExperience;
      return {
        ...prev,
        ["previousExperience"]: {
          ...previousExperience,
          [concern]: text,
        },
      };
    });
  };

  const handleAddSpecialConsideration = (text: string) => {
    setRoutineSuggestion((prev: RoutineSuggestionType) => {
      return {
        ...prev,
        specialConsiderations: text,
      };
    });
  };

  const boxes = useMemo(() => {
    if (!concernScores) return;

    return concernScores.map((co, index) => {
      const title = normalizeString(co.name || "");

      return (
        <AnswerBox
          key={index}
          title={title}
          isDisabled={!isActionAvailable}
          textObject={previousExperience || {}}
          textObjectKey={co.name}
          handleType={(answer) => handleType(co.name, answer)}
        />
      );
    });
  }, [concernScores, isActionAvailable, previousExperience]);

  const query = searchParams.toString();

  const checkBackNotice = isActionAvailable ? undefined : (
    <Text className={classes.alert}>
      The next {part} routine suggestion is after{" "}
      {new Date(checkBackDate || new Date()).toDateString()}.{" "}
    </Text>
  );

  const allIsEmpty =
    Object.values(previousExperience || {})
      .map((str) => str.trim())
      .filter(Boolean).length === 0 && !specialConsiderations?.trim();

  useEffect(() => {
    if (!routineSuggestion) return;
    if (!concernScores) router.replace(`/suggest/select-concerns${query ? `?${query}` : ""}`);
  }, [concernScores, routineSuggestion]);

  return (
    <Stack className={cn(classes.container, "smallPage")}>
      <PageHeader title="Tell your experience" />
      {concernScores ? (
        <>
          {checkBackNotice && <Alert p="0.5rem 1rem">{checkBackNotice}</Alert>}
          <InstructionContainer
            title="Description"
            instruction={
              "Describe what you have already tried and what were the results. This will help avoid ineffective solutions and include more promising tasks for you."
            }
            customStyles={{ flex: 0 }}
          />
          {boxes}
          <AnswerBox
            isDisabled={!isActionAvailable}
            textObject={routineSuggestion || {}}
            title="Special considerations"
            textObjectKey={"specialConsiderations"}
            placeholder="Anything special about your health or lifestyle? (e.g. pregnancy, vegetarianism, medication, allergies etc...)"
            handleType={(text) => handleAddSpecialConsideration(text)}
          />
          <Button
            disabled={!concernScores || isLoading || allIsEmpty}
            loading={isLoading}
            onClick={() => updateRoutineSuggestions(previousExperience || {}, specialConsiderations || "")}
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
