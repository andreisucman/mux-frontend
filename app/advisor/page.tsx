"use client";

import React, { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Stack, Title } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import AdvisorPanelButtons from "@/components/AdvisorPanelButtons";
import { CoachQuestionType } from "@/components/ChatInput/types";
import { typeItems } from "@/components/PageHeader/data";
import PageHeaderWithReturn from "@/components/PageHeaderWithReturn";
import QuestionsList from "@/components/QuestionsList";
import QuestionRow from "@/components/QuestionsList/QuestionRow";
import { useRouter } from "@/helpers/custom-router";
import { typeIcons } from "@/helpers/icons";
import { startNewChat } from "@/helpers/startNewChat";
import SkeletonWrapper from "../SkeletonWrapper";
import { questions } from "./questions";

export const runtime = "edge";

export default function Advisor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "head";

  const defaultQuestions = useMemo(
    () =>
      questions[type as "head"].map((record: CoachQuestionType) => {
        const { question, color, icon } = record;
        return {
          question,
          color,
          icon,
          type: type as string,
          onClick: () => startNewChat(router, record.question),
        };
      }),
    [type]
  );

  const freeStyleQuestion = {
    icon: "question",
    question: "Tap to ask anything",
    color: "var(--mantine-color-dark-8)",
    onClick: () => startNewChat(router),
  };

  return (
    <Stack className={`smallPage`} flex={1}>
      <SkeletonWrapper>
        <PageHeaderWithReturn
          title={"Advisor"}
          filterData={typeItems}
          icons={typeIcons}
          selectedValue={type}
          children={<AdvisorPanelButtons />}
          showReturn
        />
        <Title order={3}>Free style</Title>
        <QuestionRow
          title={freeStyleQuestion.question}
          color={freeStyleQuestion.color}
          icon={"❓"}
          onClick={freeStyleQuestion.onClick}
        />
        <QuestionsList
          type={type as string}
          questions={defaultQuestions}
          title={`${upperFirst(type as string)} questions`}
        />
      </SkeletonWrapper>
    </Stack>
  );
}
