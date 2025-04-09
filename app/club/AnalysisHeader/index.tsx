import React from "react";
import { IconChevronLeft } from "@tabler/icons-react";
import { ActionIcon, Group, Title } from "@mantine/core";
import { useRouter } from "@/helpers/custom-router";

type Props = {
  title: string;
  type?: string | null;
  onTypeChange?: (newType?: null | string) => void;
};

export default function AnalysisHeader({ title }: Props) {
  const router = useRouter();

  return (
    <Group>
      <ActionIcon variant="default" onClick={() => router.back()}>
        <IconChevronLeft className="icon" />
      </ActionIcon>
      <Title order={1} mr="auto">
        {title}
      </Title>
    </Group>
  );
}
