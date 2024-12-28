import React, { useCallback, useState } from "react";
import { IconUpload, IconX } from "@tabler/icons-react";
import { Accordion, ActionIcon, Button, Group, rem, Stack } from "@mantine/core";
import TextareaComponent from "@/components/TextAreaComponent";
import RecordingButton from "../RecordingButton";
import { AboutQuestionType, SubmitAboutResponseType } from "../types";
import classes from "./QuestionSlide.module.css";

type Props = {
  data: AboutQuestionType;
  submitResponse: (args: SubmitAboutResponseType) => Promise<void>;
  skipQuestion: (questionId: string) => Promise<boolean>;
};

export default function QuestionSlide({ data, submitResponse, skipQuestion }: Props) {
  const { _id, question, answer, skipped } = data;

  const [text, setText] = useState(answer || "");
  const [isSkipped, setIsSkipped] = useState(skipped);
  const [isLoading, setIsLoading] = useState(false);

  const textExists = text?.trim()?.length > 0;
  const textIsDirty = text !== answer;

  const handleSkipQuestion = useCallback(async () => {
    const isSuccess = await skipQuestion(_id);
    setIsSkipped(isSuccess);
  }, [_id]);

  return (
    <Accordion.Item value={_id}>
      <Accordion.Control>
        <Group className={classes.header}>
          <div className={classes.questionText}>
            <span style={{ marginRight: rem(6) }}>{question}</span>
            <RecordingButton transcribeOnEnd setText={setText} setIsLoading={setIsLoading} />
          </div>
          {!isSkipped && (
            <ActionIcon variant="default" size="sm" onClick={handleSkipQuestion} component="div">
              <IconX className="icon" />
            </ActionIcon>
          )}
        </Group>
      </Accordion.Control>
      <Accordion.Panel>
        <Stack className={classes.slideContent}>
          <TextareaComponent
            text={text}
            setText={setText}
            placeholder={"Type your response here or click 'Record' and speak it"}
            isLoading={isLoading}
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
        </Stack>
      </Accordion.Panel>
    </Accordion.Item>
  );
}
