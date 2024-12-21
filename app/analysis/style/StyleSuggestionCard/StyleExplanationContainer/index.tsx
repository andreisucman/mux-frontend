import React, { useEffect, useState } from "react";
import { Group, SegmentedControl, Stack, Text } from "@mantine/core";
import { StyleAnalysisType } from "@/types/global";
import classes from "./StyleExplanationContainer.module.css";

type Props = {
  title: string;
  text?: string;
  size?: string;
  styleData?: StyleAnalysisType | null;
  controlTitle?: React.ReactNode;
  customStyles?: { [key: string]: any };
};

export default function StyleExplanationContainer({
  title,
  customStyles,
  styleData,
  size = "md",
}: Props) {
  const { currentDescription, currentSuggestion, matchSuggestion } = styleData || {};

  const [suggestionText, setSuggestionText] = useState<string>();
  const [segmentedControlValue, setSegmentedControlValue] = useState<string>();

  useEffect(() => {
    if (!suggestionText) setSuggestionText(matchSuggestion ? matchSuggestion : currentDescription);
    if (!segmentedControlValue)
      setSegmentedControlValue(matchSuggestion ? "matchSuggestion" : "current");
  }, [styleData]);

  const textArray = suggestionText?.split("\n");

  const segments = [
    { label: "Current", value: "current" },
    { label: "Suggestion", value: "currentSuggestion" },
  ];

  if (matchSuggestion) segments.push({ label: "Match", value: "matchSuggestion" });

  return (
    <Stack className={classes.container} style={customStyles ? customStyles : {}}>
      <Group justify="space-between">
        <Text size="xs" c="dimmed">
          {title}
        </Text>
        <SegmentedControl
          size="xs"
          value={segmentedControlValue}
          onChange={(value) => {
            setSegmentedControlValue(value);

            switch (value) {
              case "current":
                setSuggestionText(currentDescription);
                break;
              case "currentSuggestion":
                setSuggestionText(currentSuggestion);
                break;
              case "matchSuggestion":
                setSuggestionText(matchSuggestion);
                break;
            }
          }}
          data={segments}
        />
      </Group>

      <Stack className={`scrollbar ${classes.content}`}>
        <Stack className={classes.textWrapper}>
          {textArray?.map((textRow, index) => (
            <Text key={index} size={size} className={classes.description}>
              {textRow}
            </Text>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
}
