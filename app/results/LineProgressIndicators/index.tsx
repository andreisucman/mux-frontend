import React, { useMemo } from "react";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { Collapse, Divider, Group, Progress, rem, Stack, Text } from "@mantine/core";
import { upperFirst, useDisclosure } from "@mantine/hooks";
import { BeforeAfterType } from "@/app/types";
import { getRingColor } from "@/helpers/utils";
import classes from "./LineProgressIndicators.module.css";

type Props = {
  customStyles?: { [key: string]: any };
  record: BeforeAfterType;
  title?: string;
};

export default function LineProgressIndicators({ customStyles, record, title }: Props) {
  const { scores, scoresDifference = {} } = record || {};
  const { overall = 0, explanations, ...rest } = scores || {};
  const [indicatorsOpen, { toggle: toggleOpenIndicators }] = useDisclosure(false);

  const restFeatures = Object.entries(rest);
  const showOverall = restFeatures.length > 1;
  const allFeatures = showOverall ? [["overall", overall], ...restFeatures] : (restFeatures as any);

  const renderIndicator = ([label, value]: [string, number], index: number) => {
    const scoreDifferenceValue = scoresDifference[label];
    const differenceColor = scoreDifferenceValue >= 0 ? "green.7" : "red.7";
    const color = getRingColor(value);
    let previousValue = Number(value) - scoreDifferenceValue;
    let previousBarValue = Number(value);

    return (
      <Group key={`${label}-${index}`} gap="sm">
        <Text size="sm" lineClamp={1}>
          {upperFirst(label)}
        </Text>

        <Progress.Root className={classes.barRoot} size={18}>
          <Progress.Section value={previousBarValue} color={color}>
            <Progress.Label
              >
              {previousValue.toFixed(0)}
            </Progress.Label>
          </Progress.Section>
          {scoreDifferenceValue !== 0 && (
            <Progress.Section value={Math.abs(scoreDifferenceValue)} color={differenceColor}>
              <Progress.Label style={{ overflow: "unset" }}>
                {scoreDifferenceValue > 0
                  ? `+${scoreDifferenceValue.toFixed(0)}`
                  : scoreDifferenceValue.toFixed(0)}
              </Progress.Label>
            </Progress.Section>
          )}
        </Progress.Root>
      </Group>
    );
  };

  const firstThreeIndicators = useMemo(
    () => allFeatures.slice(0, 3).map(renderIndicator),
    [allFeatures, scoresDifference]
  );

  const restIndicators = useMemo(
    () => allFeatures.slice(3).map(renderIndicator),
    [allFeatures, scoresDifference]
  );

  const chevron = indicatorsOpen ? (
    <IconChevronUp className="icon icon__small" />
  ) : (
    <IconChevronDown className="icon icon__small" />
  );

  return (
    <Stack className={classes.container} style={customStyles || {}}>
      <Stack className={classes.wrapper}>
        {title && (
          <Text c="dimmed" size="xs">
            {title}
          </Text>
        )}
        <Stack className={`${classes.indicatorsWrapper} scrollbar`}>
          {firstThreeIndicators}
          {restIndicators.length > 0 && (
            <>
              <Divider
                label={
                  <Group c="dimmed" className={classes.labelGroup} onClick={toggleOpenIndicators}>
                    {chevron}
                  </Group>
                }
              />
              <Collapse in={indicatorsOpen}>
                <Stack gap={8}>{restIndicators}</Stack>
              </Collapse>
            </>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}
