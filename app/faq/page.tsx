"use client";

import React from "react";
import { Accordion, Stack, Title } from "@mantine/core";
import PageHeader from "@/components/PageHeader";
import { data } from "./data";

export const runtime = "edge";

export default function AnswersPage() {
  const accordionRows = data.map(({ question, answer }) => (
    <Accordion.Item value={question} key={question}>
      <Accordion.Control>
        <Title order={5}>{question}</Title>
      </Accordion.Control>
      <Accordion.Panel>{answer}</Accordion.Panel>
    </Accordion.Item>
  ));

  return (
    <Stack className={`mediumPage`}>
      <PageHeader title="About" />
      <Accordion
        variant="separated"
        classNames={{
          root: "accordionRoot",
          content: "accordionContent",
          chevron: "accordionChevron",
          item: "accordionItem",
        }}
        multiple
        pb="20%"
      >
        {accordionRows}
      </Accordion>
    </Stack>
  );
}
