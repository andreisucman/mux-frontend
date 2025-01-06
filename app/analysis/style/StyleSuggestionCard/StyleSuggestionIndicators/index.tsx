import React, { useState } from "react";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { Collapse, Divider, Group, rem, Stack, Text } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import { outlookStyles } from "@/app/analysis/style/SelectStyleGoalModalContent/outlookStyles";
import StyleIndicatorRow from "./StyleIndicatorRow";
import { SimpleStyleType } from "./types";
import classes from "./StyleSuggestionIndicators.module.css";

type Props = {
  lines?: number;
  title?: string;
  hideCollapse?: boolean;
  record: SimpleStyleType | null;
  customStyles?: { [key: string]: any };
};

export default function StyleSuggestionIndicators({
  record,
  title,
  lines = 3,
  hideCollapse,
  customStyles,
}: Props) {
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
      {title && (
        <Text size="xs" c="dimmed" className={classes.title}>
          {title}
        </Text>
      )}
      {styleKeys?.slice(0, lines).map((key: string, index: number) => {
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
      {!hideCollapse && (
        <>
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
              {styleKeys?.slice(lines).map((key: string, index: number) => {
                const relevantStyle = outlookStyles.find((obj) => obj.name === key);
                return (
                  <StyleIndicatorRow
                    name={upperFirst(relevantStyle?.name || "")}
                    icon={relevantStyle?.icon}
                    value={Number(styleValues?.[index + lines] || 0)}
                    key={index + lines}
                  />
                );
              })}
            </Stack>
          </Collapse>
        </>
      )}
    </Stack>
  );
}
