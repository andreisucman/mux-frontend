import React from "react";
import { Group, RingProgress, Stack, Text, Title } from "@mantine/core";
import { streaksDescription } from "./data";
import classes from "./StreaksModalContent.module.css";

type Props = { streaksSections: { key: string; value: number }[] };

export default function StreaksModalContent({ streaksSections }: Props) {
  console.log("streaksSections", streaksSections);
  const rows = streaksSections.map((obj, index) => {
    const { key, value } = obj;
    const sections = [];

    if (value > 0) {
      sections.push({ value: 100, color: "var(--mantine-color-green-7)" });
    } else {
      sections.push({
        value: 0,
        color: "light-dark(var(--mantine-color-gray-4),var(--mantine-color-dark-4))",
      });
    }

    const descriptionObject = streaksDescription.find((obj) => obj.key === key);

    const { name, description } = descriptionObject || {};

    return (
      <Group className={classes.row} key={index}>
        <RingProgress
          size={72}
          thickness={8}
          label={
            <Stack className={classes.label}>
              <Text className={classes.text}>{value}</Text>
            </Stack>
          }
          sections={sections}
          classNames={{ label: classes.label }}
          rootColor={"light-dark(var(--mantine-color-gray-4),var(--mantine-color-dark-4))"}
        />
        <Stack className={classes.rowRight}>
          <Title order={5} component={"div"}>
            {name}
          </Title>
          <Text size="sm">{description}</Text>
        </Stack>
      </Group>
    );
  });
  return (
    <Stack>
      {rows}
      <Text ta="center" c="dimmed" size="sm" maw={300} m="auto">
        Streaks let you to claim rewards. Visit the Rewards page to see what you can claim.
      </Text>
    </Stack>
  );
}
