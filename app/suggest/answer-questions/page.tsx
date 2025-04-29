"use client";

import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Alert, Button, Loader, Stack, Text } from "@mantine/core";
import InstructionContainer from "@/components/InstructionContainer";
import PageHeader from "@/components/PageHeader";
import WaitComponent from "@/components/WaitComponent";
import { CreateRoutineContext } from "@/context/CreateRoutineContext";
import { RoutineSuggestionType } from "@/context/CreateRoutineContext/types";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import checkIfAnalysisRunning from "@/functions/checkIfAnalysisRunning";
import openResetTimerModal from "@/functions/resetTimer";
import { useRouter } from "@/helpers/custom-router";
import useCheckActionAvailability from "@/helpers/useCheckActionAvailability";
import { AnalysisStatusEnum } from "@/types/global";
import AnswerBox from "./AnswerBox";
import classes from "./answer-questions.module.css";

export const runtime = "edge";

export default function AnswerQuestions() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const { userDetails, setUserDetails } = useContext(UserContext);
  const [showDisplayComponent, setShowDisplayComponent] = useState<
    "loading" | "wait" | "questions"
  >("loading");
  const routineContext = useContext(CreateRoutineContext);
  const { routineSuggestion, setRoutineSuggestion, fetchRoutineSuggestion } = routineContext;

  const questionsAndAnswers = routineSuggestion?.questionsAndAnswers;

  const { _id: userId, concerns, nextRoutineSuggestion } = userDetails || {};

  const part = searchParams.get("part") || "face";

  const { isActionAvailable, checkBackDate } = useCheckActionAvailability({
    part,
    nextAction: nextRoutineSuggestion,
  });

  const updateRoutineSuggestions = useCallback(
    async (questionsAndAnswers: { [key: string]: string }) => {
      if (isLoading) return;
      setIsLoading(true);

      const response = await callTheServer({
        endpoint: "updateRoutineSuggestion",
        method: "POST",
        body: { part, questionsAndAnswers },
      });

      if (response.status === 200) {
        setRoutineSuggestion((prev: RoutineSuggestionType) => ({ ...prev, questionsAndAnswers }));

        const stringParams = searchParams.toString();
        router.push(`/suggest/result${stringParams ? `?${stringParams}` : ""}`);
      }
    },
    [router, part, isLoading]
  );

  const handleType = (question: string, text: string) => {
    setRoutineSuggestion((prev: RoutineSuggestionType) => {
      const previousQuestionsAndAnswers = (prev || {}).questionsAndAnswers;
      return {
        ...prev,
        ["questionsAndAnswers"]: {
          ...previousQuestionsAndAnswers,
          [question]: text,
        },
      };
    });
  };

  const query = searchParams.toString();
  const handleResetTimer = useCallback(() => {
    const redirectUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}/suggest/select-concerns${query ? `?${query}` : ""}`;
    openResetTimerModal("suggestion", part, redirectUrl, setUserDetails);
  }, [query, part, setUserDetails]);

  const checkBackNotice = isActionAvailable ? undefined : (
    <Text className={classes.alert}>
      Next routine suggestion is after {new Date(checkBackDate || new Date()).toDateString()}.{" "}
      <span onClick={handleResetTimer}>Reset</span>
    </Text>
  );

  const boxes = useMemo(() => {
    if (!questionsAndAnswers) return;
    return Object.entries(questionsAndAnswers).map(([question, answer], index) => {
      return (
        <AnswerBox
          key={index}
          isDisabled={!isActionAvailable}
          textObject={questionsAndAnswers}
          textObjectKey={question}
          handleType={(answer) => handleType(question, answer)}
        />
      );
    });
  }, [concerns, isActionAvailable, part, questionsAndAnswers]);

  useEffect(() => {
    if (!userId || !routineSuggestion) return;

    checkIfAnalysisRunning({
      userId,
      operationKey: AnalysisStatusEnum.ROUTINE_SUGGESTION,
      setShowWaitComponent: (verdict?: boolean) => {
        if (!verdict) {
          if (!questionsAndAnswers) {
            router.replace(`/suggest/select-concerns${query ? `?${query}` : ""}`);
            return;
          }
        }
        setShowDisplayComponent(verdict ? "wait" : "questions");
      },
    });
  }, [userId, routineSuggestion]);

  return (
    <Stack className={`${classes.container} smallPage`}>
      <PageHeader title="Answer questions" />
      {showDisplayComponent === "loading" && (
        <Loader
          m="0 auto"
          mt="30%"
          color="light-dark(var(--mantine-color-gray-4), var(--mantine-color-dark-4))"
        />
      )}
      {showDisplayComponent === "wait" && (
        <WaitComponent
          operationKey={AnalysisStatusEnum.ROUTINE_SUGGESTION}
          description="Creating questions for you"
          onComplete={() => {
            fetchRoutineSuggestion().finally(() => setShowDisplayComponent("questions"));
          }}
          errorRedirectUrl={`/suggest/select-concerns${query ? `?${query}` : ""}`}
          customContainerStyles={{ paddingBottom: "20%" }}
        />
      )}
      {showDisplayComponent === "questions" && (
        <>
          {checkBackNotice && <Alert p="0.5rem 1rem">{checkBackNotice}</Alert>}
          <InstructionContainer
            title="Description"
            instruction={
              "Answer these questions to clarify some important details to make your routine more effective."
            }
            customStyles={{ flex: 0 }}
          />
          {boxes}
          <Button
            onClick={() => updateRoutineSuggestions(questionsAndAnswers || {})}
            loading={isLoading}
            disabled={isLoading}
            mb={"20%"}
            className={classes.button}
          >
            Next
          </Button>
        </>
      )}
    </Stack>
  );
}
