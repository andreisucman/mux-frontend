import React, { useState } from "react";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { Collapse, Divider, Group, rem, Stack, Text } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import { outlookStyles } from "@/app/analysis/style/SelectStyleGoalModalContent/outlookStyles";
import StyleIndicatorRow from "./StyleIndicatorRow";
import { SimpleStyleType } from "./types";
import classes from "./StyleSuggestionIndicators.module.css";

type Props = {
  record: SimpleStyleType | null;
  customStyles?: { [key: string]: any };
};

export default function StyleSuggestionIndicators({ record, customStyles }: Props) {
  const [collapseOpen, setCollapseOpen] = useState(false);
  const { styleKeys, styleValues } = record || {};

  const dividerText = collapseOpen ? "Hide more" : "Show more";
  const dividerIcon = collapseOpen ? (
    <IconChevronUp className="icon" style={{ marginRight: rem(6) }} />
  ) : (
    <IconChevronDown className="icon" style={{ marginRight: rem(6) }} />
  );

  return (
    <Stack className={classes.container} style={customStyles ? customStyles : {}}>
      <Text size="xs" c="dimmed" mb={rem(4)}>
        Analysis
      </Text>
      {styleKeys?.slice(0, 3).map((key: string, index: number) => {
        const relevantStyle = outlookStyles.find((obj) => obj.name === key);
        return (
          <StyleIndicatorRow
            name={upperFirst(relevantStyle?.name || "")}
            icon={relevantStyle?.icon}
            value={Number(styleValues?.[index] || 0)}
            key={index}
          />
        );
      })}
      <Divider
        onClick={() => setCollapseOpen((prev) => !prev)}
        label={
          <Group gap={0}>
            {dividerIcon}
            {dividerText}
          </Group>
        }
        labelPosition="center"
        style={{ cursor: "pointer", margin: "0.25rem 0" }}
      />
      <Collapse in={collapseOpen} onChange={() => setCollapseOpen((prev) => !prev)}>
        <Stack gap={4}>
          {styleKeys?.slice(3).map((key: string, index: number) => {
            const relevantStyle = outlookStyles.find((obj) => obj.name === key);
            return (
              <StyleIndicatorRow
                name={upperFirst(relevantStyle?.name || "")}
                icon={relevantStyle?.icon}
                value={Number(styleValues?.[index + 3] || 0)}
                key={index + 3}
              />
            );
          })}
        </Stack>
      </Collapse>
    </Stack>
  );
}
