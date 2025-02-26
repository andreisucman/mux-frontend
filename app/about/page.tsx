"use client";

import React, { useState } from "react";
import { Accordion, Stack, Text, Title } from "@mantine/core";
import { data } from "./data";
import classes from "./about.module.css";
import PageHeader from "@/components/PageHeader";

export const runtime = "edge";

export default function AnswersPage() {
  const [openValue, setOpenValue] = useState<string | null>(data[0].question);

  const accordionRows = data.map(({ question, answer }) => (
    <Accordion.Item value={question} key={question}>
      <Accordion.Control>
        <Title order={5}>{question}</Title>
      </Accordion.Control>
      <Accordion.Panel>{answer}</Accordion.Panel>
    </Accordion.Item>
  ));

  return (
    <Stack className={`${classes.container} mediumPage`}>
      <PageHeader title="About" />
      <Accordion
        value={openValue}
        onChange={setOpenValue}
        className={classes.accordion}
        chevron={false}
        variant="separated"
        classNames={{
          root: classes.root,
          item: classes.item,
          chevron: classes.chevron,
          control: classes.control,
          content: classes.accordionContent,
        }}
      >
        {accordionRows}
      </Accordion>
    </Stack>
  );
}
