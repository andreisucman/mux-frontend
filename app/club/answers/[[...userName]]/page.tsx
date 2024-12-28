"use client";

import React, { use, useCallback, useEffect, useState } from "react";
import { IconArrowDown, IconCircleOff } from "@tabler/icons-react";
import { List } from "masonic";
import { Accordion, ActionIcon, Loader, Stack } from "@mantine/core";
import OverlayWithText from "@/components/OverlayWithText";
import callTheServer from "@/functions/callTheServer";
import fetchQuestions from "@/functions/fetchQuestions";
import openErrorModal from "@/helpers/openErrorModal";
import ClubModerationLayout from "../../ModerationLayout";
import QuestionSlide from "../QuestionSlide";
import { AboutQuestionType, SubmitAboutResponseType } from "../types";
import classes from "./answers.module.css";

type Props = {
  params: Promise<{ userName: string }>;
};

export default function AnswersPage(props: Props) {
  const params = use(props.params);
  const { userName } = params;

  const [openValue, setOpenValue] = useState<string | null>(null);
  const [questions, setQuestions] = useState<AboutQuestionType[] | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const submitResponse = useCallback(
    async ({ question, answer, setIsLoading }: SubmitAboutResponseType) => {
      if (!question || !answer) return;

      try {
        setIsLoading(true);

        const payload: Partial<AboutQuestionType> = { question, answer };

        await callTheServer({
          endpoint: "saveAboutResponse",
          method: "POST",
          body: payload,
        });

        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        console.log("Error in submitResponse: ", err);
      }
    },
    []
  );

  const skipQuestion = useCallback(async (questionId: string) => {
    let success = false;
    if (!questionId) return success;

    try {
      const response = await callTheServer({
        endpoint: "skipAboutQuestion",
        method: "POST",
        body: { questionId },
      });
      if (response.status === 200) {
        success = true;
      } else {
        openErrorModal();
        success = false;
      }
    } catch (err) {
      openErrorModal();
      console.log("Error in submitResponse: ", err);
    } finally {
      return success;
    }
  }, []);

  const memoizedQuestionsRow = useCallback(
    (props: any) => {
      return (
        <QuestionSlide
          key={props.index}
          submitResponse={submitResponse}
          skipQuestion={skipQuestion}
          data={props.data}
        />
      );
    },
    [questions]
  );

  const handleFetchQuestions = useCallback(async () => {
    const data = await fetchQuestions({
      userName,
      skip: hasMore ? questions && questions.length : undefined,
    });

    const { questions: questionsList } = data;
    setQuestions(questionsList);
    setHasMore(questionsList.length === 21);
  }, [userName, hasMore]);

  useEffect(() => {
    handleFetchQuestions();
  }, [hasMore, userName]);

  return (
    <ClubModerationLayout userName={userName} pageType="answers">
      <Stack className={classes.content}>
        {questions ? (
          <>
            <Accordion
              value={openValue}
              onChange={setOpenValue}
              className={classes.accordion}
              classNames={{
                root: classes.root,
                item: classes.item,
                control: classes.control,
                content: classes.accordionContent,
              }}
            >
              {questions.length > 0 ? (
                <List
                  items={questions}
                  rowGutter={16}
                  render={memoizedQuestionsRow}
                  className={classes.list}
                />
              ) : (
                <OverlayWithText text={"Nothing found"} icon={<IconCircleOff className="icon" />} />
              )}
            </Accordion>
            {hasMore && (
              <ActionIcon
                variant="default"
                className={classes.getMoreButton}
                onClick={handleFetchQuestions}
              >
                <IconArrowDown />
              </ActionIcon>
            )}
          </>
        ) : (
          <Loader style={{ margin: "0 auto", paddingTop: "15%" }} />
        )}
      </Stack>
    </ClubModerationLayout>
  );
}
