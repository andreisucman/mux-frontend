"use client";

import React, { use, useCallback, useContext, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IconArrowDown, IconCircleOff, IconSearch } from "@tabler/icons-react";
import { List } from "masonic";
import {
  Accordion,
  ActionIcon,
  Button,
  Group,
  Loader,
  SegmentedControl,
  Stack,
  TextInput,
} from "@mantine/core";
import OverlayWithText from "@/components/OverlayWithText";
import { UserContext } from "@/context/UserContext";
import callTheServer from "@/functions/callTheServer";
import fetchQuestions from "@/functions/fetchQuestions";
import modifyQuery from "@/helpers/modifyQuery";
import openErrorModal from "@/helpers/openErrorModal";
import ClubModerationLayout from "../../ModerationLayout";
import QuestionSlide from "../QuestionSlide";
import { AboutQuestionType, SubmitAboutResponseType } from "../types";
import classes from "./answers.module.css";

type Props = {
  params: Promise<{ userName: string }>;
};

const showTypes = [
  { value: "new", label: "New" },
  { value: "answered", label: "Answered" },
  { value: "skipped", label: "Skipped" },
];

export default function AnswersPage(props: Props) {
  const params = use(props.params);
  const { userName } = params;

  const { userDetails } = useContext(UserContext);

  const router = useRouter();
  const searchParams = useSearchParams();
  const [openValue, setOpenValue] = useState<string | null>(null);
  const [questions, setQuestions] = useState<AboutQuestionType[] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasMore, setHasMore] = useState(false);

  const { name } = userDetails || {};

  const showType = searchParams.get("showType");
  const isSelf = name === userName;

  const handleChangeSegment = useCallback(
    (newSegment: string) => {
      const query = modifyQuery({
        params: [{ name: "showType", value: newSegment, action: "replace" }],
      });
      const pathname = userName ? `/club/answers/${userName}` : `/club/answers`;
      router.replace(`${pathname}?${query}`);
    },
    [userName]
  );

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
      showType,
      searchQuery,
      skip: hasMore ? questions && questions.length : undefined,
    });

    const { questions: questionsList } = data;
    setQuestions(questionsList);
    setHasMore(questionsList.length === 21);
  }, [userName, hasMore, searchQuery, showType]);

  const handleSearch = (searchQuery: string) => {
    setSearchQuery(searchQuery);

    if (searchQuery.length % 2 === 0) {
      handleFetchQuestions();
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleFetchQuestions();
    }
  };

  useEffect(() => {
    handleFetchQuestions();
  }, [hasMore, userName]);

  const overlayText = isSelf
    ? showType === "new"
      ? "All questions answered"
      : "Nothing found"
    : "Nothing found";

  const overlayIcon = isSelf ? (
    showType === "new" ? undefined : (
      <IconCircleOff className="icon" />
    )
  ) : (
    <IconCircleOff className="icon" />
  );

  const overlayButton = (
    <Button variant="default" onClick={() => router.push(`/club/${userName}`)}>
      Return to generate bio
    </Button>
  );

  return (
    <ClubModerationLayout userName={userName} pageType="answers">
      <Stack className={classes.content}>
        {(!isSelf || showType !== "new") && (
          <Group className={classes.controlWrapper}>
            {isSelf && (
              <SegmentedControl
                data={showTypes}
                value={showType || "new"}
                onChange={handleChangeSegment}
                w="100%"
              />
            )}
            <TextInput
              placeholder="Search questions"
              w="100%"
              onChange={(e) => handleSearch(e.currentTarget.value)}
              rightSection={
                <IconSearch className="icon" onClick={() => handleSearch(searchQuery)} />
              }
              onKeyDown={onKeyDown}
            />
          </Group>
        )}
        {questions ? (
          <Stack className={classes.accordionWrapper}>
            <Accordion
              value={openValue}
              onChange={setOpenValue}
              className={classes.accordion}
              chevron={false}
              classNames={{
                root: classes.root,
                item: classes.item,
                chevron: classes.chevron,
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
                <OverlayWithText
                  text={overlayText}
                  icon={overlayIcon}
                  button={isSelf ? overlayButton : undefined}
                />
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
          </Stack>
        ) : (
          <Loader style={{ margin: "0 auto", paddingTop: "15%" }} />
        )}
      </Stack>
    </ClubModerationLayout>
  );
}
