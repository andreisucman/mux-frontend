"use client";

import React from "react";
import { Skeleton, Title } from "@mantine/core";
import { StyleAnalysisType } from "@/types/global";
import StyleExplanationContainer from "./StyleExplanationContainer";
import StyleSuggestionIndicators from "./StyleSuggestionIndicators";
import classes from "./StyleSuggestionCard.module.css";

type Props = {
  styleData?: StyleAnalysisType | null;
  title?: string;
  children?: React.ReactNode;
  titleStyles?: { [key: string]: any };
  customStyles?: { [key: string]: any };
};

export default function StyleSuggestionCard({ title, children, styleData }: Props) {
  const {
    createdAt = "",
    analysis,
    mainUrl = { name: "original", url: "" },
    _id = "",
    userId = "",
    urls = [],
  } = styleData || {};

  const keys = Object.keys(analysis || {});
  const values = Object.values(analysis || {});

  const record = {
    _id,
    userId,
    urls,
    mainUrl,
    styleKeys: keys,
    styleValues: values,
    createdAt,
  };

  return (
    <Skeleton visible={!styleData} className={`${classes.container} skeleton`}>
      {title && (
        <Title className={classes.title} order={3}>
          {title}
        </Title>
      )}
      <StyleSuggestionIndicators record={record} lines={3} hideCollapse />
      {children}
      <StyleExplanationContainer title="Feedback" styleData={styleData} />
    </Skeleton>
  );
}
