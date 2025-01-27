import React, { useState } from "react";
import { Button, Stack } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";

type Props = {
  cloneTask: ({ startingDate }: { startingDate: Date | null }) => Promise<void>;
};

export default function RecreateDateModalContent({ cloneTask }: Props) {
  const [recreateTaskOnDate, setRecreateTaskOnDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    setIsLoading(true);
    await cloneTask({
      startingDate: recreateTaskOnDate,
    });
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
