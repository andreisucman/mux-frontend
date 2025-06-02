"use client";

import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import cn from "classnames";
import { Alert, Button, Loader, Stack, Text } from "@mantine/core";
import { SelectedConcernItemType } from "@/app/select-concerns/page";
import AnswerBox from "@/app/suggest/answer-questions/AnswerBox";
import InstructionContainer from "@/components/InstructionContainer";
import PageHeader from "@/components/PageHeader";
import { CreateRoutineSuggestionContext } from "@/context/CreateRoutineSuggestionContext";
import { RoutineSuggestionType } from "@/context/CreateRoutineSuggestionContext/types";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import checkActionAvailability from "@/helpers/checkActionAvailability";
import { useRouter } from "@/helpers/custom-router";
import { getFromLocalStorage } from "@/helpers/localStorage";
import { normalizeString } from "@/helpers/utils";
import classes from "./add-details.module.css";

export const runtime = "edge";

export default function AddDetails() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const { userDetails } = useContext(UserContext);
  const { routineSuggestion, setRoutineSuggestion } = useContext(CreateRoutineSuggestionContext);
  const [selectedConcerns, setSelectedConcerns] = useState<SelectedConcernItemType[]>();

  const part = searchParams.get("part") || "face";

  const { previousExperience, questionsAndAnswers, specialConsiderations } =
    routineSuggestion || {};
  const { _id: userId, nextRoutineSuggestion, latestConcernScores } = userDetails || {};

  const { isActionAvailable, checkBackDate } = checkActionAvailability({
    part,
    nextAction: nextRoutineSuggestion,
  });

  const handleRedirect = useCallback(
    (redirectPath: string) => {
      const query = searchParams.toString();

      let url = `${redirectPath}${query ? `?${query}` : ""}`;

      if (!isActionAvailable) {
        url = `/suggest/result${query ? `${query}` : ""}`;
      }

      router.push(url);
    },
    [searchParams.toString()]
  );

  const updateRoutineSuggestions = useCallback(
    async (
      previousExperience: { [key: string]: string },
      specialConsiderations: string,
      isCreate?: boolean
    ) => {
      if (isLoading) return;
      setIsLoading(true);

      const response = await callTheServer({
        endpoint: "updateRoutineSuggestion",
        method: "POST",
        body: { part, userId, previousExperience, specialConsiderations, isCreate },
      });

      if (response.status === 200) {
        const message = response.message;
        const query = searchParams.toString();

        setRoutineSuggestion((prev: RoutineSuggestionType) => {
          let payload = { ...prev, previousExperience };

          if (message) {
            payload = { ...payload, ...message };
          }

          return payload;
        });

        let url = `/suggest/result${query ? `?${query}` : ""}`;

        if (message && message.questionsAndAnswers) {
          url = `/suggest/answer-questions${query ? `?${query}` : ""}`;
        }

        handleRedirect(url);
      }
    },
    [router, userId, part, isLoading, questionsAndAnswers]
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
    if (!selectedConcerns) return;

    return selectedConcerns.map((co, index) => {
      const title = normalizeString(co.value || "");

      return (
        <AnswerBox
          key={index}
          title={title}
          isDisabled={!isActionAvailable}
          textObject={previousExperience || {}}
          textObjectKey={co.value}
          handleDelete={() =>
            setSelectedConcerns((prev) => prev?.filter((obj) => obj.value !== co.value))
          }
          handleType={(answer) => handleType(co.value, answer)}
        />
      );
    });
  }, [selectedConcerns, isActionAvailable, previousExperience]);

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
    if (!latestConcernScores) return;
    const exists = (item: { [key: string]: any }, key: string) =>
      latestConcernScores?.[part]?.some((obj) => obj.name === item[key] && obj.value > 0);

    const savedSelectedConcerns: SelectedConcernItemType[] | null =
      getFromLocalStorage("selectedConcerns");

    if (savedSelectedConcerns) {
      const filtered = savedSelectedConcerns.filter((item) => exists(item, "value"));
      setSelectedConcerns(filtered);
    }
  }, [part, latestConcernScores]);

  return (
    <Stack className={cn(classes.container, "smallPage")}>
      <PageHeader title="Tell your experience" />
      {selectedConcerns ? (
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
            disabled={!selectedConcerns || isLoading || allIsEmpty}
            loading={isLoading}
            onClick={() =>
              updateRoutineSuggestions(previousExperience || {}, specialConsiderations || "")
            }
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
