import React from "react";
import { Group, Progress, rem, Stack, Text } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import { getRingColor } from "@/helpers/utils";
import { SimpleProgressType } from "../types";
import classes from "./LineProgressIndicators.module.css";

type Props = {
  customStyles?: { [key: string]: any };
  record: SimpleProgressType;
  title?: string;
};

export default function LineProgressIndicators({ customStyles, record, title }: Props) {
  const { scores, scoresDifference } = record || {};
  const { overall = 0, explanations, ...rest } = scores || {};

  let restFeatures = Object.entries(rest);

  return (
    <Stack className={classes.container} style={customStyles ? customStyles : {}}>
      <Stack className={classes.wrapper}>
        {title && (
          <Text c="dimmed" size="xs">
            {title}
          </Text>
        )}
        <Stack gap={8}>
          {restFeatures.map(([label, value], index) => {
            const scoreDifferenceValue = scoresDifference[label];
            const differenceColor = scoreDifferenceValue > 0 ? "green.7" : "red.7";
            const color = getRingColor(value as number);
            return (
              <Group key={index}>
                {upperFirst(label)}
                <Progress.Root size={18} flex={1} w="100%">
                  <Progress.Section value={Number(value)} color={color}>
                    <Progress.Label>{String(value)}</Progress.Label>
                  </Progress.Section>
                  {scoreDifferenceValue > 0 && (
                    <Progress.Section
                      value={Number(scoreDifferenceValue)}
                      color={differenceColor}
                      style={{ minWidth: rem(30) }}
                    >
                      <Progress.Label>
                        {String(
                          scoreDifferenceValue > 0
                            ? `+${scoreDifferenceValue}`
                            : scoreDifferenceValue
                        )}
                      </Progress.Label>
                    </Progress.Section>
                  )}
                </Progress.Root>
              </Group>
            );
          })}
        </Stack>
      </Stack>
    </Stack>
  );
}
