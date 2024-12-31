import React, { memo, useState } from "react";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { Collapse, Divider, Group, Stack, Text } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import { outlookStyles } from "@/app/analysis/style/SelectStyleGoalModalContent/outlookStyles";
import { SimpleStyleType } from "../types";
import IndicatorRow from "./IndicatorRow";
import classes from "./StyleIndicators.module.css";

type Props = {
  record: SimpleStyleType | null;
  title?: string;
  customStyles?: { [key: string]: any };
};

function StyleIndicators({ record, title, customStyles }: Props) {
  const [collapseOpen, setCollapseOpen] = useState(false);
  const { analysis, compareAnalysis } = record || {};

  const analysisKeys = Object.keys(analysis || {});

  const icon = collapseOpen ? (
    <IconChevronUp className="icon icon__small" />
  ) : (
    <IconChevronDown className="icon icon__small" />
  );

  return (
    <Stack className={classes.container} style={customStyles ? customStyles : {}}>
      {title && (
        <Text c="dimmed" size="xs" mb={4}>
          {title}
        </Text>
      )}
      <Stack gap={8}>
        {analysisKeys.slice(0, 3).map((key: string, index: number) => {
          const relevantStyle = outlookStyles.find((obj) => obj.name === key);
          const { name, icon } = relevantStyle || {};
          const initialValue = compareAnalysis ? compareAnalysis[key] : 0;
          const finalValue = analysis ? analysis[key] : 0;
          return (
            <IndicatorRow
              key={index}
              icon={icon}
              name={upperFirst(name || "")}
              values={[initialValue, finalValue - initialValue]}
            />
          );
        })}
      </Stack>
      <Divider
        onClick={() => setCollapseOpen((prev) => !prev)}
        label={
          <Group gap={8}>
            {icon} Show {collapseOpen ? "less" : "more"}
          </Group>
        }
        labelPosition="center"
        style={{ cursor: "pointer" }}
        mt={8}
      />
      {analysisKeys && (
        <Collapse in={collapseOpen} onChange={() => setCollapseOpen((prev) => !prev)} mt={8}>
          <Stack gap={8}>
            {analysisKeys.slice(3).map((key: string, index: number) => {
              const relevantStyle = outlookStyles.find((obj) => obj.name === key);
              const { name, icon } = relevantStyle || {};
              const initialValue = compareAnalysis ? compareAnalysis[key] : 0;
              const finalValue = analysis ? analysis[key] : 0;
              return (
                <IndicatorRow
                  key={index}
                  icon={icon}
                  name={upperFirst(name || "")}
                  values={[initialValue, finalValue - initialValue]}
                />
              );
            })}
          </Stack>
        </Collapse>
      )}
    </Stack>
  );
}

export default memo(StyleIndicators);
