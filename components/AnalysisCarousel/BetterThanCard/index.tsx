import React, { useMemo } from "react";
import { Skeleton, Stack, Text, Title } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import getAppearanceVerdict from "@/helpers/getAppearanceVerdict";
import { getRingColor } from "@/helpers/utils";
import { ProgressType, TypeEnum } from "@/types/global";
import ComparisonStack from "./ComparisonStack";
import classes from "./BetterThanCard.module.css";

type Props = {
  userId: string | null;
  ageInterval?: string;
  title: string;
  type: TypeEnum;
  currentlyHigherThan: { [key: string]: number };
  progressRecord: { [key: string]: ProgressType | null | number };
};

function BetterThanCard({ currentlyHigherThan, progressRecord, ageInterval, title }: Props) {
  const { width: containerWidth, height: containerHeight, ref } = useElementSize();
  const partValues = Object.values(progressRecord)
    .filter((rec) => typeof rec !== "number")
    .filter(Boolean);

  const partCircleObjects = useMemo(
    () =>
      partValues.flatMap((obj) =>
        Object.entries((obj as ProgressType).scores)
          .filter(([key]) => key === "overall")
          .map(([_, value]) => [
            {
              label: obj?.part as string,
              value,
              color: getRingColor(value),
            },
          ])
      ),
    [partValues.length]
  );

  const fewRows = partCircleObjects.length === 1;

  const ringSize = useMemo(() => {
    const size = fewRows
      ? Math.max(100, containerWidth * 0.1)
      : Math.min(containerHeight * 0.08, containerHeight / partCircleObjects.length);
    return size;
  }, [containerHeight]);

  const percentage = Math.round(currentlyHigherThan.overall);
  const highlight = `${percentage}%`;
  const highlightText = `Overall you look better than ${percentage}% of users in the ${ageInterval} age group.`;

  const verdictTitle = useMemo(
    () => getAppearanceVerdict(progressRecord.overall as number),
    [progressRecord.overall]
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
                value: progressRecord.overall as number,
                color: getRingColor(progressRecord.overall as number),
              },
            ]}
            ringSize={ringSize}
            isPotential={false}
          />
        )}
        {partCircleObjects.map((circleObject, index) => {
          const modelObject = circleObject[0];
          const percentage = Math.round(currentlyHigherThan[modelObject.label]);
          const highlight = `${percentage}%`;
          const highlightText = `Your ${modelObject.label} looks better than of ${percentage}% of users in the ${ageInterval} age group.`;

          return (
            <ComparisonStack
              higherThanNumber={percentage}
              highlight={highlight}
              highlightText={highlightText}
              ringData={circleObject}
              ringSize={ringSize}
              isPotential={false}
              key={index}
            />
          );
        })}
      </Stack>
    </Skeleton>
  );
}

export default BetterThanCard;
