import React from "react";
import { IconStack2 } from "@tabler/icons-react";
import { Button, Group, rem, Stack } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import Timer from "@/components/Timer";
import Link from "@/helpers/custom-router/patch-router/link";
import { partIcons } from "@/helpers/icons";
import { TypeEnum } from "@/types/global";

type Props = {
  parts: { part: string; date: Date | null }[];
  type: TypeEnum;
};

export default function SelectPartForRoutineModalContent({ parts, type }: Props) {
  const activeParts = parts.filter((part) => !part.date || new Date(part.date) < new Date());

  return (
    <Stack flex={1}>
      {activeParts.length > 1 && (
        <Button
          variant="default"
          component={Link}
          href={`/sort-concerns?type=${type}`}
          onClick={() => modals.closeAll()}
        >
          <IconStack2 className="icon" style={{ marginRight: rem(6) }} /> All
        </Button>
      )}
      {parts.map((part, index) => {
        const { part: key, date } = part;
        const isCooldown = date && new Date(date) > new Date();
        const icon = partIcons[key];
        const text = upperFirst(key);
        const render = !!isCooldown ? (
          <Timer date={date} text={`${partIcons[key]} Next routine after`} showDays />
        ) : (
          <Group gap={8}>
            {icon} {text}
          </Group>
        );
        return (
          <Button
            variant="default"
            key={index}
            disabled={!!isCooldown}
            component={Link}
            href={`/sort-concerns?type=${type}&part=${key}`}
            onClick={() => modals.closeAll()}
          >
            {render}
          </Button>
        );
      })}
    </Stack>
  );
}
