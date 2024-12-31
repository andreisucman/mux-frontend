"use client";

import React, { use, useCallback, useContext, useEffect, useState } from "react";
import { useRouter as useDefaultRouter, useSearchParams } from "next/navigation";
import { IconArrowDown, IconCheckbox, IconCircleOff, IconSearch } from "@tabler/icons-react";
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
import ListComponent from "@/components/ListComponent";
import OverlayWithText from "@/components/OverlayWithText";
import { UserContext } from "@/context/UserContext";
import { AuthStateEnum } from "@/context/UserContext/types";
import callTheServer from "@/functions/callTheServer";
import fetchQuestions from "@/functions/fetchQuestions";
import { useRouter } from "@/helpers/custom-router";
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
  const userName = params?.userName?.[0];

  const { status, userDetails } = useContext(UserContext);

  const router = useRouter();
  const defaultRouter = useDefaultRouter();
  const searchParams = useSearchParams();
  const [openValue, setOpenValue] = useState<string | null>(null);
  const [questions, setQuestions] = useState<AboutQuestionType[] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasMore, setHasMore] = useState(false);

  const { name } = userDetails || {};

  const isSelf = name === userName;
  const showType = searchParams.get("showType") || (isSelf ? "new" : "answered");

  const handleChangeSegment = useCallback(
    (newSegment: string) => {
      const query = modifyQuery({
        params: [{ name: "showType", value: newSegment, action: "replace" }],
      });
      const pathname = userName ? `/club/answers/${userName}` : `/club/answers`;
      defaultRouter.replace(`${pathname}?${query}`);
      setQuestions(null);
    },
    [userName]
  );

  const submitResponse = useCallback(
    async ({ questionId, answer, setIsLoading }: SubmitAboutResponseType) => {
      if (!questions || !answer) return;

      try {
        setIsLoading(true);

        const payload = { questionId, answer };

        const response = await callTheServer({
          endpoint: "saveAboutResponse",
          method: "POST",
          body: payload,
        });

        if (response.status === 200) {
          const newQuestions = questions.filter((q) => q._id !== questionId);
          setQuestions(newQuestions);
        }

        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
      }
    },
    [questions]
  );

  const skipQuestion = useCallback(
    async (questionId: string, isSkipped: boolean) => {
      if (!questionId) return;
      if (!questions) return;

      try {
        const response = await callTheServer({
          endpoint: "skipAboutQuestion",
          method: "POST",
          body: { questionId, isSkipped },
        });
        if (response.status === 200) {
          const newQuestions = questions
            .map((q) => (q._id === questionId ? { ...q, skipped: isSkipped } : q))
            .filter((q) => q.skipped === !isSkipped);
          setQuestions(newQuestions);
        } else {
          openErrorModal();
        }
      } catch (err) {}
    },
    [questions]
  );

  const memoizedQuestionsRow = useCallback(
    (props: any) => {
      return (
        <QuestionSlide
          key={props.index}
          isSelf={isSelf}
          submitResponse={submitResponse}
          skipQuestion={skipQuestion}
          data={props.data}
        />
      );
    },
    [isSelf, submitResponse]
  );

  const handleFetchQuestions = useCallback(
    async (query?: string) => {
      if (status !== AuthStateEnum.AUTHENTICATED) return;

      const data = await fetchQuestions({
        userName,
        showType,
        searchQuery: query,
        skip: hasMore ? questions && questions.length : undefined,
      });

      const { questions: questionsList } = data;
      setQuestions(questionsList);
      setHasMore(questionsList.length === 21);
    },
    [userName, hasMore, showType, status]
  );

  const handleSearch = (searchQuery: string) => {
    setSearchQuery(searchQuery);

    if (searchQuery.length % 4 === 0 || searchQuery.length === 0) {
      handleFetchQuestions(searchQuery);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleFetchQuestions();
    }
  };

  useEffect(() => {
    if (!userName) return;
    if (!showType) return;
    handleFetchQuestions();
  }, [showType, userName]);

  const overlayText = isSelf
    ? showType === "new"
      ? "No new questions"
      : "Nothing found"
    : "Nothing found";

  const overlayIcon = isSelf ? (
    showType === "new" ? (
      <IconCheckbox className="icon" />
    ) : (
      <IconCircleOff className="icon" />
    )
  ) : (
    <IconCircleOff className="icon" />
  );

  const overlayButton = isSelf ? (
    showType !== "new" ? undefined : (
      <Button mt={8} variant="default" onClick={() => router.push(`/club/${userName}`)}>
        Return
      </Button>
    )
  ) : undefined;

  return (
    <ClubModerationLayout userName={userName} pageType="answers">
      <Stack className={classes.content}>
        <Group className={classes.controlWrapper}>
          {isSelf && (
            <SegmentedControl
              data={showTypes}
              value={showType}
              onChange={handleChangeSegment}
              w="100%"
            />
          )}
          {(!isSelf || showType !== "new") && (
            <TextInput
              placeholder="Search questions"
              w="100%"
              onChange={(e) => handleSearch(e.currentTarget.value)}
              rightSection={
                <IconSearch className="icon" onClick={() => handleSearch(searchQuery)} />
              }
              onKeyDown={onKeyDown}
            />
          )}
        </Group>

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
                <ListComponent
                  items={questions}
                  rowGutter={16}
                  render={memoizedQuestionsRow}
                  className={classes.list}
                />
              ) : (
                <OverlayWithText text={overlayText} icon={overlayIcon} button={overlayButton} />
              )}
            </Accordion>
            {hasMore && (
              <ActionIcon
                variant="default"
                className={classes.getMoreButton}
                onClick={() => handleFetchQuestions(searchQuery)}
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
