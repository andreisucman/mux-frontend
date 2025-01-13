import React from "react";
import { Stack, Title } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import { CoachQuestionType } from "../types";
import QuestionRow from "./QuestionRow";
import classes from "./QuestionsList.module.css";

type Props = {
  type: string;
  questions?: CoachQuestionType[];
  title?: React.ReactNode;
  customStyles?: { [key: string]: any };
};

export default function QuestionsList({ title, questions, customStyles }: Props) {
  return (
    <Stack className={classes.container} style={customStyles ? customStyles : {}}>
      <Title order={3}>{upperFirst(title as string)}</Title>
      {questions && (
        <Stack className={classes.content}>
          {questions.map((record: CoachQuestionType, index: number) => {
            const icon = record.icon;
            return (
              <QuestionRow
                key={index}
                icon={icon}
                onClick={() => {
                  if (record.onClick) record.onClick();
                }}
                color={record.color}
                title={record.question}
              />
            );
          })}
        </Stack>
      )}
    </Stack>
  );
}
