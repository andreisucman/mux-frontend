import React from "react";
import { Accordion } from "@mantine/core";

type Props = {
  data: {
    question: string;
    answer: string;
  };
};

export default function AboutRow({ data }: Props) {
  const { question, answer } = data;
  return (
    <Accordion.Item value={question}>
      <Accordion.Control>{question}</Accordion.Control>
      <Accordion.Panel>{answer}</Accordion.Panel>
    </Accordion.Item>
  );
}
