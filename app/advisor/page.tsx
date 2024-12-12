"use client";

import React, { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { rem, Stack, Title } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import PageHeader from "@/components/PageHeader";
import { typeItems } from "@/components/PageHeader/data";
import PageHeaderWithReturn from "@/components/PageHeaderWithReturn";
import { useRouter } from "@/helpers/custom-router";
import { typeIcons } from "@/helpers/icons";
import modifyQuery from "@/helpers/modifyQuery";
import SkeletonWrapper from "../SkeletonWrapper";
import ChatMessagesButton from "./ConversationHistoryButton";
import { questions } from "./questions";
import QuestionsList from "./QuestionsList";
import QuestionRow from "./QuestionsList/QuestionRow";
import { CoachQuestionType } from "./types";
import classes from "./advisor.module.css";

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
          onClick: () => {
            const query = modifyQuery({
              params: [{ name: "query", value: record.question, action: "replace" }],
            });
            router.push(`/advisor/chat?${query}`);
          },
        };
      }),
    [type]
  );

  const freeStyleQuestion = {
    icon: "question",
    question: "Tap to ask anything",
    color: "var(--mantine-color-dark-8)",
    onClick: () => {
      const query = modifyQuery({
        params: [{ name: "query", value: null, action: "delete" }],
      });
      router.push(`/advisor/chat?${query}`);
    },
  };

  return (
    <Stack className={`${classes.container} smallPage`}>
      <SkeletonWrapper>
        <PageHeaderWithReturn
          title={"Advisor"}
          filterData={typeItems}
          icons={typeIcons}
          children={<ChatMessagesButton />}
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
