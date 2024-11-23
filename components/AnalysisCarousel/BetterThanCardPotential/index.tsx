import React, { useMemo } from "react";
import { IconNotes } from "@tabler/icons-react";
import { rem, Skeleton, Stack, Text } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import signIn from "@/functions/signIn";
import { useRouter } from "@/helpers/custom-router/patch-router/router";
import { getFromLocalStorage } from "@/helpers/localStorage";
import { getRingColor } from "@/helpers/utils";
import { FormattedRatingType, TypeEnum } from "@/types/global";
import GlowingButton from "../../GlowingButton";
import ComparisonStack from "../BetterThanCard/ComparisonStack";
import classes from "./BetterThanCardPotential.module.css";

type Props = {
  userId?: string;
  type: TypeEnum;
  title: string;
  authStatus: "unauthenticated" | "authenticated" | "loading" | "unknown";
  potentiallyHigherThan: { [key: string]: number };
  potentialRecord: { [key: string]: FormattedRatingType | null | number };
};

function BetterThanCardPotential({
  type,
  userId,
  title,
  authStatus,
  potentiallyHigherThan,
  potentialRecord,
}: Props) {
  const router = useRouter();
  const { width: containerWidth, height: containerHeight, ref } = useElementSize();

  const potentialLabels: string[] = Object.keys(potentialRecord)
    .filter((key) => key !== "overall")
    .filter(Boolean);
  const potentialValues = Object.values(potentialRecord)
    .filter((rec) => typeof rec !== "number")
    .filter(Boolean);

  const runningAnalyses: { [key: string]: any } | null = getFromLocalStorage("runningAnalyses");
  const isAnalysisRunning = runningAnalyses?.[type];

  const buttonText = isAnalysisRunning
    ? "Check progress"
    : authStatus === "authenticated"
      ? "Go to routines"
      : "Create routine";

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

  function handleClick() {
    if (authStatus === "authenticated") {
      router.push(`/a/routine?type=${type}`);
    } else {
      signIn({ localUserId: userId });
    }
  }

  const percentage = Math.round(potentiallyHigherThan.overall);
  const highlight = `${percentage}%`;
  const highlightText = `Overall you can look better than ${percentage}% of users in your age group.`;
  const fewRows = partCircleObjects.length === 1;

  const ringSize = useMemo(
    () =>
      fewRows
        ? containerWidth * 0.3
        : Math.min(containerHeight * 0.08, containerHeight / partCircleObjects.length),
    [containerHeight > 0]
  );

  return (
    <Skeleton className="skeleton" visible={containerHeight === 0}>
      <Stack className={classes.container} ref={ref}>
        <Text ta="left" w="100%" fz={14} c="dimmed">
          {title}
        </Text>

        <GlowingButton
          text={buttonText}
          onClick={handleClick}
          icon={<IconNotes style={{ width: rem(20), height: rem(20) }} />}
          containerStyles={{
            width: "90%",
            flex: 0,
            margin: "0.5rem auto 0.5rem",
          }}
          buttonStyles={{
            gap: rem(8),
            alignItems: "center",
          }}
        />

        <Stack className={classes.wrapper}>
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
            const highlightText = `Your ${modelObject.label} can look better than of ${percentage}% of users in your age group.`;

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
      </Stack>
    </Skeleton>
  );
}

export default BetterThanCardPotential;
