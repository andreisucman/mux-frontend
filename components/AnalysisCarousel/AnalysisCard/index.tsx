"use client";

import React, { useMemo } from "react";
import { Skeleton, Stack, Text } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import { getRingColor } from "@/helpers/utils";
import { FormattedRatingType, ProgressType } from "@/types/global";
import RowBlock from "./RowBlock";
import classes from "./AnalysisCard.module.css";

type Props = {
  title: string;
  currentRecord: { [key: string]: ProgressType | null | number };
  potentialRecord: { [key: string]: FormattedRatingType | null | number };
};

export default function AnalysisCard({ title, currentRecord, potentialRecord }: Props) {
  const { height: containerHeight, ref } = useElementSize();

  const partValues = Object.values(currentRecord)
    .filter((rec) => typeof rec !== "number")
    .filter(Boolean);
  const potentialPartValues = Object.values(potentialRecord)
    .filter((rec) => typeof rec !== "number")
    .filter(Boolean);

  const partKeys = Object.entries(potentialRecord)
    .filter(([key, value]) => key !== "overall" && Boolean(value))
    .map((g) => g[0]);

  const explanations = useMemo(
    () =>
      potentialPartValues
        .map((obj) => obj?.explanations)
        .map((obj) =>
          (obj || []).reduce((a: { [key: string]: any }, c) => {
            a[c!.feature] = c?.explanation;
            return a;
          }, {})
        ),
    [potentialPartValues.length]
  );

  const rings = useMemo(
    () =>
      partValues.map((obj) =>
        Object.entries((obj as ProgressType).scores)
          .filter(([key]) => key !== "overall")
          .map(([key, value]) => [
            {
              label: key,
              value,
              color: getRingColor(value),
            },
          ])
      ),
    [partValues.length]
  );

  const overalls = useMemo(
    () =>
      partValues.map((obj, i) =>
        Object.entries((obj as ProgressType).scores)
          .filter(([key, _]) => key === "overall")
          .map(([key, value]) => [
            {
              label: partKeys[i],
              value,
              color: getRingColor(value),
            },
          ])
      ),
    [partValues.length]
  );

  return (
    <Skeleton className="skeleton" visible={containerHeight === 0}>
      <Stack className={`${classes.container} scrollbar`} ref={ref}>
        <Text className={classes.title} c="dimmed">
          {title}
        </Text>
        <Stack className={classes.content}>
          {rings.map((ringBlock, i) => (
            <RowBlock
              key={i}
              ringsGroup={ringBlock}
              explanations={explanations[i]}
              titleObject={overalls[i][0]}
            />
          ))}
        </Stack>
      </Stack>
    </Skeleton>
  );
}
