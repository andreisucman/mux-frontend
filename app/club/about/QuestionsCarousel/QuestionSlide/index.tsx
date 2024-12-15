import React, { useMemo, useState } from "react";
import { IconUpload } from "@tabler/icons-react";
import { Button, rem, Stack, Text } from "@mantine/core";
import TextareaComponent from "@/components/TextAreaComponent";
import { AboutQuestionType } from "../../EditClubAbout";
import { SubmitAboutResponseType } from "../../types";
import RecordingButton from "../RecordingButton";
import classes from "./QuestionSlide.module.css";

type Props = {
  question: AboutQuestionType;
  submitResponse: (args: SubmitAboutResponseType) => Promise<void>;
};

export default function QuestionSlide({ question, submitResponse }: Props) {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [audioBlobs, setAudioBlobs] = useState<Blob[] | null>(null);

  const textExists = text.trim().length > 0;

  const heading = useMemo(
    () => (
      <Stack className={classes.headingStack}>
        <Text size="xs" c="dimmed">
          Create bio:
        </Text>

        <div className={classes.questionText}>
          <span style={{ marginRight: rem(6) }}>{question.question}</span>
          <RecordingButton
            transcribeOnEnd
            setText={setText}
            setAudioBlobs={setAudioBlobs}
            setIsLoading={setIsLoading}
          />
        </div>
      </Stack>
    ),
    [question.asking, question.question]
  );
  return (
    <Stack className={classes.slideContent}>
      <TextareaComponent
        text={text}
        heading={heading}
        setText={setText}
        placeholder={"Type your response here or click 'Record' and speak it"}
        isLoading={isLoading}
      />

      <Button
        className={classes.submitButton}
        disabled={!textExists || isLoading}
        onClick={() =>
          submitResponse({
            question: question.question,
            reply: text,
            audioBlobs,
            setIsLoading,
            setText,
          })
        }
      >
        <IconUpload className="icon" style={{ marginRight: rem(6) }} /> Submit answer
      </Button>
    </Stack>
  );
}
