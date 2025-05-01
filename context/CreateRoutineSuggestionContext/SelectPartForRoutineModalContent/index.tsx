import React from "react";
import { useRouter } from "next/navigation";
import { Button, Group, Stack } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import { modals } from "@mantine/modals";
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
        const { part: key } = part;

        const icon = partIcons[key];
        const text = upperFirst(key);

        const render = (
          <Group gap={8}>
            {icon} {text}
          </Group>
        );

        return (
          <Button
            variant="default"
            key={index}
            onClick={() => handleClick(`/suggest/select-concerns?part=${key}`)}
          >
            {render}
          </Button>
        );
      })}
    </Stack>
  );
}
