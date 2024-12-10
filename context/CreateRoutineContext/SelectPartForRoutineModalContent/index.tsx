import React from "react";
import Link from "@/helpers/custom-router/patch-router/link";
import { IconStack2 } from "@tabler/icons-react";
import { Button, rem, Stack } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import Timer from "@/components/Timer";
import { TypeEnum } from "@/types/global";
import { partIconMap } from "./partIconMap";

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
          <IconStack2 className="icon" style={{ marginRight: rem(8) }} /> All
        </Button>
      )}
      {parts.map((part, index) => {
        const { part: key, date } = part;
        const isCooldown = date && new Date(date) > new Date();
        const text = `${partIconMap[key]} ${upperFirst(key)}`;
        const render = !!isCooldown ? (
          <Timer date={date} text={`${partIconMap[key]} Next routine after`} showDays />
        ) : (
          text
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
