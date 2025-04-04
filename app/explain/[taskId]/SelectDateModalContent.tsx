import React, { useState } from "react";
import { Button, Stack } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";

type Props = {
  buttonText: string;
  lastDate?: Date;
  onSubmit: ({ startDate }: { startDate: Date | null }) => any;
};

export default function SelectDateModalContent({ buttonText, lastDate, onSubmit }: Props) {
  const [recreateTaskOnDate, setRecreateTaskOnDate] = useState<Date | null>(new Date());
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    setIsLoading(true);
    await onSubmit({
      startDate: recreateTaskOnDate,
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
        maxDate={lastDate ? new Date(lastDate) : undefined}
      />
      <Button
        loading={isLoading}
        disabled={isLoading || !recreateTaskOnDate}
        variant="default"
        onClick={onClick}
      >
        {buttonText}
      </Button>
    </Stack>
  );
}
