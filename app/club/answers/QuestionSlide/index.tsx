import React, { useState } from "react";
import { IconUpload, IconX } from "@tabler/icons-react";
import { Accordion, ActionIcon, Button, Group, rem, Skeleton, Stack } from "@mantine/core";
import TextareaComponent from "@/components/TextAreaComponent";
import useShowSkeleton from "@/helpers/useShowSkeleton";
import RecordingButton from "../RecordingButton";
import { AboutQuestionType, SubmitAboutResponseType } from "../types";
import classes from "./QuestionSlide.module.css";

type Props = {
  data: AboutQuestionType;
  isSelf: boolean;
  submitResponse: (args: SubmitAboutResponseType) => Promise<void>;
  skipQuestion: (questionId: string) => Promise<void>;
};

export default function QuestionSlide({ isSelf, data, submitResponse, skipQuestion }: Props) {
  const { _id, question, answer, skipped } = data;

  const [text, setText] = useState(answer || "");
  const [isLoading, setIsLoading] = useState(false);

  const textExists = text?.trim()?.length > 0;
  const textIsDirty = text !== answer;

  const showSkeleton = useShowSkeleton();

  return (
    <Skeleton visible={showSkeleton}>
      <Accordion.Item value={_id}>
        <Accordion.Control>
          <Group className={classes.header}>
            <span className={classes.questionText}>{question}</span>
            {!skipped && (
              <ActionIcon
                variant="default"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  skipQuestion(_id);
                }}
                component="div"
              >
                <IconX className="icon icon__small" />
              </ActionIcon>
            )}
          </Group>
        </Accordion.Control>
        <Accordion.Panel>
          <Stack className={classes.slideContent}>
            <TextareaComponent
              text={text}
              setText={setText}
              readOnly={!isSelf}
              placeholder={"Type your response here or click 'Record' and speak it"}
              isLoading={isLoading}
            />

            {isSelf && (
              <Group className={classes.buttons}>
                <RecordingButton
                  size="sm"
                  transcribeOnEnd
                  setText={setText}
                  setIsLoading={setIsLoading}
                />
                <Button
                  className={classes.submitButton}
                  disabled={!textExists || !textIsDirty || isLoading}
                  onClick={() =>
                    submitResponse({
                      question: question,
                      answer: text,
                      setIsLoading,
                      setText,
                    })
                  }
                >
                  <IconUpload className="icon" style={{ marginRight: rem(6) }} /> Submit answer
                </Button>
              </Group>
            )}
          </Stack>
        </Accordion.Panel>
      </Accordion.Item>
    </Skeleton>
  );
}
