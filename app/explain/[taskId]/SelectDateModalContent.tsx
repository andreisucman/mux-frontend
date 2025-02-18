import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Stack } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";

type Props = {
  cloneTask: ({ startingDate }: { startingDate: Date | null }) => Promise<string | undefined>;
};

export default function SelectDateModalContent({ cloneTask }: Props) {
  const [recreateTaskOnDate, setRecreateTaskOnDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onClick = async () => {
    setIsLoading(true);
    const newTaskId = await cloneTask({
      startingDate: recreateTaskOnDate,
    });
    if (newTaskId) router.replace(`/explain/${newTaskId}`);
    setIsLoading(false);
  };

  return (
    <Stack flex={1}>
      <DatePickerInput
        value={recreateTaskOnDate}
        onChange={setRecreateTaskOnDate}
        placeholder="Select starting date"
        minDate={new Date()}
      />
      <Button
        loading={isLoading}
        disabled={isLoading || !recreateTaskOnDate}
        variant="default"
        onClick={onClick}
      >
        Recreate task
      </Button>
    </Stack>
  );
}
