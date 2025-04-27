"use client";

import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
import useCheckActionAvailability from "@/helpers/useCheckActionAvailability";
import { AnalysisStatusEnum } from "@/types/global";
import AnswerBox from "./AnswerBox";
import classes from "./answer-questions.module.css";

export const runtime = "edge";

export default function AnswerQuestions() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const { userDetails } = useContext(UserContext);
  const [showDisplayComponent, setShowDisplayComponent] = useState<
    "loading" | "wait" | "questions"
  >("loading");
  const { setUserDetails } = useContext(UserContext);
  const { routineSuggestion, setRoutineSuggestion, fetchRoutineSuggestion } =
    useContext(CreateRoutineContext);

  const questionsAndAnswers = routineSuggestion?.questionsAndAnswers;

  const { _id: userId, concerns, nextRoutineSuggestion } = userDetails || {};

  const part = searchParams.get("part") || "face";

  const { isScanAvailable, checkBackDate } = useCheckActionAvailability({
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
    [router, isLoading]
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
    const redirectUrl = `${process.env.NEXT_PUBLIC_CLIENT_URL}${pathname}${query ? `?${query}` : ""}`;
    openResetTimerModal("suggestion", part, redirectUrl, setUserDetails);
  }, [query, part, setUserDetails]);

  const checkBackNotice = isScanAvailable ? undefined : (
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
          isDisabled={!isScanAvailable}
          textObject={questionsAndAnswers}
          textObjectKey={question}
          handleType={(answer) => handleType(question, answer)}
        />
      );
    });
  }, [concerns, isScanAvailable, part, questionsAndAnswers]);

  useEffect(() => {
    if (!userId) return;

    checkIfAnalysisRunning({
      userId,
      operationKey: AnalysisStatusEnum.ROUTINE_SUGGESTION,
      setShowWaitComponent: () => setShowDisplayComponent("wait"),
    });
  }, [userId]);

  useEffect(() => {
    if (!questionsAndAnswers) return;

    const questionAndANswersExist = Object.entries(questionsAndAnswers).length > 0;
    if (questionAndANswersExist) {
      setShowDisplayComponent("questions");
    }
  }, [questionsAndAnswers]);

  return (
    <Stack className={`${classes.container} smallPage`}>
      <PageHeader title="Additional questions" />
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
          errorRedirectUrl={`/create?part=${part}`}
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
            mb={"25%"}
            className={classes.button}
          >
            Next
          </Button>
        </>
      )}
    </Stack>
  );
}
