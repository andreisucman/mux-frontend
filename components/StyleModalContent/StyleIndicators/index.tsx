import React, { memo, useState } from "react";
import { Collapse, Divider, Stack } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import { outlookStyles } from "@/app/analysis/style/SelectStyleGoalModalContent/outlookStyles";
import { SimpleStyleType } from "../types";
import IndicatorRow from "./IndicatorRow";
import classes from "./StyleIndicators.module.css";

type Props = {
  record: SimpleStyleType | null;
  customStyles?: { [key: string]: any };
};

function StyleIndicators({ record, customStyles }: Props) {
  const [collapseOpen, setCollapseOpen] = useState(false);
  const { analysis, compareAnalysis } = record || {};

  const analysisKeys = Object.keys(analysis || {});

  return (
    <Stack className={classes.container} style={customStyles ? customStyles : {}}>
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
      <Divider
        onClick={() => setCollapseOpen((prev) => !prev)}
        label="Show more"
        labelPosition="center"
        style={{ cursor: "pointer" }}
      />
      {analysisKeys && (
        <Collapse in={collapseOpen} onChange={() => setCollapseOpen((prev) => !prev)}>
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
        </Collapse>
      )}
    </Stack>
  );
}

export default memo(StyleIndicators);
