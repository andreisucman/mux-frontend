"use client";

import React, { useMemo } from "react";
import { Skeleton, Stack, Text, Title } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import { AuthStateEnum } from "@/context/UserContext/types";
import getAppearanceVerdict from "@/helpers/getAppearanceVerdict";
import { getRingColor } from "@/helpers/utils";
import { FormattedRatingType, TypeEnum } from "@/types/global";
import ComparisonStack from "../BetterThanCard/ComparisonStack";
import classes from "./BetterThanCardPotential.module.css";

type Props = {
  userId?: string;
  ageInterval?: string;
  type: TypeEnum;
  title: string;
  authStatus: AuthStateEnum;
  potentiallyHigherThan: { [key: string]: number };
  potentialRecord: { [key: string]: FormattedRatingType | null | number };
};

function BetterThanCardPotential({
  title,
  ageInterval,
  potentiallyHigherThan,
  potentialRecord,
}: Props) {
  const { width: containerWidth, height: containerHeight, ref } = useElementSize();

  const potentialLabels: string[] = Object.keys(potentialRecord)
    .filter((key) => key !== "overall")
    .filter(Boolean);
  const potentialValues = Object.values(potentialRecord)
    .filter((rec) => typeof rec !== "number")
    .filter(Boolean);

  const partCircleObjects = useMemo(
    () =>
      potentialLabels
        .map((label, i) => [
          {
            label: label as string,
            value: potentialValues[i]?.overall,
            color: getRingColor(potentialValues[i]?.overall as number),
          },
        ])
        .filter((record) => record[0].value),
    [potentialValues.length]
  );

  const percentage = Math.round(potentiallyHigherThan.overall);
  const highlight = `${percentage}%`;
  const highlightText = `Overall you can look better than ${percentage}% of users in the ${ageInterval} age group.`;
  const fewRows = partCircleObjects.length === 1;

  const ringSize = useMemo(
    () =>
      fewRows
        ? containerWidth * 0.3
        : Math.min(containerHeight * 0.08, containerHeight / partCircleObjects.length),
    [containerHeight > 0]
  );

  const verdictTitle = useMemo(
    () => getAppearanceVerdict(potentialRecord.overall as number, true),
    [potentialRecord.overall]
  );

  return (
    <Skeleton className="skeleton" visible={containerHeight === 0}>
      <Stack className={classes.container} ref={ref}>
        <Text className={classes.title} c="dimmed">
          {title}
        </Text>
        <Title order={2} ta="center">
          {verdictTitle}
        </Title>
        {partCircleObjects.length > 1 && (
          <ComparisonStack
            higherThanNumber={percentage}
            highlight={highlight}
            highlightText={highlightText}
            ringData={[
              {
                label: "overall",
                value: potentialRecord.overall as number,
                color: getRingColor(potentialRecord.overall as number),
              },
            ]}
            ringSize={ringSize}
            isPotential={true}
          />
        )}
        {partCircleObjects.map((circleObject, index) => {
          const modelObject = circleObject[0];
          const percentage = Math.round(potentiallyHigherThan[modelObject.label]);
          const highlight = `${percentage}%`;
          const highlightText = `Your ${modelObject.label} can look better than of ${percentage}% of users in the ${ageInterval} age group.`;

          return (
            <ComparisonStack
              higherThanNumber={percentage}
              highlight={highlight}
              highlightText={highlightText}
              ringData={
                circleObject as {
                  value: number;
                  label: string;
                  color: string;
                }[]
              }
              isPotential={true}
              ringSize={ringSize}
              key={index}
            />
          );
        })}
      </Stack>
    </Skeleton>
  );
}

export default BetterThanCardPotential;
