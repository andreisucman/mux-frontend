import React from "react";
import { useRouter } from "next/navigation";
import { Button, Group, Stack } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import Timer from "@/components/Timer";
import { partIcons } from "@/helpers/icons";

type Props = {
  parts: { part: string; date: Date | null }[];
};

export default function SelectPartForRoutineModalContent({ parts }: Props) {
  const router = useRouter();

  const handleClick = (url: string) => {
    router.push(url);
    modals.closeAll();
  };

  return (
    <Stack flex={1}>
      {parts.map((part, index) => {
        const { part: key, date } = part;

        const isCooldown = date && new Date(date) > new Date();
        const icon = partIcons[key];
        const text = upperFirst(key);

        const render = !!isCooldown ? (
          <Timer
            date={date}
            children={
              <Group gap={8}>
                {icon} Next {key} after
              </Group>
            }
            showDays
          />
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
            onClick={() => handleClick(`/add-details?part=${key}`)}
          >
            {render}
          </Button>
        );
      })}
    </Stack>
  );
}
