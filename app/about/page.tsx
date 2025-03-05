"use client";

import React, { useState } from "react";
import { Accordion, Stack, Title } from "@mantine/core";
import PageHeader from "@/components/PageHeader";
import { data } from "./data";
import classes from "./about.module.css";

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
    <Stack className={`${classes.container} mediumPage`}>
      <PageHeader title="About" />
      <Accordion
        className={classes.accordion}
        variant="separated"
        classNames={{
          root: classes.root,
          item: classes.item,
          control: classes.control,
          content: classes.accordionContent,
        }}
        multiple
      >
        {accordionRows}
      </Accordion>
    </Stack>
  );
}
